import fs from "fs";
import path from "path";

const storeFS = ({ stream, filename }) => {
  const date = new Date();
  const dateString = date.getMilliseconds() + date.getSeconds();
  const uploadDir =
    path.resolve("./uploads") + "/" + dateString + "-" + filename;

  const filePath = dateString + "-" + filename;

  return new Promise((resolve, reject) =>
    stream
      .on("error", (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(uploadDir);
        reject(error);
      })
      .pipe(fs.createWriteStream(uploadDir))
      .on("error", (error) => reject(error))
      .on("finish", () => resolve(filePath))
  );
};

export default storeFS;
