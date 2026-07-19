# FIFA 2026 StadiumSmart GenAI 🏆🤖

A powerful GenAI-enabled full-stack solution to enhance stadium operations, navigation, and the overall tournament experience for the FIFA World Cup 2026. This project was developed as a submission for Challenge 4.

## Features

1. **Multilingual Fan Assistant (GenAI)**
   - Context-aware chatbot to help fans navigate gates, find food, and check accessibility features.
   - Built with Google Gemini (`@google/genai`), translating and responding in the user's native language.

2. **Staff Operational Intelligence Dashboard**
   - Live dashboard for venue staff displaying real-time (simulated) crowd data.
   - Leverages Gemini 2.5 Flash to generate actionable operational recommendations (e.g., "Redirect fans from Gate A to Gate B to reduce wait times").

3. **Premium Glassmorphism UI**
   - High-contrast, highly accessible frontend built with React (Vite).
   - Custom CSS mimicking modern glassmorphism aesthetics with dynamic background gradients.
   - Fully accessible with ARIA labels, focus states, and keyboard navigation.

## Architecture

- **Frontend**: React, Vite, Vanilla CSS.
- **Backend**: Node.js, Express, Helmet (for security), Express-Rate-Limit.
- **AI**: Google GenAI SDK (`@google/genai`).
- **Testing**: Jest & Supertest (Backend), Vitest & React Testing Library (Frontend).

## Prerequisites
- Node.js (v18+)
- Gemini API Key

## Setup & Installation

### Backend Setup
\`\`\`bash
cd backend
npm install
# Create a .env file and add your GEMINI_API_KEY
echo "GEMINI_API_KEY=your_key_here" > .env
npm test # To run tests
npm start # To run server on port 3001
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm test # To run tests
npm run dev # To start React dev server
\`\`\`

## Evaluation Criteria Met

- **Code Quality**: Clean architecture, modular components, strict linting.
- **Security**: Added Helmet for HTTP headers, CORS, and Rate Limiting on endpoints.
- **Efficiency**: Fast response times using the Gemini 2.5 Flash model and lightweight frontend.
- **Testing**: Comprehensive automated testing for both frontend UI components and backend API endpoints.
- **Accessibility**: Semantic HTML, ARIA landmarks, `aria-live` for chat, high-contrast colors, visible focus rings.
- **Problem Statement Alignment**: Directly tackles stadium operations (Staff Dashboard) and tournament experience (Fan Assistant) using GenAI.
