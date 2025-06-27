import { promises as fs } from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Resume from '../models/Resume.js';
import JobRole from '../models/JobRole.js';
import { 
  calculateAtsScore, 
  extractSkillsWithAI, 
  validateResumeCompleteness,
  checkCohereHealth
} from '../utils/resumeAnalyzer.js';

// Text extraction with better error handling
async function extractTextFromFile(filePath, mimeType) {
  console.log(`Extracting text from: ${filePath}, type: ${mimeType}`);
  
  try {
    const fileBuffer = await fs.readFile(filePath);
    
    switch (mimeType) {
      case 'application/pdf':
        const pdfData = await pdf(fileBuffer);
        return pdfData.text;
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        return docxResult.value;
        
      case 'application/msword':
        // Basic .doc support (limited)
        return fileBuffer.toString('utf8');
        
      case 'text/plain':
        return fileBuffer.toString('utf8');
        
      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

// Enhanced skill extraction as fallback
function extractSkillsBasic(text) {
  const skillPatterns = [
    // Programming languages
    /\b(JavaScript|JS|TypeScript|TS|Python|Java|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|HTML|CSS|SQL)\b/gi,
    // Frameworks & Libraries
    /\b(React|ReactJS|Angular|Vue\.js|Node\.js|NodeJS|Express|Django|Flask|Spring|Laravel|Bootstrap|jQuery)\b/gi,
    // Databases
    /\b(MongoDB|MySQL|PostgreSQL|SQLite|Redis|Elasticsearch|Oracle|Firebase)\b/gi,
    // Cloud & Tools
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Git|GitHub|GitLab|Jenkins|Terraform|Linux|Windows)\b/gi,
    // Soft skills
    /\b(Leadership|Communication|Problem[\s-]*Solving|Project[\s-]*Management|Team[\s-]*Work|Agile|Scrum)\b/gi
  ];

  const skills = new Set();
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const skill = match.trim().replace(/[\s-]+/g, ' ');
        skills.add(skill);
      });
    }
  });

  return Array.from(skills);
}

// Enhanced contact info extraction
function extractContactInfo(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?[\d\s]{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const linkedinRegex = /(?:linkedin\.com\/in\/)([\w-]+)/gi;

  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const linkedinMatches = text.match(linkedinRegex) || [];

  return {
    email: emails[0] || null,
    phone: phones[0] || null,
    linkedin: linkedinMatches[0] || null
  };
}

// Basic experience extraction
function extractBasicExperience(text) {
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  const experiences = [];
  
  // Common job title patterns
  const jobTitlePatterns = [
    /\b(Software Engineer|Developer|Programmer|Manager|Analyst|Designer|Consultant|Specialist|Coordinator|Assistant|Director|VP|President|CEO|CTO|Lead|Senior|Junior)\b/gi
  ];

  for (let i = 0; i < lines.length && experiences.length < 5; i++) {
    const line = lines[i];
    
    for (const pattern of jobTitlePatterns) {
      if (pattern.test(line) && line.length < 100) {
        experiences.push({
          title: line.trim(),
          company: lines[i + 1]?.trim() || 'Company not specified',
          description: lines.slice(i + 2, i + 4).join(' ').trim() || 'Description not available',
          duration: 'Duration not specified'
        });
        break;
      }
    }
  }

  return experiences;
}

// Basic education extraction
function extractBasicEducation(text) {
  const educationKeywords = ['university', 'college', 'institute', 'school', 'bachelor', 'master', 'phd', 'degree', 'certification'];
  const lines = text.split('\n').filter(line => line.trim().length > 5);
  const education = [];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (educationKeywords.some(keyword => lowerLine.includes(keyword)) && education.length < 3) {
      education.push({
        degree: line.trim(),
        institution: 'Institution not specified',
        year: 'Year not specified'
      });
    }
  }

  return education;
}

