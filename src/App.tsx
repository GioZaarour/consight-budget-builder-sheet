import React from 'react';
import UniverSpreadsheet from './components/ss.tsx';

function App() {
  const handleSave = (data: any) => {
    console.log('Saved data:', data);
  };

  const handleAddTrade = (name: string, type: 'budget-summary' | 'division') => {
    console.log('Added trade:', { name, type });
  };

  const handleColumnRename = (columnId: string, newTitle: string) => {
    console.log('Column renamed:', { columnId, newTitle });
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <UniverSpreadsheet 
        sheetType="budget-summary"
        onSave={handleSave}
        onAddTrade={handleAddTrade}
        onColumnRename={handleColumnRename}
      />
    </div>
  );
}

export default App; 