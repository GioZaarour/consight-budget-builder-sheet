import React, { useState } from 'react';
import { Column } from './types';

interface ColumnHeaderMenuProps {
  column: Column;
  onRename: (columnId: string, newTitle: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

export const ColumnHeaderMenu: React.FC<ColumnHeaderMenuProps> = ({
  column,
  onRename,
  onClose,
  position,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  const handleRename = () => {
    if (newTitle && newTitle !== column.title) {
      onRename(column.id, newTitle);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '8px',
        zIndex: 1000,
      }}
    >
      {isRenaming ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
            autoFocus
          />
          <button
            onClick={handleRename}
            style={{
              padding: '4px 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsRenaming(true)}
          style={{
            display: 'block',
            width: '100%',
            padding: '4px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          Rename Column
        </button>
      )}
    </div>
  );
}; 