// Upload resume with comprehensive error handling
export async function uploadResume(req, res) {
  const io = req.app.get('io');
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a resume file.'
      });
    }

    const { originalname, filename, mimetype, path: filePath, size } = req.file;
    
    console.log(`📄 Processing: ${originalname} (${(size / 1024).toFixed(2)} KB)`);

    // Extract text from file
    let extractedText;
    try {
      extractedText = await extractTextFromFile(filePath, mimetype);
      console.log(`✅ Text extracted: ${extractedText.length} characters`);
      
      if (extractedText.length < 100) {
        throw new Error('Extracted text is too short. File may be corrupted or empty.');
      }
    } catch (extractionError) {
      console.error('Text extraction failed:', extractionError);
      
      // Clean up uploaded file
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.error('File cleanup failed:', cleanupError);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Failed to extract text from the file. Please ensure the file is not corrupted.',
        error: extractionError.message
      });
    }

    // Check AI service health
    const healthCheck = await checkCohereHealth();
    const useAI = healthCheck.status === 'healthy';
    
    if (!useAI) {
      console.log('⚠️  AI service unavailable, using basic extraction methods');
    }

    // Extract information
    const contactInfo = extractContactInfo(extractedText);
    const basicExperience = extractBasicExperience(extractedText);
    const basicEducation = extractBasicEducation(extractedText);
    
    let extractedSkills;
    if (useAI) {
      try {
        console.log('🤖 Using AI for skill extraction...');
        extractedSkills = await extractSkillsWithAI(extractedText);
        console.log(`✅ AI extracted ${extractedSkills.length} skills`);
      } catch (aiError) {
        console.log('⚠️  AI skill extraction failed, using basic method');
        extractedSkills = extractSkillsBasic(extractedText);
      }
    } else {
      extractedSkills = extractSkillsBasic(extractedText);
      console.log(`✅ Basic extraction found ${extractedSkills.length} skills`);
    }

    // Create resume document
    const resumeData = {
      originalName: originalname,
      fileName: filename,
      filePath,
      fileSize: size,
      mimeType: mimetype,
      extractedText,
      contactInfo,
      extractedSkills,
      experience: basicExperience,
      education: basicEducation,
      uploadedBy: 'anonymous'
    };

    const resume = new Resume(resumeData);
    const savedResume = await resume.save();

    // Validate completeness
    const validation = validateResumeCompleteness(savedResume);

    // Emit real-time update
    if (io) {
      io.emit('resumeUploaded', {
        resumeId: savedResume._id,
        filename: originalname,
        status: 'completed',
        aiUsed: useAI
      });
    }

    console.log(`✅ Resume processed successfully: ${savedResume._id}`);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and processed successfully',
      data: {
        resumeId: savedResume._id,
        filename: originalname,
        extractedSkillsCount: extractedSkills.length,
        contactInfo: contactInfo,
        validation: validation,
        aiProcessingUsed: useAI,
        extractedSkills: extractedSkills.slice(0, 10), // Show first 10 skills
        ...(healthCheck.status === 'unhealthy' && {
          warning: 'AI processing was unavailable. Basic extraction methods were used.',
          suggestion: healthCheck.suggestion
        })
      }
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);

    // Clean up file if it exists
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('File cleanup failed:', cleanupError);
      }
    }

    // Emit error event
    if (req.app.get('io')) {
      req.app.get('io').emit('resumeUploadError', {
        filename: req.file?.originalname || 'unknown',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to process resume',
      error: error.message,
      suggestion: 'Please try uploading the file again. If the problem persists, try converting your resume to PDF format.'
    });
  }
}

// Analyze resume with improved error handling
export async function analyzeResume(req, res) {
  try {
    const { id: resumeId, jobRoleId } = req.params;

    console.log(`🔍 Starting analysis for resume: ${resumeId}, job role: ${jobRoleId}`);

    const [resume, jobRole] = await Promise.all([
      Resume.findById(resumeId),
      JobRole.findById(jobRoleId)
    ]);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (!jobRole) {
      return res.status(404).json({
        success: false,
        message: 'Job role not found'
      });
    }

    console.log(`🔍 Analyzing resume for job role: ${jobRole.title}`);

    // Check AI service health
    const healthCheck = await checkCohereHealth();
    const useAI = healthCheck.status === 'healthy';

    if (!useAI) {
      console.log('⚠️  AI service unavailable, analysis will have basic suggestions');
    }

    // Calculate ATS score
    const analysis = await calculateAtsScore(resume, jobRole);

    // Update resume with analysis results
    if (!resume.analysisResults) {
      resume.analysisResults = [];
    }

    resume.analysisResults.push({
      jobRole: jobRoleId,
      analyzedAt: new Date(),
      atsScore: analysis.atsScore,
      matchedKeywords: analysis.matchedKeywords,
      matchedSkills: analysis.matchedSkills,
      suggestions: analysis.suggestions,
      aiUsed: useAI
    });

    // Keep only last 5 analyses
    if (resume.analysisResults.length > 5) {
      resume.analysisResults = resume.analysisResults.slice(-5);
    }

    await resume.save();

    console.log(`✅ Analysis completed: ATS Score ${analysis.atsScore}/100`);

    res.json({
      success: true,
      message: 'Resume analysis completed successfully',
      data: {
        resumeId,
        jobRole: {
          id: jobRole._id,
          title: jobRole.title,
          level: jobRole.level,
          industry: jobRole.industry
        },
        atsScore: analysis.atsScore,
        breakdown: analysis.breakdown,
        matchedKeywords: analysis.matchedKeywords,
        matchedSkills: analysis.matchedSkills,
        missingKeywords: analysis.missingKeywords,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        aiProcessingUsed: useAI,
        analyzedAt: new Date().toISOString(),
        ...(healthCheck.status === 'unhealthy' && {
          warning: 'AI suggestions were limited due to service unavailability',
          suggestion: healthCheck.suggestion
        })
      }
    });

  } catch (error) {
    console.error('❌ Resume analysis error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message,
      suggestion: 'Please try again. If the problem persists, the AI service may be temporarily unavailable.'
    });
  }
}

// Get single resume
export async function getResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume',
      error: error.message
    });
  }
}

// Get all resumes
export async function getAllResumes(req, res) {
  try {
    const resumes = await Resume.find()
      .select('-extractedText') // Exclude large text field for list view
      .sort({ uploadedAt: -1 })
      .limit(50); // Limit to prevent large responses

    res.json({
      success: true,
      data: {
        resumes,
        count: resumes.length
      }
    });
  } catch (error) {
    console.error('Get all resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve resumes',
      error: error.message
    });
  }
}

// Delete resume
export async function deleteResume(req, res) {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.filePath);
      console.log(`🗑️  File deleted: ${resume.filePath}`);
    } catch (fileError) {
      console.warn('Could not delete file:', fileError.message);
    }

    // Delete from database
    await Resume.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
}

// Health check endpoint
export async function checkAPIHealth(req, res) {
  try {
    const healthCheck = await checkCohereHealth();
    
    res.json({
      success: true,
      aiService: healthCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
}