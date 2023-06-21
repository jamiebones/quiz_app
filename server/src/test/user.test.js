import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import models from "../models";

import { expressApp, apolloServer } from "../startup";
import configIndex from "../config";

import dotenv from 'dotenv';

dotenv.config();

const { createAdminUser } = configIndex;

let appServer;
let dbConnection;

const baseUrl = "http://localhost:7000/graphql";
const request = supertest(baseUrl);
describe("Quiz examination test ", function () {
  this.timeout(10000);
  before(async () => {
    //set up the testing infrastruture
    //set up the database connection here
  
    let url = `mongodb://mongodb_cbt:27017/test`;
    dbConnection = await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
      keepAlive: true,
    });

    const app = expressApp();
    const { server, httpServer } = await apolloServer(app);
    appServer = server
    appServer.applyMiddleware({ app, path: "/graphql" });
    httpServer.listen({ port: 7000 }, () => {
      console.log("Apollo Server started on http://localhost:7000/graphql");
    });
    
  });

  beforeEach(async () => {
    //create an admin user
    await createAdminUser();
  });

  afterEach(async () => {
    //clear the user collection after each run
    await models.User.deleteMany({});
  });

  after(async () => {
    //stop the server here
    await appServer.stop();
    dbConnection.connection.db.dropDatabase();
    dbConnection.disconnect();
    console.log("database connection closed");
  });

  it("it will start up very well", async () => {
    expect(2).to.equal(2);
  });

  describe("User functionality test", function () {
    it("check and create an admin user", async () => {
      const findAdmin = await models.User.findOne();
      expect(findAdmin).to.not.equal(null);
    });

    it("check should return the users and user status", (done) => {
      const active = true;
      const queryData = `{usersByStatus(status: ${active}, offset: 0 ){
        users {
          id
          password
          username
          userType
          name
          active
        }
        totalUsersByStatus
      }}`;
      request
        .post("?")
        .send({
          query: queryData,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.usersByStatus.users).to.be.an("array");
          done();
        });
    });

    it("should be able to login in the user", (done) => {
      const loginData = `{loginUser(username: "admin@admin.com", password: "password"){
        ... on User {
           username
           username
           name
           userType
           token
           id
        }

        ... on Error {
          message
          type
        }
       
      }}`;

      request
        .post("?")
        .send({
          query: loginData,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.loginUser.username).to.be.equal(
            "admin@admin.com"
          );
          expect(res.body.data.loginUser.token).to.not.equal(null);
          done();
        });
    });

    it("should not login the user in but show an error message", (done) => {
      const loginData = `{loginUser(username: "admin@admin.com", password: "password1ee23"){
        ... on User {
           username
           username
           name
           userType
           token
           id
        }

        ... on Error {
          message
          type
        }
       
      }}`;

      request
        .post("?")
        .send({
          query: loginData,
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.data.loginUser.message).to.be.equal(
            "Incorrect credentials"
          );
          done();
        });
    });

    it("it should not login because account is inactive", (done) => {
      const query = models.User.updateOne(
        { username: "admin@admin.com" },
        { $set: { active: false } }
      );

      query.exec().then(() => {
        const loginData = `{loginUser(username: "admin@admin.com", password: "password"){
          ... on User {
             username
             username
             name
             userType
             token
             id
          }
  
          ... on Error {
            message
            type
          }
         
        }}`;

        request
          .post("?")
          .send({
            query: loginData,
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.loginUser.message).to.be.equal(
              "Login unsuccessful because your account is inactive. Please contact admin"
            );
            done();
          });
      });
    });

    it("should be able to create a student account", async () => {
      const loginData = `{loginUser(username: "admin@admin.com", password: "password"){
      ... on User {
         token
         id
      }
      ... on Error {
        message
        type
      }
     
    }}`;

      let req = await request.post("?").send({
        query: loginData,
      });

      expect(req.statusCode).to.be.equal(200);
      const token = req.body.data.loginUser.token;
      const data = `mutation {createUser(username: "jamiebones", password: "password", 
                                    userType: "student", name: "John Doe", active: true){

                            ... on User {
                                username
                              }
                            ... on Error {
                                message
                            }
                       }
                  }`;

      req = await request
        .post("?")
        .set("Authorization", "Bearer " + token)
        .send({
          query: data,
        })
      expect(req.statusCode).to.be.equal(200);
      expect(req.body.data.createUser.username).to.not.equal(null);
    });
  });
});
