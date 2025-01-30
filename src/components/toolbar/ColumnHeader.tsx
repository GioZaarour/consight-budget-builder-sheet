import React, { useState, useRef, useEffect } from 'react';
import { Column, DivisionColumnType } from '../../types/types';
import { ColumnHeaderMenu } from './ColumnHeaderMenu';
import { BidBook } from '../../utils/bidbook';

interface ColumnHeaderProps {
  column: Column;
  onRename: (columnId: string, newTitle: string) => void;
  sheetId: string;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  onRename,
  sheetId,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [bidBookOpen, setBidBookOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const handleBidBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBidBookOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      ref={headerRef}
      onContextMenu={handleContextMenu}
      style={{
        position: 'relative',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        cursor: 'context-menu',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>{column.title}</span>
      
      {column.type === DivisionColumnType.SUBCONTRACTOR && (
        <button
          onClick={handleBidBookClick}
          style={{
            padding: '4px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Bid Book
        </button>
      )}

      {menuOpen && (
        <ColumnHeaderMenu
          column={column}
          onRename={onRename}
          onClose={() => setMenuOpen(false)}
          position={menuPosition}
        />
      )}

      {bidBookOpen && (
        <BidBook
          columnId={column.id}
          sheetId={sheetId}
          onClose={() => setBidBookOpen(false)}
          isOpen={bidBookOpen}
          onSave={(info) => {
            console.log('Save subcontractor info:', info);
            setBidBookOpen(false);
          }}
        />
      )}
    </div>
  );
}; 