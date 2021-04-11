const upload = require("../middleware/upload");

const multipleUpload = async (req, res) => {
  try {
    
    await upload(req, res);
  
    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }
    //here is where we strip the files and stuffs and upload to mongodb
    //map through req.files
    console.log(req.files)
    return res.send(`Files has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports  = multipleUpload;

//export default multipleUpload;
