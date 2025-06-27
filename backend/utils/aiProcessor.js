// utils/aiProcessor.js
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extract structured data from resume text using AI
export const extractResumeData = async (text) => {
  try {
    const prompt = `
Analyze this resume text and extract structured information. Return ONLY valid JSON:

${text}

Required JSON structure:
{
  "skills": ["skill1", "skill2"],
  "contactInfo": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username"
  },
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name", 
      "duration": "Jan 2020 - Dec 2022",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "year": "2020",
      "gpa": "3.8"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('No valid JSON found in AI response');

  } catch (error) {
    console.error('AI extraction error:', error);
    
    // Return default structure if AI fails
    return {
      skills: [],
      contactInfo: {},
      experience: [],
      education: [],
      certifications: [],
    };
  }
};

// Generate improvement suggestions using AI
export const generateSuggestions = async (resume, jobRole, analysisData) => {
  try {
    const prompt = `
As an ATS expert, provide 5 specific suggestions to improve this resume for a ${jobRole.title} position.

Current ATS Score: ${analysisData.currentScore}/100
Missing Keywords: ${analysisData.missedKeywords.join(', ')}
Missing Skills: ${analysisData.missedSkills.join(', ')}
Current Skills: ${resume.skills.join(', ')}

Format:
1. [Suggestion]
2. [Suggestion]
3. [Suggestion]
4. [Suggestion]
5. [Suggestion]
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(suggestion => suggestion.length > 0)
      .slice(0, 5);

    return suggestions.length > 0 ? suggestions : getDefaultSuggestions(analysisData);

  } catch (error) {
    console.error('AI suggestions error:', error);
    return getDefaultSuggestions(analysisData);
  }
};

// Fallback suggestions when AI fails
const getDefaultSuggestions = (analysisData) => {
  return [
    `Add missing keywords: ${analysisData.missedKeywords.slice(0, 3).join(', ')}`,
    `Include relevant skills: ${analysisData.missedSkills.slice(0, 3).join(', ')}`,
    'Quantify achievements with specific numbers and metrics',
    'Use strong action verbs at the beginning of bullet points',
    'Ensure ATS-friendly formatting with clear section headers'
  ];
};