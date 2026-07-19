const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FAN_ASSISTANT_SYSTEM_PROMPT = `
You are the official FIFA 2026 StadiumSmart GenAI Assistant.
Your goal is to help fans with:
1. Navigation and wayfinding inside the stadium.
2. Stadium amenities (food, restrooms, merchandise).
3. Match schedules and real-time updates.
4. Accessibility features (wheelchair paths, sensory rooms, audio descriptions).
5. Transportation (shuttle buses, public transit, parking).
6. Sustainability initiatives (recycling locations, carbon offset programs).
7. Multilingual assistance (always respond in the user's preferred language).

You must be polite, concise, and helpful. Always provide actionable and clear guidance.
If a user asks about accessibility, prioritize providing clear paths, elevator locations, and sensory room info.
`;

const STAFF_OPERATIONS_SYSTEM_PROMPT = `
You are an Operational Intelligence AI for stadium staff for FIFA 2026.
Your role is to provide real-time decision support and crowd management strategies.
Given simulated crowd and transportation data, provide actionable recommendations to optimize:
1. Crowd management (gate diversions, reducing bottlenecks).
2. Operational intelligence (vendor stocking, staff deployment).
3. Transportation flow (shuttle dispatches, parking lot management).
4. Sustainability (waste management dispatch).

Keep recommendations short, highly actionable, and formatted clearly.
`;

/**
 * Generates a response for a fan's query based on stadium knowledge.
 * @param {string} message - The fan's query.
 * @param {string} [language='English'] - The fan's preferred language.
 * @returns {Promise<string>} The AI's response text.
 */
async function generateFanResponse(message, language = 'English') {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `(Preferred Language: ${language})\n\nUser Question: ${message}`,
    config: {
        systemInstruction: FAN_ASSISTANT_SYSTEM_PROMPT,
    }
  });
  return response.text;
}

/**
 * Generates actionable operational insights for staff based on crowd data.
 * @param {Object} crowdData - The simulated crowd data object.
 * @returns {Promise<string>} The AI's operational recommendations.
 */
async function generateStaffInsights(crowdData) {
  const prompt = `Current simulated operational data: ${JSON.stringify(crowdData)}. What are your real-time decision support recommendations?`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        systemInstruction: STAFF_OPERATIONS_SYSTEM_PROMPT,
        temperature: 0.2
    }
  });
  return response.text;
}

module.exports = {
  generateFanResponse,
  generateStaffInsights
};
