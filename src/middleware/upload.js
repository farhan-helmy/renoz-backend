const multer = require("multer");

module.exports.upload = multer({
  limits: {
    fileSize: 1000000,
  },
  dest: "uploads/",
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});