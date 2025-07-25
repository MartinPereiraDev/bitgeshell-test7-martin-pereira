import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Stats from './Stats';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav
          style={{
            padding: 25,
            borderBottom: '1px solid #ddd',
            fontSize: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem', 
            background: '#222',
            color: '#fff'
          }}
        >
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Products</Link>
          <Link to="/stats" style={{ color: '#fff', textDecoration: 'none' }}>Stats</Link>
        </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </DataProvider>
  );
}

export default App;