require('dotenv').config();

// Pre-flight check for API Key
if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV !== 'test') {
  console.error("FATAL ERROR: GEMINI_API_KEY is not defined in the environment variables.");
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const NodeCache = require('node-cache');
const { body, validationResult } = require('express-validator');

const { generateFanResponse, generateStaffInsights } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---

// Strict Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  }
}));

// CORS Configuration (restrict to frontend origin in production)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression for Efficiency
app.use(compression());

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// In-Memory Cache for Efficiency
const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache for 5 mins

// --- Endpoints ---

/**
 * Fan Assistant Endpoint
 */
app.post(
  '/api/chat',
  [
    body('message').isString().notEmpty().withMessage('Message is required and must be a string'),
    body('language').optional().isString()
  ],
  async (req, res) => {
    // Input Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, language = 'English' } = req.body;
      
      // Cache check
      const cacheKey = `chat_${language}_${message}`;
      const cachedResponse = apiCache.get(cacheKey);
      if (cachedResponse) {
        return res.json({ reply: cachedResponse, cached: true });
      }

      // Generate response
      const reply = await generateFanResponse(message, language);
      
      // Set cache
      apiCache.set(cacheKey, reply);
      
      res.json({ reply, cached: false });
    } catch (error) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  }
);

/**
 * Operations Insights Endpoint
 */
app.post(
  '/api/insights',
  [
    body('crowdData').isObject().withMessage('Crowd data must be a valid object')
  ],
  async (req, res) => {
    // Input Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { crowdData } = req.body;
      
      // Cache check based on stringified data
      const cacheKey = `insights_${JSON.stringify(crowdData)}`;
      const cachedResponse = apiCache.get(cacheKey);
      if (cachedResponse) {
        return res.json({ recommendations: cachedResponse, cached: true });
      }

      // Generate insights
      const recommendations = await generateStaffInsights(crowdData);
      
      // Set cache
      apiCache.set(cacheKey, recommendations);

      res.json({ recommendations, cached: false });
    } catch (error) {
      console.error('Error in /api/insights:', error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  }
);

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
