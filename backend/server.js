require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System instructions for the models
const FAN_ASSISTANT_SYSTEM_PROMPT = `
You are the official FIFA 2026 StadiumSmart GenAI Assistant.
Your goal is to help fans with navigation, stadium amenities, match schedules, accessibility features, and transportation.
You must be polite, concise, and helpful. You should answer in the language the user speaks.
If a user asks about accessibility, prioritize providing clear paths, elevator locations, and sensory room info.
`;

const STAFF_OPERATIONS_SYSTEM_PROMPT = `
You are an Operational Intelligence AI for stadium staff.
Given simulated crowd data, provide actionable recommendations to optimize stadium operations, 
such as gate management, vendor stocking, and crowd diversion.
Keep recommendations short and highly actionable.
`;

// Fan Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: FAN_ASSISTANT_SYSTEM_PROMPT,
        }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Operations Insights Endpoint
app.post('/api/insights', async (req, res) => {
  try {
    const { crowdData } = req.body;
    if (!crowdData) {
      return res.status(400).json({ error: 'Crowd data is required' });
    }

    const prompt = `Current simulated crowd data: ${JSON.stringify(crowdData)}. What are your operational recommendations?`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: STAFF_OPERATIONS_SYSTEM_PROMPT,
            temperature: 0.2
        }
    });

    res.json({ recommendations: response.text });
  } catch (error) {
    console.error('Error in /api/insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // For testing
