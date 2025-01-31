import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors()); // Enable CORS for frontend requests

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads', // Folder where files will be saved
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({ storage });

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
