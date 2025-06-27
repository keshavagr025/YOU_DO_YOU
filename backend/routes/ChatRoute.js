import express from 'express';

const router = express.Router();

router.post('/ai', async (req, res) => {
  const { message } = req.body;

  // You can reuse fetchAIResponse here if exported from index.js
  res.json({ text: "Fallback if socket isn't used" });
});

export default router;
