const multer = require('multer');
const path = require('path');
const MAX_SIZE = 1024 * 1024 * 5; // 5MB size of image

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.includes('/users')) {
      const dirPath = path.join(__dirname, '../../public/uploads/users');
      cb(null, dirPath);
    } else {
      const dirPath = path.join(__dirname, '../../public/uploads');
      cb(null, dirPath);
    }
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' 
  ) {
    if (file.size > MAX_SIZE) {
      cb(
        new Error('Image size too large, max 5MB allowed', 'LIMIT_FILE_SIZE'),
        false
      );
    }
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Upload jpeg or png',
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
}).single('file');

module.exports = upload;
