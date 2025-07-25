import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load stats');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: 8 }}>
      <h1>Product Statistics</h1>
      <ul>
        <li><strong>Total products:</strong> {stats.total}</li>
        <li><strong>Average price:</strong> ${stats.averagePrice?.toFixed(2)}</li>
        <li><strong>Cheapest product:</strong> {stats.minPriceItem?.name} (${stats.minPriceItem?.price})</li>
        <li><strong>Most expensive product:</strong> {stats.maxPriceItem?.name} (${stats.maxPriceItem?.price})</li>
      </ul>
    </div>
  );
}

export default Stats; 