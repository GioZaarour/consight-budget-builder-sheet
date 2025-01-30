# Consight Budget Builder Spreadsheet

A specialized spreadsheet component for the construction industry built with React, TypeScript, and Univer Sheets. This component provides a tailored spreadsheet experience for budget building in construction projects.

## Project Overview

This project implements a specialized spreadsheet component that supports two types of sheets:
1. Budget Summary Sheet - For overall project budget management
2. Division Sheets - For detailed trade/division-specific information

## Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── core files         # Main application files
```

### Core Files

- `App.tsx` - Main application component that manages the overall state and layout
- `UniverSpreadsheet.tsx` - Core spreadsheet component using Univer
- `useSpreadsheetState.ts` - Custom hook managing spreadsheet state and operations
- `types.ts` - Core type definitions for the application

### Components

1. **AddTradeDialog** (`add-trade.tsx`)
   - Dialog for adding new trades/divisions
   - Uses cost codes from `defaultCostCodes.ts`
   - Only active when on Budget Summary sheet

2. **AddColumnDialog** (`AddColumnDialog.tsx`)
   - Dialog for adding new columns
   - Enforces column type restrictions based on sheet type

3. **ColumnHeader** (`ColumnHeader.tsx`)
   - Custom column header component
   - Supports renaming and moving columns
   - Integrates with Subcontractor functionality

4. **ColumnHeaderMenu** (`ColumnHeaderMenu.tsx`)
   - Context menu for column operations
   - Supports column management operations

5. **CustomToolbar** (`CustomToolbar.tsx`)
   - Custom toolbar component
   - Contains Add Division and Add Column buttons

6. **SubcontractorButton** (`SubcontractorButton.tsx`)
   - Button component for Subcontractor columns
   - Integrates with bidbook functionality

### Type Definitions

```typescript
// Column Types for Division Sheets
enum DivisionColumnType {
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

// Column Types for Budget Summary Sheets
enum BudgetSummaryColumnType {
  COST_CODE = 'BUDGET_COST_CODE',
  DIVISION = 'BUDGET_DIVISION',
  DETAILS = 'BUDGET_DETAILS',
  COST = 'BUDGET_COST',
  NOTES = 'BUDGET_NOTES'
}
```

## Setup Instructions

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd consight-budget-builder-sheet

   # Install dependencies
   npm install
   ```

3. **Running the Development Server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Dependencies

- React 18.2.0
- TypeScript 4.9.5
- Univer Sheets 0.5.3 (and related packages)
- UUID 9.0.1

## Current Implementation Status

### Working Features
- Basic sheet structure
- Column type definitions
- Sheet type definitions (Budget Summary and Division)
- Add Trade dialog
- Add Column dialog
- Column header customization

### Known Issues

1. **Univer API Integration Issues**:
   - Command execution and event handling
   - Sheet data management
   - Service access and type definitions

2. **Component Issues**:
   - JSX element type errors in App.tsx
   - Component return type issues

3. **Current Linter Errors**:
   ```typescript
   // App.tsx
   - Property 'div' does not exist on type 'JSX.IntrinsicElements'
   - 'CustomToolbar' cannot be used as a JSX component
   - 'UniverSpreadsheet' cannot be used as a JSX component
   - 'AddTradeDialog' cannot be used as a JSX component
   - 'AddColumnDialog' cannot be used as a JSX component
   ```

   Potential fixes:
   - Add proper type definitions for components
   - Update tsconfig.json to include JSX settings
   - Export components with correct React.FC typing
   - Add proper return type annotations

4. **Type Definition Issues**:
   - Missing or incorrect type exports
   - Incomplete interface definitions
   - Component prop type mismatches

### Required Fixes

1. **TypeScript Configuration**:
   ```json
   // tsconfig.json additions needed
   {
     "compilerOptions": {
       "jsx": "react",
       "esModuleInterop": true,
       "skipLibCheck": true
     }
   }
   ```

2. **Component Exports**:
   ```typescript
   // Correct component exports
   export const CustomToolbar: React.FC<CustomToolbarProps> = (props) => {
     // Component implementation
   };
   ```

3. **Type Definitions**:
   - Add proper interface definitions for all components
   - Export all necessary types
   - Add proper prop type definitions

### Next Steps
1. Fix Univer API integration:
   - Update to correct service access methods
   - Implement proper event handling
   - Fix type definitions

2. Resolve component issues:
   - Fix JSX element type errors
   - Update component return types
   - Implement proper type checking

3. Implement missing features:
   - Column movement
   - Data persistence
   - Bidbook integration
   - Sheet state management
