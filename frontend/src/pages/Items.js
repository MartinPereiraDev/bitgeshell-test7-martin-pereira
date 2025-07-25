import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';


function Items() {
  const { items, fetchItems} = useData();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [order, setOrder] = useState(''); // '' | 'price_asc' | 'price_desc'

  useEffect(() => {
    const controller = new AbortController();
    fetchItems({ q, page, limit, order, signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [q, page, limit, order, fetchItems]);

  return (
    <div>
      
      {/* Title, search and order */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <h1 style={{ flex: 1 }}>Products List </h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1); }}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <select value={order} onChange={e => setOrder(e.target.value)} style={{ padding: '0.5rem', fontSize: '1rem' }}>
          <option value="">Order by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Products list */}
      {items.length === 0 ? (
        <div style={{ padding: '1rem' }}>No products found.</div>
      ) : (
        <List
          height={400} // container height
          itemCount={items.length}
          itemSize={60} // item height in px
          width="100%"
          style={{ border: '1px solid #eee', borderRadius: 4 }}
        >
          {({ index, style }) => {
            const item = items[index];
            return (
              <div
                key={item.id}
                style={{
                  ...style,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #eee',
                  padding: '1rem',
                  boxSizing: 'border-box',
                  background: index % 2 === 0 ? '#fff' : '#f9f9f9'
                }}
              >
                <span>
                  <strong>{item.name}</strong> — {item.category} — ${item.price}
                </span>
                <Link to={`/items/${item.id}`}>
                  <button style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>Ver detalle</button>
                </Link>
              </div>
            );
          }}
        </List>
      )}

      {/* Pagination */}
      <div style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={items.length < limit}>Next</button>
      </div>


    </div>
  );
}

export default Items;