const multer = require('multer');
const fs = require('fs');
const path = require('path');
const logger = require('../winston/winstonLogger');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Only .png and .jpg images are allowed!'),
      logger.error('Error format file multer'),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const saveImgToFileSystem = (pathImage, fileImage) => {
  fs.writeFile(path.join(uploadDir, pathImage), fileImage, (err) => {
    if (err) {
      logger.error('Error when save image to file system');
    }
    logger.info('Image saved successfully.');
  });
};
module.exports = { upload, saveImgToFileSystem };
