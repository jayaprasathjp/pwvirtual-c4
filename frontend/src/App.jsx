import React, { useState, Suspense, lazy } from 'react';
import './App.css';

// Lazy loading components for code splitting (Efficiency)
const FanAssistant = lazy(() => import('./components/FanAssistant'));
const StaffDashboard = lazy(() => import('./components/StaffDashboard'));

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
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}><span className="loader" aria-label="Loading section"></span> Loading...</div>}>
          {activeTab === 'fan' ? <FanAssistant /> : <StaffDashboard />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
