import React, { createContext, useCallback, useContext, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
   //signal is used to abort the request if the component is unmounted
  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 10, order, signal } = {}) => {
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (order) params.append('order', order);

      const res = await fetch(`${API_BASE_URL}/api/items?${params.toString()}`, { signal });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      setItems(json.items || json);
    } catch (err) {
      if (err.name === 'AbortError') {
        
        return;
      }
      
      console.error(err);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);