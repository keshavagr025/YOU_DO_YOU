// routes/resumeRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import {
  uploadResume,
  analyzeResume,
  getResume,
  getAllResumes,
  deleteResume,
  checkAPIHealth
} from '../controllers/resumeController.js';

const router = express.Router();

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
    console.log('📁 Created uploads directory');
  }
};

// Initialize uploads directory
ensureUploadsDir();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  console.log('📄 Processing file:', file.originalname, 'Type:', file.mimetype);
  
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;
  
  if (allowedTypes.includes(fileExt) && allowedMimes.includes(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: PDF, DOC, DOCX, TXT. Received: ${fileExt}`));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Use "resume" as the field name for file upload.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error.',
          error: error.message
        });
    }
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

// Routes
router.post('/upload', upload.single('resume'), handleMulterError, uploadResume);
router.post('/:id/analyze/:jobRoleId', analyzeResume);
router.get('/health', checkAPIHealth);
router.get('/:id', getResume);
router.get('/', getAllResumes);
router.delete('/:id', deleteResume);

export default router;