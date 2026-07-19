const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FAN_ASSISTANT_SYSTEM_PROMPT = `
You are the official FIFA 2026 StadiumSmart GenAI Assistant.
Your goal is to help fans with navigation, stadium amenities, match schedules, accessibility features, and transportation.
You must be polite, concise, and helpful. 
Respond in the language the user speaks, or the preferred language they explicitly mention.
If a user asks about accessibility, prioritize providing clear paths, elevator locations, and sensory room info.
`;

const STAFF_OPERATIONS_SYSTEM_PROMPT = `
You are an Operational Intelligence AI for stadium staff.
Given simulated crowd data, provide actionable recommendations to optimize stadium operations, 
such as gate management, vendor stocking, and crowd diversion.
Keep recommendations short and highly actionable.
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
  const prompt = `Current simulated crowd data: ${JSON.stringify(crowdData)}. What are your operational recommendations?`;
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
