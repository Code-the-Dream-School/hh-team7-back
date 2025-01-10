const multer = require('multer');
const path = require('path');
const MAX_SIZE = 1024 * 1024 * 5; // 5MB size of image
const cloudinary = require('cloudinary').v2; 
const streamifier = require('streamifier');
const dotenv = require('dotenv');
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: 'djmLPoaKrffABpFWVFZD8n1b5Vg',
});

const storage = multer.memoryStorage();

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

const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();
  let folderName = req.originalUrl.includes('/users') ? 'event_images/' : 'user_images/'; 
  const timestamp = Math.floor(Date.now() / 1000);
  console.log("foldername", folderName)
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: folderName,
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
      }
      console.log("result",result);
      req.cloudinaryResult = result; // Save the result from Cloudinary (contains secure_url, public_id, etc.)
      console.log("req.cloudinaryResult",req.cloudinaryResult)
      next(); 
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
}).single('file');

module.exports = { upload, uploadToCloudinary };
