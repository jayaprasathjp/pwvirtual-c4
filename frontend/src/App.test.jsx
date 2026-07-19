import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock the fetch API globally
global.fetch = vi.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders header and navigation', () => {
    render(<App />);
    expect(screen.getByText(/StadiumSmart/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Staff Operations/i)).toBeInTheDocument();
  });

  test('switches between Fan and Staff tabs', () => {
    render(<App />);
    
    // Default is Fan Assistant
    expect(screen.getByPlaceholderText(/Ask about gates, food, accessibility.../i)).toBeInTheDocument();
    
    // Switch to Staff Operations
    fireEvent.click(screen.getByText(/Staff Operations/i));
    expect(screen.getByText(/Operational Intelligence Dashboard/i)).toBeInTheDocument();
  });

  test('fan assistant can submit a message', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ reply: 'Test response' }),
    });

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Ask about gates, food, accessibility.../i);
    const button = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    // Should add user message to chat immediately
    expect(screen.getByText('Hello')).toBeInTheDocument();
    
    // Should call fetch
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/chat', expect.any(Object));
  });
});
