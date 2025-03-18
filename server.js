const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static('./'));

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir, { recursive: true });
}

// Serve photos directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'photos/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Handle photo uploads
app.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  return res.json({
    success: true,
    photoUrl: `/photos/${req.file.filename}`,
    message: 'Photo uploaded successfully'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});