import React from 'react';
import { Sheet } from '../../types/types';

interface CustomToolbarProps {
  activeSheet: Sheet;
  onAddDivision: () => void;
  onAddColumn: () => void;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  activeSheet,
  onAddDivision,
  onAddColumn,
}) => {
  const isBudgetSheet = activeSheet.type === 'budget';

  return (
    <div style={{ 
      padding: '8px', 
      borderBottom: '1px solid #ddd',
      display: 'flex',
      gap: '8px'
    }}>
      <button
        onClick={onAddDivision}
        disabled={!isBudgetSheet}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: isBudgetSheet ? '#007bff' : '#6c757d',
          color: 'white',
          cursor: isBudgetSheet ? 'pointer' : 'not-allowed',
        }}
      >
        Add Division
      </button>

      <button
        onClick={onAddColumn}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Add Column
      </button>
    </div>
  );
}; 