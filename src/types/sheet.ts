import { DivisionColumnType, BudgetSummaryColumnType } from '../components/ss.tsx';

// Column interface to define structure for our columns
export interface Column {
  id: string;
  type: DivisionColumnType | BudgetSummaryColumnType;
  title: string;
  width?: number;
  isNumeric?: boolean;
  isEditable?: boolean;
}

// Metadata for column types
export const columnTypeMetadata = {
  [DivisionColumnType.CODE]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.COST]: { isNumeric: true, isEditable: true },
  [DivisionColumnType.LINE_ITEMS]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.NOTES]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.OTHER]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.QUANTITY]: { isNumeric: true, isEditable: true },
  [DivisionColumnType.REFERENCE]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.REQUIRED_QUANTITY]: { isNumeric: true, isEditable: true },
  [DivisionColumnType.SUBCONTRACTOR]: { isNumeric: false, isEditable: true },
  [DivisionColumnType.UNIT_COST]: { isNumeric: true, isEditable: true },
  [DivisionColumnType.UNITS]: { isNumeric: false, isEditable: true },
  [BudgetSummaryColumnType.COST_CODE]: { isNumeric: false, isEditable: true },
  [BudgetSummaryColumnType.DIVISION]: { isNumeric: false, isEditable: true },
  [BudgetSummaryColumnType.DETAILS]: { isNumeric: false, isEditable: true },
  [BudgetSummaryColumnType.COST]: { isNumeric: true, isEditable: true },
  [BudgetSummaryColumnType.NOTES]: { isNumeric: false, isEditable: true },
}; 

// Helper functions for column management
export const isNumericColumn = (type: DivisionColumnType | BudgetSummaryColumnType): boolean => {
  return columnTypeMetadata[type]?.isNumeric || false;
};

export const isEditableColumn = (type: DivisionColumnType | BudgetSummaryColumnType): boolean => {
  return columnTypeMetadata[type]?.isEditable || false;
};

export const getColumnDefaults = (
  type: DivisionColumnType | BudgetSummaryColumnType,
  title: string
): Partial<Column> => {
  return {
    width: 120,
    isNumeric: isNumericColumn(type),
    isEditable: isEditableColumn(type),
    title,
    type
  };
}; 