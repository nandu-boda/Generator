import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(cors()); // Enable CORS for frontend requests

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/pdf', // Change the destination folder
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({ storage });

// Function to get the next payslip number
const getNextPayslipNumber = () => {
  const counterFile = './counter.txt';
  let payslipNumber = 1;

  if (fs.existsSync(counterFile)) {
    const data = fs.readFileSync(counterFile, 'utf8');
    payslipNumber = parseInt(data, 10) + 1;
  }

  fs.writeFileSync(counterFile, payslipNumber.toString(), 'utf8');
  return payslipNumber;
};

// Route to fetch the next payslip number
app.get('/next-payslip-number', (req, res) => {
  const payslipNumber = getNextPayslipNumber();
  res.json({ payslipNumber });
});

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const payslipNumber = getNextPayslipNumber();

  res.json({
    message: 'File uploaded successfully',
    filePath: `/uploads/pdf/${req.file.filename}`,
    payslipNumber: payslipNumber,
  });
});
// Route to search for a payslip by number
app.get('/search-payslip', (req, res) => {
  const payslipNumber = req.query.payslipNumber;
  const filePath = `./uploads/pdf/payslip_${payslipNumber}.pdf`;

  if (fs.existsSync(filePath)) {
      res.json({ filePath: `/uploads/pdf/payslip_${payslipNumber}.pdf` });
  } else {
      res.status(404).json({ error: 'Payslip not found' });
  }
});


// Serve uploaded files statically
app.use('/uploads/pdf', express.static('uploads/pdf')); // Update the static folder

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
