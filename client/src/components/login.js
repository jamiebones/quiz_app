import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { LoginUser } from "../graphql/queries";
import state from "../applicationState";
import { useRecoilState } from "recoil";
import store from "store";
const LoginStyle = styled.div``;


const Login = (props) => {
  const [isAuth, setAuthState] = useRecoilState(state.authState);
  const [currentLoginUser, setcurrentLoginUser] = useRecoilState(
    state.currentLoginUserState
  );
  const [token, setToken] = useRecoilState(state.authToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    //check if the person is authenticated already
  }, []);

  const [loginUserFunction, loginUserResult] = useLazyQuery(LoginUser, {
    variables: {
      username,
      password,
    },
  });
  useEffect(() => {
    if (
      submitted &&
      loginUserResult.data &&
      loginUserResult.data.loginUser &&
      loginUserResult.called
    ) {
      const typename = loginUserResult.data.loginUser.__typename;

      if (typename === "Error") {
        const message = loginUserResult.data.loginUser.message;
        setError(message);
        setSubmitted(false);
      } else {
        //we are good here we have the baggages here
        const {
          id,
          token,
          username,
          userType,
          name,
        } = loginUserResult.data.loginUser;
        store.set("authToken", token);
        store.set("isAuth", true);
        store.set(
          "currentLoginUser",
          JSON.stringify({ id, username, userType, name })
        );
        setAuthState(true);
        setcurrentLoginUser({ id, username, userType, name });
        setToken(token);
        setSubmitted(false);

        if (userType === "super-admin") {
          props.history.push("/dashboard");
        } else if (userType === "student") {
          props.history.push("/exam_start_page");
        }
      }
    }
    if (loginUserResult.error) {
      setSubmitted(false);
    }
  }, [loginUserResult, submitted]);

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    loginUserFunction();
  };

  const onInputChange = (event) => {
    event.stopPropagation();
    const name = event.target.name;
    switch (name) {
      case "password":
        setPassword(event.target.value);
        break;
      case "username":
        setUsername(event.target.value);
        break;
      default:
        break;
    }
  };
  return (
    <LoginStyle>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <p className="text-danger">{error}</p>
          <p className="lead text-center">Login</p>
          <form onSubmit={submitForm}>
            <div className="form-group">
              <label htmlFor="name">Username </label>
              <input
                type="text"
                className="form-control"
                name="username"
                aria-describedby="username"
                value={username}
                onChange={onInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={onInputChange}
                name="password"
                value={password}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitted}
            >
              {submitted ? "bypassing security....." : "login"}
            </button>
          </form>
        </div>
      </div>
    </LoginStyle>
  );
};

export default Login;
