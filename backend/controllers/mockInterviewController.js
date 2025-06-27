import { GoogleGenerativeAI } from '@google/generative-ai';
import cohere from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();
cohere.init(process.env.COHERE_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestion = async (req, res) => {
  const { role } = req.body;
  const prompt = `You are an interviewer. Ask 1 technical interview question for a ${role} role.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const question = result.response.text();
    res.json({ question });
  } catch (err) {
    console.warn('⚠️ Gemini failed, using Cohere fallback');
    try {
      const cohereRes = await cohere.generate({
        model: 'command',
        prompt,
        max_tokens: 100,
      });
      res.json({ question: cohereRes.body.generations[0].text.trim() });
    } catch (e) {
      console.error('❌ Cohere also failed:', e.message);
      res.status(500).json({ error: 'Both Gemini and Cohere failed.' });
    }
  }
};

export const evaluateAnswer = async (req, res) => {
  const { question, answer, role } = req.body;

  const prompt = `
Evaluate the following answer given for a ${role} interview question.

Q: ${question}
A: ${answer}

Give:
- Score (out of 10)
- What’s right
- What’s wrong
- Better answer
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    res.json({ feedback: result.response.text() });
  } catch (err) {
    console.warn('⚠️ Gemini failed, using Cohere fallback');
    try {
      const cohereRes = await cohere.generate({
        model: 'command',
        prompt,
        max_tokens: 300,
      });
      res.json({ feedback: cohereRes.body.generations[0].text.trim() });
    } catch (e) {
      console.error('❌ Cohere also failed:', e.message);
      res.status(500).json({ error: 'Both Gemini and Cohere failed.' });
    }
  }
};


// not use