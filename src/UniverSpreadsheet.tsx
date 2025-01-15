import React, { useEffect, useRef } from 'react';
import { 
  Univer,
  IWorkbookData,
  IWorksheetData,
  BooleanNumber,
  IFreeze,
  IRange,
  UniverInstanceType,
} from '@univerjs/core';
import { createUniver, defaultTheme, LocaleType, merge } from '@univerjs/presets';
import { UniverSheetsCorePreset } from '@univerjs/presets/preset-sheets-core';
import UniverPresetSheetsCoreEnUS from '@univerjs/presets/preset-sheets-core/locales/en-US';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverUIPlugin } from '@univerjs/ui';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';

import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula-ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';

import { SpreadsheetState, Sheet } from './types';
import { ColumnHeader } from './ColumnHeader';

interface UniverSpreadsheetProps {
  initialState: SpreadsheetState;
  onStateChange?: (state: SpreadsheetState) => void;
}

export const UniverSpreadsheet: React.FC<UniverSpreadsheetProps> = ({
  initialState,
  onStateChange
}) => {
  console.log('[UniverSpreadsheet] Rendering with initialState:', initialState);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<any>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('[UniverSpreadsheet] useEffect triggered with initialState:', initialState);
    
    const setupUniver = async () => {
      console.log('[UniverSpreadsheet] Setting up Univer instance');
      
      // Always clean up previous instance
      if (univerRef.current) {
        console.log('[UniverSpreadsheet] Disposing previous Univer instance');
        univerRef.current.dispose();
        univerRef.current = null;
      }

      if (!containerRef.current) {
        console.log('[UniverSpreadsheet] Container ref not available, skipping setup');
        return;
      }

      try {
        console.log('[UniverSpreadsheet] Creating new Univer instance');
        const { univer, univerAPI } = createUniver({
          locale: LocaleType.EN_US,
          locales: {
            [LocaleType.EN_US]: merge(
              {},
              UniverPresetSheetsCoreEnUS,
            ),
          },
          theme: defaultTheme,
          presets: [
            UniverSheetsCorePreset({
              container: containerRef.current,
            }),
          ],
        });

        // console.log('[UniverSpreadsheet] Registering core plugins');
        // Register core plugins
        // await Promise.all([
        //   univer.registerPlugin(UniverRenderEnginePlugin),
        //   univer.registerPlugin(UniverFormulaEnginePlugin),
        //   univer.registerPlugin(UniverDocsPlugin),
        // ]);

        // console.log('[UniverSpreadsheet] Registering UI plugins');
        // // Register UI plugins
        // await Promise.all([
        //   univer.registerPlugin(UniverUIPlugin, {
        //     container: containerRef.current,
        //     header: false,
        //     toolbar: false,
        //   }),
        //   univer.registerPlugin(UniverSheetsPlugin),
        //   univer.registerPlugin(UniverSheetsUIPlugin),
        //   univer.registerPlugin(UniverSheetsFormulaPlugin),
        //   univer.registerPlugin(UniverDocsUIPlugin),
        // ]);

        // Initialize workbook with state data
        const workbookData = createWorkbookFromState(initialState);
        console.log('[UniverSpreadsheet] Creating workbook with data:', JSON.stringify(workbookData, null, 2));
        // univer.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData);

        // Use createUniverSheet instead of createWorkbook
        const workbook = univerAPI.createUniverSheet(workbookData);

        // Store the API reference
        univerRef.current = univerAPI;
        
        // Notify parent of initial state
        onStateChange?.(initialState);

        console.log('[UniverSpreadsheet] Univer setup complete');
      } catch (error) {
        console.error('[UniverSpreadsheet] Error setting up Univer:', error);
      }
    };

    setupUniver();

    return () => {
      if (univerRef.current) {
        console.log('[UniverSpreadsheet] Cleanup: Disposing Univer instance');
        univerRef.current.dispose();
        univerRef.current = null;
      }
    };
  }, [initialState]);

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    console.log('[UniverSpreadsheet] Renaming column:', { columnId, newTitle });
    const newState = { ...initialState };
    const activeSheet = newState.sheets[newState.metadata.activeSheetId];
    
    const column = activeSheet.columns.find(col => col.id === columnId);
    if (column) {
      column.title = newTitle;
      console.log('[UniverSpreadsheet] Column renamed, new state:', newState);
      onStateChange?.(newState);
    } else {
      console.log('[UniverSpreadsheet] Column not found:', columnId);
    }
  };

  const createWorkbookFromState = (state: SpreadsheetState): IWorkbookData => {
    console.log('[UniverSpreadsheet] Creating workbook from state:', state);
    const sheets: { [key: string]: IWorksheetData } = {};

    Object.values(state.sheets).forEach(sheet => {
      console.log('[UniverSpreadsheet] Processing sheet:', {
        sheetId: sheet.id,
        name: sheet.name,
        columnCount: sheet.columns.length,
        dataRows: sheet.data.length
      });
      
      const rowCount = Math.max(100, sheet.data.length + 10);
      const columnCount = sheet.columns.length;
      
      const cellData: { [key: string]: any } = {};
      
      // Add header row
      sheet.columns.forEach((column, colIndex) => {
        const cellKey = `0,${colIndex}`;
        console.log('[UniverSpreadsheet] Adding header cell:', { cellKey, title: column.title });
        cellData[cellKey] = {
          v: column.title,
          t: 's',
          s: {
            bl: 1,
            fw: 'bold',
          },
        };
      });

      // Add data rows
      sheet.data.forEach((row, rowIndex) => {
        console.log('[UniverSpreadsheet] Processing row:', {
          rowIndex: rowIndex + 1,
          data: row
        });
        
        sheet.columns.forEach((column, colIndex) => {
          const value = row[column.type];
          const cellKey = `${rowIndex + 1},${colIndex}`;
          console.log('[UniverSpreadsheet] Adding data cell:', {
            cellKey,
            columnType: column.type,
            value,
            isHyperlink: typeof value === 'string' && value.startsWith('=HYPERLINK')
          });

          if (typeof value === 'string' && value.startsWith('=HYPERLINK')) {
            cellData[cellKey] = {
              v: value,
              t: 'f',
            };
          } else {
            cellData[cellKey] = {
              v: value ?? '',
              t: value === undefined || value === '' ? 's' : getCellType(column.type),
            };
          }
        });
      });

      console.log('[UniverSpreadsheet] Sheet cell data created:', {
        sheetId: sheet.id,
        cellCount: Object.keys(cellData).length
      });

      sheets[sheet.id] = {
        id: sheet.id,
        name: sheet.name,
        cellData,
        rowCount,
        columnCount,
        defaultColumnWidth: 120,
        defaultRowHeight: 30,
        freeze: {
          xSplit: 0,
          ySplit: 1,
          startRow: 0,
          startColumn: 0,
          rowCount: 1,
          columnCount: 0
        } as IFreeze,
        mergeData: [] as IRange[],
        rowData: {},
        columnData: {},
        showGridlines: 1 as BooleanNumber,
        rowHeader: { width: 46, hidden: 0 as BooleanNumber },
        columnHeader: { height: 20, hidden: 0 as BooleanNumber },
        rightToLeft: 0 as BooleanNumber,
        tabColor: '#FFFFFF',
        zoomRatio: 1,
        scrollTop: 0,
        scrollLeft: 0,
        hidden: 0 as BooleanNumber,
      };
    });

    const result = {
      id: state.metadata.projectId,
      appVersion: '3.0.0-alpha',
      name: 'Consight Spreadsheet',
      sheets,
      locale: LocaleType.EN_US,
      styles: {},
      sheetOrder: Object.keys(state.sheets),
    };

    console.log('[UniverSpreadsheet] Final workbook data:', {
      id: result.id,
      sheetCount: Object.keys(sheets).length,
      sheetOrder: result.sheetOrder
    });
    return result;
  };

  const getCellType = (columnType: string): string => {
    const type = columnType.includes('COST') || columnType.includes('QUANTITY') ? 'n' : 's';
    console.log('[UniverSpreadsheet] Getting cell type:', { columnType, resultType: type });
    return type;
  };

  const activeSheet = initialState.sheets[initialState.metadata.activeSheetId];
  console.log('[UniverSpreadsheet] Active sheet:', {
    id: activeSheet.id,
    name: activeSheet.name,
    columnCount: activeSheet.columns.length
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div 
        ref={headerContainerRef}
        style={{ 
          display: 'flex',
          borderBottom: '1px solid #ddd',
        }}
      >
        {activeSheet.columns.map(column => (
          <div 
            key={column.id} 
            style={{ width: '120px', flexShrink: 0 }}
          >
            <ColumnHeader
              column={column}
              onRename={handleRenameColumn}
              sheetId={activeSheet.id}
            />
          </div>
        ))}
      </div>

      <div 
        ref={containerRef} 
        style={{ flex: 1 }}
      />
    </div>
  );
}; 