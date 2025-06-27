// utils/atsCalculator.js
import { generateSuggestions } from './aiProcessor.js';

// Main function to calculate ATS score
export const calculateAtsScore = async (resume, jobRole) => {
  try {
    const resumeText = resume.extractedText.toLowerCase();
    const skills = resume.skills.map(skill => skill.toLowerCase());

    // Calculate keyword matches
    const keywordAnalysis = calculateKeywordMatches(resumeText, jobRole.keywords || []);
    
    // Calculate skill matches
    const skillAnalysis = calculateSkillMatches(skills, jobRole.requiredSkills || []);
    
    // Calculate experience relevance
    const experienceScore = calculateExperienceRelevance(resume.experience, jobRole);

    // Calculate normalized scores
    const maxKeywordScore = jobRole.keywords?.reduce((sum, kw) => sum + (kw.weight || 1), 0) || 1;
    const maxSkillScore = jobRole.requiredSkills?.reduce((sum, skill) => sum + (skill.weight || 1), 0) || 1;

    const normalizedKeywordScore = (keywordAnalysis.score / maxKeywordScore) * 30;
    const normalizedSkillScore = (skillAnalysis.score / maxSkillScore) * 50;
    const normalizedExperienceScore = experienceScore * 20;

    const totalScore = Math.min(100, Math.round(
      normalizedKeywordScore + normalizedSkillScore + normalizedExperienceScore
    ));

    // Generate AI suggestions
    const analysisData = {
      missedKeywords: keywordAnalysis.missed,
      missedSkills: skillAnalysis.missed,
      currentScore: totalScore
    };

    const suggestions = await generateSuggestions(resume, jobRole, analysisData);

    return {
      atsScore: totalScore,
      matchedKeywords: keywordAnalysis.matched,
      matchedSkills: skillAnalysis.matched,
      missingKeywords: keywordAnalysis.missed.slice(0, 5),
      missingSkills: skillAnalysis.missed.slice(0, 5),
      suggestions: suggestions,
      breakdown: {
        keywordScore: Math.round(normalizedKeywordScore),
        skillScore: Math.round(normalizedSkillScore),
        experienceScore: Math.round(normalizedExperienceScore)
      }
    };

  } catch (error) {
    console.error('ATS calculation error:', error);
    throw new Error('Failed to calculate ATS score');
  }
};

// Calculate keyword matches
const calculateKeywordMatches = (resumeText, keywords) => {
  const matched = [];
  const missed = [];
  let score = 0;

  keywords.forEach(keyword => {
    const term = keyword.term?.toLowerCase() || keyword.toLowerCase();
    const synonyms = keyword.synonyms?.map(s => s.toLowerCase()) || [];
    const weight = keyword.weight || 1;

    const isMatched = resumeText.includes(term) ||
      synonyms.some(synonym => resumeText.includes(synonym));

    if (isMatched) {
      matched.push(keyword.term || keyword);
      score += weight;
    } else {
      missed.push(keyword.term || keyword);
    }
  });

  return { matched, missed, score };
};

// Calculate skill matches
const calculateSkillMatches = (resumeSkills, requiredSkills) => {
  const matched = [];
  const missed = [];
  let score = 0;

  requiredSkills.forEach(requiredSkill => {
    const skillName = requiredSkill.name?.toLowerCase() || requiredSkill.toLowerCase();
    const weight = requiredSkill.weight || 1;

    const isMatched = resumeSkills.some(skill =>
      skill.includes(skillName) || skillName.includes(skill)
    );

    if (isMatched) {
      matched.push(requiredSkill.name || requiredSkill);
      score += weight;
    } else {
      missed.push(requiredSkill.name || requiredSkill);
    }
  });

  return { matched, missed, score };
};

// Calculate experience relevance
const calculateExperienceRelevance = (experiences, jobRole) => {
  if (!experiences || experiences.length === 0) return 0;

  const relevantTerms = [
    ...(jobRole.keywords?.map(kw => kw.term?.toLowerCase() || kw.toLowerCase()) || []),
    ...(jobRole.requiredSkills?.map(skill => skill.name?.toLowerCase() || skill.toLowerCase()) || [])
  ];

  if (relevantTerms.length === 0) return 0.5; // Default score if no terms

  let relevanceScore = 0;
  const totalExperiences = experiences.length;

  experiences.forEach(exp => {
    const expText = `${exp.title || ''} ${exp.description || ''}`.toLowerCase();
    const matchedTerms = relevantTerms.filter(term => expText.includes(term));

    if (matchedTerms.length > 0) {
      relevanceScore += Math.min(1, matchedTerms.length / 5);
    }
  });

  return Math.min(1, relevanceScore / totalExperiences);
};

// Validate resume completeness
export const validateResumeCompleteness = (resume) => {
  const issues = [];

  if (!resume.contactInfo?.email) issues.push('Missing email address');
  if (!resume.contactInfo?.phone) issues.push('Missing phone number');
  if (!resume.experience || resume.experience.length === 0) issues.push('No work experience listed');
  if (!resume.education || resume.education.length === 0) issues.push('No education information');
  if (!resume.skills || resume.skills.length < 5) issues.push('Insufficient skills listed (less than 5)');

  return {
    isComplete: issues.length === 0,
    issues,
    completenessScore: Math.max(0, 100 - (issues.length * 20))
  };
};