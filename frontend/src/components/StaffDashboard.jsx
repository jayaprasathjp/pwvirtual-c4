import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * StaffDashboard Component
 * Provides operational intelligence to stadium staff based on real-time crowd data.
 */
const StaffDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Real-time simulated state
  const [totalAttendance, setTotalAttendance] = useState(65432);
  const [gateAWait, setGateAWait] = useState(25);

  const crowdData = {
    totalAttendance,
    gates: {
      gateA: { status: gateAWait > 15 ? 'crowded' : 'clear', waitTimeMins: gateAWait },
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
      setInsights(data.recommendations || (data.errors && data.errors[0].msg) || 'No insights returned.');
    } catch (error) {
      setInsights('Failed to fetch AI insights. Check server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    
    // Simulate real-time data changes
    const interval = setInterval(() => {
        setTotalAttendance(prev => prev + Math.floor(Math.random() * 10));
        setGateAWait(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="glass-panel" role="region" aria-label="Operational Dashboard">
      <h2>Operational Intelligence Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <h3>Total Attendance</h3>
          <div className="stat-value">{totalAttendance.toLocaleString()}</div>
        </div>
        <div className="glass-panel stat-card">
          <h3>Gate A Wait Time</h3>
          <div className="stat-value" style={{ color: gateAWait > 15 ? '#e63946' : '#2a9d8f' }}>
            {gateAWait} mins
          </div>
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

StaffDashboard.propTypes = {};

export default StaffDashboard;
