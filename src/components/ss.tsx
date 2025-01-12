import React, { useEffect, useRef } from 'react'
import { LocaleType, Tools, Univer, IWorkbookData, UniverInstanceType, ICommandService, CommandType, IMoveColumnsMutationParams, IScale } from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { SheetExtension, SpreadsheetSkeleton, UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverUIPlugin } from "@univerjs/ui";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsFormulaUIPlugin } from "@univerjs/sheets-formula-ui";
import { Column, columnTypeMetadata } from '../types/sheet.ts';
import SheetToolbar from './SheetToolbar.tsx';
import { SubcontractorColumnHeader } from './SubcontractorColumnHeader.tsx';
import { SheetColumnHeaderExtensionRegistry } from "@univerjs/engine-render";

// Import styles
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula-ui/lib/index.css";

// Import locales
import DesignEnUS from '@univerjs/design/locale/en-US';
import UIEnUS from '@univerjs/ui/locale/en-US';
import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';
import SheetsEnUS from '@univerjs/sheets/locale/en-US';
import SheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
import SheetsFormulaUIEnUS from '@univerjs/sheets-formula-ui/locale/en-US';

// Define column types
export enum DivisionColumnType {
  CODE = 'DIVISION_CODE',
  COST = 'DIVISION_COST',
  LINE_ITEMS = 'DIVISION_LINE_ITEMS',
  NOTES = 'DIVISION_NOTES',
  OTHER = 'DIVISION_OTHER',
  QUANTITY = 'DIVISION_QUANTITY',
  REFERENCE = 'DIVISION_REFERENCE',
  REQUIRED_QUANTITY = 'DIVISION_REQUIRED_QUANTITY',
  SUBCONTRACTOR = 'DIVISION_SUBCONTRACTOR',
  UNIT_COST = 'DIVISION_UNIT_COST',
  UNITS = 'DIVISION_UNITS'
}

export enum BudgetSummaryColumnType {
  COST_CODE = 'BUDGET_COST_CODE',
  DIVISION = 'BUDGET_DIVISION',
  DETAILS = 'BUDGET_DETAILS',
  COST = 'BUDGET_COST',
  NOTES = 'BUDGET_NOTES'
}

export type ColumnType = DivisionColumnType | BudgetSummaryColumnType;

interface UniverSpreadsheetProps {
  sheetType: 'budget-summary' | 'division';
  initialData?: IWorkbookData;
  onSave?: (data: IWorkbookData) => void;
  onAddTrade?: (name: string, type: 'budget-summary' | 'division') => void;
  onColumnRename?: (columnId: string, newTitle: string) => void;
}

const SUBCONTRACTOR_HEADER_KEY = 'SubcontractorColumnHeader';

class SubcontractorHeaderExtension extends SheetExtension {
  override uKey = SUBCONTRACTOR_HEADER_KEY;

  override get zIndex() {
    return 11;
  }

  override draw(ctx: RenderingContext, parentScale: IScale, spreadsheetSkeleton: SpreadsheetSkeleton) {
    const { columnData } = spreadsheetSkeleton;
    
    // Only render for subcontractor columns
    if (!columnData || columnData.type !== DivisionColumnType.SUBCONTRACTOR) {
      return;
    }

    return (
      <SubcontractorColumnHeader
        columnId={columnData.columnId}
        title={columnData.title}
        sheetId={spreadsheetSkeleton.sheetId}
      />
    );
  }
}

