import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SpreadsheetState, BudgetSummaryColumnType, DivisionColumnType } from './types';

const createInitialState = (projectId: string): SpreadsheetState => {
  console.log('[useSpreadsheetState] Creating initial state for project:', projectId);
  const state = {
    metadata: {
      projectId,
      activeSheetId: 'budget-summary',
    },
    sheets: {
      'budget-summary': {
        id: 'budget-summary',
        name: 'Budget Summary',
        type: 'budget' as const,
        columns: [
          { id: uuidv4(), title: 'Cost Code', type: BudgetSummaryColumnType.COST_CODE },
          { id: uuidv4(), title: 'Division', type: BudgetSummaryColumnType.DIVISION },
          { id: uuidv4(), title: 'Details', type: BudgetSummaryColumnType.DETAILS },
          { id: uuidv4(), title: 'Cost', type: BudgetSummaryColumnType.COST },
          { id: uuidv4(), title: 'Notes', type: BudgetSummaryColumnType.NOTES },
        ],
        data: []
      }
    }
  };
  console.log('[useSpreadsheetState] Initial state created:', state);
  return state;
};

export const useSpreadsheetState = (projectId: string) => {
  console.log('[useSpreadsheetState] Hook called with projectId:', projectId);
  
  const [state, setState] = useState<SpreadsheetState>(() => {
    console.log('[useSpreadsheetState] Initializing state');
    const savedState = localStorage.getItem(`spreadsheet_${projectId}`);
    if (savedState) {
      console.log('[useSpreadsheetState] Found saved state in localStorage');
      return JSON.parse(savedState);
    }
    console.log('[useSpreadsheetState] No saved state found, creating initial state');
    return createInitialState(projectId);
  });

  useEffect(() => {
    console.log('[useSpreadsheetState] Saving state to localStorage');
    localStorage.setItem(`spreadsheet_${projectId}`, JSON.stringify(state));
  }, [state, projectId]);

  const addDivision = (code: string, name: string) => {
    console.log('[useSpreadsheetState] Adding division:', { code, name });
    setState(prevState => {
      const newState = { ...prevState };
      const divisionSheetId = `division-${code}`;
      
      // Add row to budget summary with complete data
      const newRow = {
        [BudgetSummaryColumnType.COST_CODE]: code,
        [BudgetSummaryColumnType.DIVISION]: name,
        [BudgetSummaryColumnType.DETAILS]: `=HYPERLINK("#sheet=${divisionSheetId}", "View Division")`,
        [BudgetSummaryColumnType.COST]: '',
        [BudgetSummaryColumnType.NOTES]: '',
      };
      
      console.log('[useSpreadsheetState] Adding new row to budget summary:', newRow);
      newState.sheets['budget-summary'].data = [...newState.sheets['budget-summary'].data, newRow];

      console.log('[useSpreadsheetState] Creating division sheet');
      // Create division sheet
      newState.sheets[divisionSheetId] = {
        id: divisionSheetId,
        name: `${code} - ${name}`,
        type: 'division' as const,
        columns: [
          { id: uuidv4(), title: 'Line Items', type: DivisionColumnType.LINE_ITEMS },
          { id: uuidv4(), title: 'Units', type: DivisionColumnType.UNITS },
          { id: uuidv4(), title: 'Required Quantity', type: DivisionColumnType.REQUIRED_QUANTITY },
          { id: uuidv4(), title: 'Subcontractor', type: DivisionColumnType.SUBCONTRACTOR },
        ],
        data: []
      };

      console.log('[useSpreadsheetState] New state after adding division:', newState);
      return newState;
    });
  };

  const addColumn = (sheetId: string, title: string, type: BudgetSummaryColumnType | DivisionColumnType) => {
    console.log('[useSpreadsheetState] Adding column:', { sheetId, title, type });
    setState(prevState => {
      const newState = { ...prevState };
      const sheet = newState.sheets[sheetId];
      
      if (sheet) {
        console.log('[useSpreadsheetState] Found sheet, adding column');
        sheet.columns.push({
          id: uuidv4(),
          title,
          type,
        });
        console.log('[useSpreadsheetState] New state after adding column:', newState);
      } else {
        console.log('[useSpreadsheetState] Sheet not found:', sheetId);
      }

      return newState;
    });
  };

  const updateColumnTitle = (sheetId: string, columnId: string, newTitle: string) => {
    console.log('[useSpreadsheetState] Updating column title:', { sheetId, columnId, newTitle });
    setState(prevState => {
      const newState = { ...prevState };
      const sheet = newState.sheets[sheetId];
      
      if (sheet) {
        const column = sheet.columns.find(col => col.id === columnId);
        if (column) {
          console.log('[useSpreadsheetState] Found column, updating title');
          column.title = newTitle;
        } else {
          console.log('[useSpreadsheetState] Column not found:', columnId);
        }
      } else {
        console.log('[useSpreadsheetState] Sheet not found:', sheetId);
      }

      return newState;
    });
  };

  const moveColumn = (sheetId: string, fromIndex: number, toIndex: number) => {
    console.log('[useSpreadsheetState] Moving column:', { sheetId, fromIndex, toIndex });
    setState(prevState => {
      const newState = { ...prevState };
      const sheet = newState.sheets[sheetId];
      
      if (sheet) {
        console.log('[useSpreadsheetState] Found sheet, moving column');
        const [column] = sheet.columns.splice(fromIndex, 1);
        sheet.columns.splice(toIndex, 0, column);
        console.log('[useSpreadsheetState] New state after moving column:', newState);
      } else {
        console.log('[useSpreadsheetState] Sheet not found:', sheetId);
      }

      return newState;
    });
  };

  const setActiveSheet = (sheetId: string) => {
    console.log('[useSpreadsheetState] Setting active sheet:', sheetId);
    setState(prevState => {
      const newState = {
        ...prevState,
        metadata: {
          ...prevState.metadata,
          activeSheetId: sheetId,
        }
      };
      console.log('[useSpreadsheetState] New state after setting active sheet:', newState);
      return newState;
    });
  };

  return {
    state,
    setState,
    addDivision,
    addColumn,
    updateColumnTitle,
    moveColumn,
    setActiveSheet,
  };
}; 