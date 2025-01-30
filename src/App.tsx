import React, { useState } from 'react';
import { UniverSpreadsheet } from './components/spreadsheet/UniverSpreadsheet';
import { AddTradeDialog } from './components/dialogs/add-trade';
import { AddColumnDialog } from './components/dialogs/add-column';
import { CustomToolbar } from './components/toolbar/CustomToolbar';
import { BudgetSummaryColumnType, DivisionColumnType, SpreadsheetState } from './types/types';
import { v4 as uuidv4 } from 'uuid';
import { useSpreadsheetState } from './hooks/useSpreadsheetState';

function App() {
  const [projectId] = useState(() => uuidv4());

  const {
    state,
    addDivision,
    addColumn,
    updateColumnTitle,
    moveColumn,
    setActiveSheet,
    setState
  } = useSpreadsheetState(projectId);

  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const handleStateChange = (newState: SpreadsheetState) => {
    console.log('[App] STATE CHANGE RECEIVED:', newState);
    setState(newState);
  };

  const handleAddDivision = (code: string, name: string) => {
    console.log('[App] Adding division:', { code, name });
    addDivision(code, name);
    setIsAddTradeOpen(false);
  };

  const handleAddColumn = (title: string, type: BudgetSummaryColumnType | DivisionColumnType) => {
    console.log('[App] Adding column:', { title, type });
    addColumn(state.metadata.activeSheetId, title, type);
    setIsAddColumnOpen(false);
  };

  console.log('[App] Rendering UniverSpreadsheet with state:', state);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CustomToolbar 
        onAddDivision={() => {
          console.log('[App] Add division button clicked');
          setIsAddTradeOpen(true);
        }}
        onAddColumn={() => {
          console.log('[App] Add column button clicked');
          setIsAddColumnOpen(true);
        }}
        activeSheet={state.sheets[state.metadata.activeSheetId]}
      />
      
      <UniverSpreadsheet 
        initialState={state}
        onStateChange={handleStateChange}
      />

      <AddTradeDialog 
        isOpen={isAddTradeOpen}
        onClose={() => {
          console.log('[App] Add trade dialog closed');
          setIsAddTradeOpen(false);
        }}
        onAdd={handleAddDivision}
      />

      <AddColumnDialog 
        isOpen={isAddColumnOpen}
        onClose={() => {
          console.log('[App] Add column dialog closed');
          setIsAddColumnOpen(false);
        }}
        onAdd={handleAddColumn}
        activeSheet={state.sheets[state.metadata.activeSheetId]}
      />
    </div>
  );
}

export default App; 