import React, { useState, useMemo } from 'react';
import defaultCostCodes from './defaultCostCodes';

interface CostCode {
  code: string;
  trade: string;
}

interface AddTradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (costCode: string, divisionName: string) => void;
}

export const AddTradeDialog: React.FC<AddTradeDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<CostCode | null>(null);

  const sortedLineItems = useMemo(() => {
    return defaultCostCodes.sort((a: CostCode, b: CostCode) => {
      const numA = parseInt(a.code.replace(/\D/g, ''));
      const numB = parseInt(b.code.replace(/\D/g, ''));
      return numA - numB;
    });
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return sortedLineItems;
    const term = searchTerm.toLowerCase();
    return sortedLineItems.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.trade.toLowerCase().includes(term)
    );
  }, [searchTerm, sortedLineItems]);

  const handleSelect = (item: CostCode) => {
    setSelectedItem(item);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      onAdd(selectedItem.code, selectedItem.trade);
      setSelectedItem(null);
      setSearchTerm('');
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
        width: '500px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{ marginTop: 0 }}>Add Division</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Search Divisions:
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                placeholder="Search by code or division name..."
              />
            </label>
          </div>

          <div style={{
            marginBottom: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}>
            {filteredItems.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                No divisions found
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.code}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selectedItem?.code === item.code ? '#e9ecef' : 'transparent',
                    borderBottom: '1px solid #ddd',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = 
                      selectedItem?.code === item.code ? '#e9ecef' : 'transparent';
                  }}
                >
                  <strong>{item.code}</strong> - {item.trade}
                </div>
              ))
            )}
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
              disabled={!selectedItem}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: selectedItem ? '#007bff' : '#6c757d',
                color: 'white',
                cursor: selectedItem ? 'pointer' : 'not-allowed',
              }}
            >
              Add Division
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};