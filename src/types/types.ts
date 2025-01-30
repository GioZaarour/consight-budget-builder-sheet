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

export interface Column {
  id: string;
  title: string;
  type: ColumnType;
}

export interface Sheet {
  id: string;
  name: string;
  type: 'budget' | 'division';
  columns: Column[];
  data: Record<string, any>[];
}

export interface SpreadsheetState {
  metadata: {
    projectId: string;
    activeSheetId: string;
  };
  sheets: Record<string, Sheet>;
}

export interface SubcontractorInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
} 