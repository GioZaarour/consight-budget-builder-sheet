import React from 'react';
import { Button } from "./ui/button.tsx"
import AddColumnDialog from './add-column.tsx';
import AddTradeDialog from './add-trade.tsx';
import { FUniver, Univer, IWorkbookData, IWorksheetData } from "@univerjs/core";

interface SheetToolbarProps {
  univer: Univer;
  sheetType: 'budget-summary' | 'division';
  onAddTrade?: (name: string, type: 'budget-summary' | 'division') => void;
}

const SheetToolbar: React.FC<SheetToolbarProps> = ({ 
  univer, 
  sheetType,
  onAddTrade 
}) => {
  const [isAddColumnOpen, setIsAddColumnOpen] = React.useState(false);
  const [isAddTradeOpen, setIsAddTradeOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddColumn = async (columnType: string, title: string) => {
    setIsLoading(true);
    try {
      // Get current workbook data
      const univerAPI = FUniver.newAPI(univer);
      const activeWorkbook = univerAPI.getActiveWorkbook();
      const workbookData = activeWorkbook.save();
      if (!workbookData) {
        throw new Error('No workbook data found');
      }

      // Get the active sheet
      const activeSheet = univerAPI.getActiveSheet();
      if (!activeSheet) {
        throw new Error('No active sheet found');
      }

      const sheetId = activeSheet.getSheetId();
      const sheet = workbookData.sheets[sheetId];
      
      // Create new column metadata
      const newColumnId = `col-${Date.now()}`;
      const columnIndex = sheet.columnCount;
      
      // Update sheet data
      const updatedSheet: IWorksheetData = {
        ...sheet,
        columnCount: sheet.columnCount + 1,
        columnData: {
          ...sheet.columnData,
          [columnIndex]: {
            columnId: newColumnId,
            type: columnType,
            title: title,
            width: 120
          }
        }
      };

      // Update workbook with new sheet data
      const updatedWorkbook: IWorkbookData = {
        ...workbookData,
        sheets: {
          ...workbookData.sheets,
          [sheetId]: updatedSheet
        }
      };

      // Apply the update
      await univerAPI.updateWorkbook(updatedWorkbook);
      console.log(`Added new column: ${title}`);
      
      setIsAddColumnOpen(false);

    } catch (error) {
      console.error('Error adding column:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDivision = async (costCode: string, tradeName: string) => {
    setIsLoading(true);
    try {
      // Get current workbook data
      const univerAPI = FUniver.newAPI(univer);
      const activeWorkbook = univerAPI.getActiveWorkbook();
      const workbookData = activeWorkbook.save();
      if (!workbookData) {
        throw new Error('No workbook data found');
      }

      // Get the active sheet
      const activeSheet = univerAPI.getActiveSheet();
      if (!activeSheet) {
        throw new Error('No active sheet found');
      }

      const sheetId = activeSheet.getSheetId();
      const sheet = workbookData.sheets[sheetId];

      // Find the first empty row
      const nextRowIndex = Object.keys(sheet.cellData).length;

      // Add the new division data to the sheet
      const updatedCellData = {
        ...sheet.cellData,
        [`${nextRowIndex},0`]: { v: costCode },
        [`${nextRowIndex},1`]: { v: tradeName },
      };

      // Update sheet data
      const updatedSheet: IWorksheetData = {
        ...sheet,
        cellData: updatedCellData,
      };

      // Update workbook with new sheet data
      const updatedWorkbook: IWorkbookData = {
        ...workbookData,
        sheets: {
          ...workbookData.sheets,
          [sheetId]: updatedSheet
        }
      };

      // Apply the update
      await univerAPI.updateWorkbook(updatedWorkbook);
      console.log(`Added new division: ${tradeName}`);

      // Call the onAddTrade callback
      if (onAddTrade) {
        await onAddTrade(`${costCode} - ${tradeName}`, 'division');
      }

      setIsAddTradeOpen(false);

    } catch (error) {
      console.error('Error adding division:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 p-2 border-b">
      <Button
        variant="outline"
        onClick={() => setIsAddColumnOpen(true)}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Column"}
      </Button>

      {sheetType === 'budget-summary' && (
        <Button
          variant="outline"
          onClick={() => setIsAddTradeOpen(true)}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Division"}
        </Button>
      )}

      <AddColumnDialog
        isOpen={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        sheetType={sheetType}
        onAddColumn={handleAddColumn}
        isLoading={isLoading}
      />

      {sheetType === 'budget-summary' && (
        <AddTradeDialog
          isOpen={isAddTradeOpen}
          onOpenChange={setIsAddTradeOpen}
          onAddTrade={(code, trade) => handleAddDivision(code, trade)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default SheetToolbar; 