import cors from "cors";
import express from "express";
import config from "../config";
import uploadFile from "../middleware/uploadFile";
const morgan = require("morgan");

const createServer = function () {
  const app = express();
  app.use(cors());
  //app.use(express.static(path.join(__dirname, "../uploads")));
  if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined", { stream: config.winston.stream }));
  }

  //REST Route for uploading files
  app.post("/api/uploadFile", uploadFile);

  app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    config.winston.error(
      `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    res.status(err.status || 500);
  });

  return app;
};

export default createServer;