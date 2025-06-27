// utils/fileProcessor.js
import { promises as fs } from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Extract text from different file types
export const extractTextFromFile = async (filePath, mimeType) => {
  try {
    console.log(`Extracting text from: ${filePath}, type: ${mimeType}`);

    if (mimeType === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } 
    
    if (mimeType.includes('word') || mimeType.includes('document')) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } 
    
    if (mimeType === 'text/plain') {
      return await fs.readFile(filePath, 'utf8');
    }
    
    throw new Error(`Unsupported file type: ${mimeType}`);
    
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
};