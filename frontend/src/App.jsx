import React, { useState } from 'react';
import FanAssistant from './components/FanAssistant';
import StaffDashboard from './components/StaffDashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('fan');

  return (
    <div className="app-container">
      <header className="header" role="banner">
        <div className="logo">
          FIFA 2026 <span className="logo-highlight">StadiumSmart</span>
        </div>
        <nav className="nav-links" role="navigation" aria-label="Main Navigation">
          <button 
            className={`nav-link ${activeTab === 'fan' ? 'active' : ''}`}
            onClick={() => setActiveTab('fan')}
            aria-current={activeTab === 'fan' ? 'page' : undefined}
          >
            Fan Assistant
          </button>
          <button 
            className={`nav-link ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
            aria-current={activeTab === 'staff' ? 'page' : undefined}
          >
            Staff Operations
          </button>
        </nav>
      </header>

      <main className="main-content" role="main">
        {activeTab === 'fan' ? <FanAssistant /> : <StaffDashboard />}
      </main>
    </div>
  );
}

export default App;
