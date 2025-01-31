import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(cors());


const uploadDir = './uploads/pdf';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: uploadDir, 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  
});


const upload = multer({ storage });


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


app.get('/next-payslip-number', (req, res) => {
  const payslipNumber = getNextPayslipNumber();
  res.json({ payslipNumber });
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const payslipNumber = getNextPayslipNumber();
  const filePath = `/uploads/pdf/${req.file.filename}`;

  res.json({
    message: 'File uploaded successfully',
    filePath,
    payslipNumber,
  });
});

app.get('/viewPayslip', (req, res) => {
  const payslipNumber = req.query.payslipNumber;
  const filePath = `./uploads/pdf/payslip_${payslipNumber}.pdf`;

  if (fs.existsSync(filePath)) {
    res.json({ filePath: `http://localhost:5000/uploads/pdf/payslip_${payslipNumber}.pdf` }); // Return absolute URL
  } else {
    res.status(404).json({ error: 'Payslip Not Found' });
  }
});



app.use('/uploads/pdf', express.static(uploadDir));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
