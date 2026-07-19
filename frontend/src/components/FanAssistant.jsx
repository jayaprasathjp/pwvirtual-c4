import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * FanAssistant Component
 * Provides a chat interface for fans to ask questions in their preferred language.
 */
const FanAssistant = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am your FIFA 2026 Stadium Assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || (data.errors && data.errors[0].msg) || 'Something went wrong.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am currently offline. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container" role="region" aria-label="Fan Assistant Chat">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>Language:</label>
        <select 
          id="language-select"
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="chat-input"
          style={{ padding: '5px 10px', width: 'auto' }}
        >
          <option value="English">English</option>
          <option value="Spanish">Español</option>
          <option value="French">Français</option>
          <option value="Arabic">العربية</option>
        </select>
      </div>

      <div className="chat-history" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble ai">
            <span className="loader" aria-label="Loading response"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
          placeholder="Ask about gates, food, accessibility..."
          aria-label="Message input"
        />
        <button type="submit" className="btn" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

// Even though there are no props passed right now, setting up PropTypes is good practice for future scale.
FanAssistant.propTypes = {};

export default FanAssistant;
