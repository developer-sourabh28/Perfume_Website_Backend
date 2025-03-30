const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp with the original file extension
    },
});

// File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|png|jpg|gif/; // Allowed file types
    const mimeType = allowedTypes.test(file.mimetype); // Check MIME type
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension

    if (mimeType && extName) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false); // Reject file
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