const UniverSpreadsheet: React.FC<UniverSpreadsheetProps> = ({ 
  sheetType,
  initialData,
  onSave,
  onAddTrade,
  onColumnRename
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<Univer | null>(null);

  useEffect(() => {
    if (!containerRef.current || univerRef.current) return;

    // Register custom column header extension
    const headerExtension = new SubcontractorHeaderExtension();
    SheetColumnHeaderExtensionRegistry.add(headerExtension);

    // Initialize Univer
    const univer = new Univer({
      theme: defaultTheme,
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: Tools.deepMerge(
          {},
          DesignEnUS,
          UIEnUS,
          DocsUIEnUS,
          SheetsEnUS,
          SheetsUIEnUS,
          SheetsFormulaUIEnUS
        ),
      },
    });

    // Register plugins
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
    });
    univer.registerPlugin(UniverDocsPlugin);
    univer.registerPlugin(UniverDocsUIPlugin);
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);
    univer.registerPlugin(UniverSheetsFormulaUIPlugin);

    // Create initial workbook data if not provided
    const workbookData = initialData || createInitialWorkbook(sheetType);
    
    // Create the workbook
    univer.createUnit(UniverInstanceType.UNIVER_SHEET, workbookData);

    univerRef.current = univer;

    // Load data from localStorage if available
    const savedData = localStorage.getItem(`univer-sheet-${workbookData.id}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        univer.createUnit(UniverInstanceType.UNIVER_SHEET, parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    // Add event listener for changes
    univer.on('change', (event) => {
      const currentData = univer.getWorkbookData();
      if (currentData) {
        saveToLocalStorage(currentData.id, currentData);
        onSave?.(currentData);
      }
    });

    // Add double-click listener for column headers
    univer.on('columnHeaderDoubleClick', (event) => {
      const { columnIndex } = event;
      const sheet = univer.getActiveSheet();
      if (!sheet) return;

      const columnData = sheet.getColumnData(columnIndex);
      if (!columnData) return;

      // Prompt for new title
      const newTitle = prompt('Enter new column title:', columnData.title);
      if (newTitle && newTitle !== columnData.title) {
        handleColumnRename(columnData.columnId, newTitle);
      }
    });

    // Add column drag event listeners
    univer.on('columnDragStart', (event) => {
      const { columnIndex } = event;
      // You could add visual feedback here if needed
    });

    univer.on('columnDragEnd', (event) => {
      const { fromIndex, toIndex } = event;
      if (fromIndex !== toIndex) {
        handleColumnMove(fromIndex, toIndex);
      }
    });

    return () => {
      if (univerRef.current) {
        univerRef.current.dispose();
        univerRef.current = null;
      }
    };
  }, [sheetType, initialData, onSave, onColumnRename]);

  return (
    <div className="flex flex-col h-screen">
      {univerRef.current && (
        <SheetToolbar 
          univer={univerRef.current} 
          sheetType={sheetType}
          onAddTrade={onAddTrade}
        />
      )}
      <div 
        ref={containerRef}
        className="flex-1"
        style={{ 
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

// Helper function to create initial workbook data
function createInitialWorkbook(sheetType: 'budget-summary' | 'division'): IWorkbookData {
  const sheetId = 'sheet1';
  const columns = sheetType === 'budget-summary' 
    ? getBudgetSummaryColumns() 
    : getDivisionColumns();

  return {
    id: `${sheetType}-${Date.now()}`,
    sheets: {
      [sheetId]: {
        id: sheetId,
        name: sheetType === 'budget-summary' ? 'Budget Summary' : 'Division',
        cellData: {},
        rowCount: 1000,
        columnCount: columns.length,
        defaultColumnWidth: 120,
        defaultRowHeight: 25,
        // Store column metadata
        columnData: columns.reduce((acc, col, index) => {
          acc[index] = {
            columnId: col.id,
            type: col.type,
            title: col.title,
            width: 120,
            movable: true, // Enable column movement
          };
          return acc;
        }, {} as Record<string, any>),
      }
    },
    sheetOrder: [sheetId],
    styles: {},
    name: sheetType === 'budget-summary' ? 'Budget Summary' : 'Division Sheet',
    appVersion: '1.0.0',
    locale: LocaleType.EN_US,
  };
}

function getBudgetSummaryColumns(): Column[] {
  return [
    {
      id: 'cost-code-col',
      type: BudgetSummaryColumnType.COST_CODE,
      title: 'Cost Code',
      width: 120,
      ...columnTypeMetadata[BudgetSummaryColumnType.COST_CODE]
    },
    {
      id: 'division-col',
      type: BudgetSummaryColumnType.DIVISION,
      title: 'Division',
      width: 200,
      ...columnTypeMetadata[BudgetSummaryColumnType.DIVISION]
    },
    {
      id: 'details-col',
      type: BudgetSummaryColumnType.DETAILS,
      title: 'Details',
      width: 200,
      ...columnTypeMetadata[BudgetSummaryColumnType.DETAILS]
    },
    {
      id: 'cost-col',
      type: BudgetSummaryColumnType.COST,
      title: 'Cost',
      width: 120,
      ...columnTypeMetadata[BudgetSummaryColumnType.COST]
    },
    {
      id: 'notes-col',
      type: BudgetSummaryColumnType.NOTES,
      title: 'Notes',
      width: 200,
      ...columnTypeMetadata[BudgetSummaryColumnType.NOTES]
    }
  ];
}

function getDivisionColumns(): Column[] {
  return [
    {
      id: 'line-items-col',
      type: DivisionColumnType.LINE_ITEMS,
      title: 'Line Items',
      width: 200,
      ...columnTypeMetadata[DivisionColumnType.LINE_ITEMS]
    },
    {
      id: 'units-col',
      type: DivisionColumnType.UNITS,
      title: 'Units',
      width: 100,
      ...columnTypeMetadata[DivisionColumnType.UNITS]
    },
    {
      id: 'required-quantity-col',
      type: DivisionColumnType.REQUIRED_QUANTITY,
      title: 'Required Quantity',
      width: 120,
      ...columnTypeMetadata[DivisionColumnType.REQUIRED_QUANTITY]
    },
    {
      id: 'subcontractor-col',
      type: DivisionColumnType.SUBCONTRACTOR,
      title: 'Subcontractor',
      width: 150,
      ...columnTypeMetadata[DivisionColumnType.SUBCONTRACTOR]
    }
  ];
}

// Add this function to handle saving data to localStorage
function saveToLocalStorage(workbookId: string, data: IWorkbookData) {
  try {
    localStorage.setItem(`univer-sheet-${workbookId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Add this function inside the UniverSpreadsheet component
const handleColumnRename = async (columnId: string, newTitle: string) => {
  if (!univerRef.current) return;

  try {
    const commandService = univerRef.current.getCommandService();
    const workbookData = univerRef.current.getWorkbookData();
    if (!workbookData) return;

    const activeSheet = univerRef.current.getActiveSheet();
    if (!activeSheet) return;

    const sheetId = activeSheet.getSheetId();
    const sheet = workbookData.sheets[sheetId];

    // Find the column index by columnId
    const columnIndex = Object.entries(sheet.columnData).find(
      ([_, data]) => data.columnId === columnId
    )?.[0];

    if (!columnIndex) return;

    // Update the column title
    await commandService.executeCommand(CommandType.SET_COLUMN_TITLE, {
      sheetId,
      columnIndex: parseInt(columnIndex),
      title: newTitle,
    });

    // Call the callback if provided
    onColumnRename?.(columnId, newTitle);

  } catch (error) {
    console.error('Error renaming column:', error);
    toast({
      title: "Error",
      description: "Failed to rename column. Please try again.",
      variant: "destructive",
    });
  }
};

const handleColumnMove = async (fromIndex: number, toIndex: number) => {
  if (!univerRef.current) return;

  try {
    const commandService = univerRef.current.getCommandService();
    const workbookData = univerRef.current.getWorkbookData();
    if (!workbookData) return;

    const activeSheet = univerRef.current.getActiveSheet();
    if (!activeSheet) return;

    const sheetId = activeSheet.getSheetId();

    // Create move columns mutation params
    const moveParams: IMoveColumnsMutationParams = {
      fromIndex,
      toIndex,
      sheetId,
    };

    // Execute the move command
    await commandService.executeCommand(CommandType.MOVE_COLUMNS, moveParams);

    // Update local storage after move
    const updatedData = univerRef.current.getWorkbookData();
    if (updatedData) {
      saveToLocalStorage(updatedData.id, updatedData);
      onSave?.(updatedData);
    }

  } catch (error) {
    console.error('Error moving column:', error);
    toast({
      title: "Error",
      description: "Failed to move column. Please try again.",
      variant: "destructive",
    });
  }
};

export default UniverSpreadsheet;