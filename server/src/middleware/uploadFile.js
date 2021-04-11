import fs from "fs";
import path from "path";
const formidable = require("formidable");
import method from "../methods";

const uploadFile = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = 600 * 1024 * 1024;
  form.parse(req, async function (err, fields, files) {
    try {
      const date = new Date();
      const dateString = date.getMilliseconds() + date.getSeconds() + "_";
      var oldPath = files.digitalAssets.path;
      var newPath =
        path.resolve("./uploads") + "/" + dateString + files.digitalAssets.name;
      var rawData = fs.readFileSync(oldPath);
      fs.writeFileSync(newPath, rawData);
      //this is where we call the method to save the file in the database
      const assetData = {
        fileName: dateString + files.digitalAssets.name,
        assetType: fields.assetType,
        description: fields.description,
        fileType: files.digitalAssets.type,
      };
      await method.digitalAsset.createDigitalAssets(assetData);
      return res.send("Successfully uploaded");
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export default uploadFile;
