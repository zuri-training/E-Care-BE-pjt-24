const { API_KEY, API_SECRET, CLOUD_NAME } = require('../src/core/config');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const util = require('util');

const unLinkFile = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const imageId = function () {
  return Math.random().toString(36).substr(2, 4);
};

const uploadFile = async (path) => {
  const response = await cloudinary.uploader.upload(path, { public_id: `uploads/images${imageId()}` });
  await unLinkFile(path);
  return response.secure_url;
};

const upload = multer({ dest: 'uploads/' }).single('image');

module.exports = {
  upload,
  uploadFile,
};
