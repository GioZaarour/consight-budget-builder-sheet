import React from 'react';
import { IScale } from "@univerjs/core";
import { SheetExtension, SpreadsheetSkeleton, SheetColumnHeaderExtensionRegistry } from "@univerjs/engine-render";
import BidBookUploader from './BidBookUploader.tsx';

export class SubcontractorColumnHeader extends SheetExtension {
  override uKey = 'SubcontractorColumnHeader';
  
  override get zIndex() {
    return 11; // Must be greater than 10 for column headers
  }

  override draw(ctx: RenderingContext, parentScale: IScale, spreadsheetSkeleton: SpreadsheetSkeleton) {
    const sheet = spreadsheetSkeleton.getSheet();
    const columnData = sheet.getColumnData();
    const title = columnData?.title || '';
    const columnId = columnData?.columnId || '';
    const sheetId = sheet.getSheetId();

    return (
      <div className="flex items-center justify-between px-2 w-full h-full">
        <span className="truncate">{title}</span>
        <BidBookUploader 
          columnId={columnId}
          sheetId={sheetId}
          subcontractorName={title}
        />
      </div>
    );
  }
}

// Register the extension
SheetColumnHeaderExtensionRegistry.add(new SubcontractorColumnHeader());