import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useStudy } from '../context/StudyContext';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  return (
    <div className="search-bar-container" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <Search 
        size={18} 
        style={{ 
          position: 'absolute', 
          left: '14px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: 'var(--text-dim)',
          pointerEvents: 'none'
        }} 
      />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tasks, topics, or notes..." 
        className="glass"
        style={{ 
          width: '100%',
          padding: '12px 40px 12px 44px', 
          borderRadius: '14px', 
          border: '1px solid var(--surface-border)',
          background: 'rgba(255, 255, 255, 0.03)',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          outline: 'none',
          transition: 'var(--transition-smooth)'
        }}
      />
      {query && (
        <button 
          onClick={() => setQuery('')}
          style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
