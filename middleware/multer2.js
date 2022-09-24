const upload = require("./multer");

const multipleUpload = async (req, res, next) => {
  try {
    console.log('Multer: ', req.files);
    console.log('Multer: ', req.file);
    await upload(req, res);
    if (req.files.length <= 0) {
      return res.status(400).json({
        msg:"You must select at least 1 file.",
        result:false
      });
    }
    return next();
  } catch (error) {
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        msg:"Too many files to upload. Max Limit is 1",
        result:false
      });
    }
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        msg:"File size limit exceeded. Max size allowed is 15mb.",
        result:false
      });
    }
    console.log('Error: ', error);
    return res.status(500).json({
        msg:"Error when trying uploading Nft",
        result:false,
        error:error
    });
  }
};

module.exports = {
  multipleUpload: multipleUpload
};