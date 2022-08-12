const multer = require('multer');
const path = require('path');
const { MAX_IMAGE_SIZE_IN_BYTES } = require('../../utils/Constants');

const storageTypes = {
  local: multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
    },
    filename: (request, _, cb) => {
      const fileKey = `${request.targetFileName}.jpeg`;
      cb(null, fileKey);
    },
  }),
};

const MulterConfigImg = {
  storage: storageTypes.local,
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES,
  },
  fileFilter: (_, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};

module.exports = { MulterConfigImg };