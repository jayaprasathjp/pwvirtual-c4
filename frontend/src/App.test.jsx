import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock the fetch API globally
global.fetch = vi.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders header and navigation', async () => {
    render(<App />);
    expect(screen.getByText(/StadiumSmart/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Staff Operations/i)).toBeInTheDocument();
  });

  test('switches between Fan and Staff tabs', async () => {
    render(<App />);
    
    // Default is Fan Assistant, wait for Suspense to load it
    expect(await screen.findByPlaceholderText(/Ask about gates, food, accessibility.../i)).toBeInTheDocument();
    
    // Switch to Staff Operations
    fireEvent.click(screen.getByText(/Staff Operations/i));
    expect(await screen.findByText(/Operational Intelligence Dashboard/i)).toBeInTheDocument();
  });

  test('fan assistant can submit a message', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ reply: 'Test response' }),
    });

    render(<App />);
    
    const input = await screen.findByPlaceholderText(/Ask about gates, food, accessibility.../i);
    const button = await screen.findByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(button);

    // Should add user message to chat immediately
    expect(await screen.findByText('Hello')).toBeInTheDocument();
    
    // Should call fetch
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/chat', expect.any(Object));
  });
});
