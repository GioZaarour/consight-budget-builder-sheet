import React, { useState } from 'react';
import { BudgetSummaryColumnType, DivisionColumnType, Sheet } from '../../types/types';

interface AddColumnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: BudgetSummaryColumnType | DivisionColumnType) => void;
  activeSheet: Sheet;
}

export const AddColumnDialog: React.FC<AddColumnDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  activeSheet,
}) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<BudgetSummaryColumnType | DivisionColumnType | ''>('');

  const columnTypes = activeSheet.type === 'budget' 
    ? Object.values(BudgetSummaryColumnType)
    : Object.values(DivisionColumnType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && selectedType) {
      onAdd(title, selectedType as BudgetSummaryColumnType | DivisionColumnType);
      setTitle('');
      setSelectedType('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '400px',
      }}>
        <h2 style={{ marginTop: 0 }}>Add New Column</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Column Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Column Type:
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
              >
                <option value="">Select a type...</option>
                {columnTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
              }}
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 