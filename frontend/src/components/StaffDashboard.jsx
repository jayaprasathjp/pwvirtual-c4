import React, { useState, useEffect } from 'react';

const StaffDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated crowd data
  const crowdData = {
    totalAttendance: 65432,
    gates: {
      gateA: { status: 'crowded', waitTimeMins: 25 },
      gateB: { status: 'clear', waitTimeMins: 5 },
      gateC: { status: 'moderate', waitTimeMins: 12 }
    },
    concessions: {
      sector1Food: { status: 'crowded', waitTimeMins: 15 },
      sector2Food: { status: 'clear', waitTimeMins: 2 }
    },
    accessibility: {
      wheelchairRequests: 12,
      sensoryRoomOccupancy: '80%'
    }
  };

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crowdData })
      });
      const data = await response.json();
      setInsights(data.recommendations);
    } catch (error) {
      setInsights('Failed to fetch AI insights. Check server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // Refresh insights every 5 minutes in a real app
  }, []);

  return (
    <div className="glass-panel" role="region" aria-label="Operational Dashboard">
      <h2>Operational Intelligence Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <h3>Total Attendance</h3>
          <div className="stat-value">{crowdData.totalAttendance.toLocaleString()}</div>
        </div>
        <div className="glass-panel stat-card">
          <h3>Gate A Wait Time</h3>
          <div className="stat-value" style={{ color: '#e63946' }}>{crowdData.gates.gateA.waitTimeMins} mins</div>
        </div>
        <div className="glass-panel stat-card">
          <h3>Gate B Wait Time</h3>
          <div className="stat-value" style={{ color: '#2a9d8f' }}>{crowdData.gates.gateB.waitTimeMins} mins</div>
        </div>
      </div>

      <div className="insights-panel">
        <h3>GenAI Operational Recommendations</h3>
        {isLoading ? (
          <div><span className="loader" aria-label="Loading insights"></span> Analyzing real-time data...</div>
        ) : (
          <div className="insight-item">
            {insights ? insights.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>{line}</p>
            )) : 'No recommendations available.'}
          </div>
        )}
        <button onClick={fetchInsights} className="btn" disabled={isLoading} style={{ marginTop: '1rem' }}>
          Refresh Insights
        </button>
      </div>
    </div>
  );
};

export default StaffDashboard;
