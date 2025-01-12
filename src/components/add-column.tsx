'use client'

import React, { useState } from 'react'
import { Button } from "./ui/button.tsx"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog.tsx"
import { ScrollArea } from "./ui/scroll-area.tsx"
import { Input } from "./ui/input.tsx"
import { Label } from "./ui/label.tsx"
import { DivisionColumnType, BudgetSummaryColumnType } from './ss.tsx'

interface AddColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sheetType: 'budget-summary' | 'division';
  onAddColumn: (columnType: string, title: string) => void;
  isLoading?: boolean;
}

const getAvailableColumnTypes = (sheetType: 'budget-summary' | 'division') => {
  if (sheetType === 'budget-summary') {
    return Object.values(BudgetSummaryColumnType).map(type => ({
      type,
      label: type.replace('BUDGET_', '').replace(/_/g, ' ').toLowerCase()
    }));
  }
  return Object.values(DivisionColumnType).map(type => ({
    type,
    label: type.replace('DIVISION_', '').replace(/_/g, ' ').toLowerCase()
  }));
};

export default function AddColumnDialog({ 
  isOpen, 
  onOpenChange, 
  sheetType,
  onAddColumn,
  isLoading
}: AddColumnDialogProps) {
  const [selectedColumnType, setSelectedColumnType] = useState<string>()
  const [columnTitle, setColumnTitle] = useState('')

  const handleSubmit = () => {
    if (selectedColumnType && columnTitle) {
      onAddColumn(selectedColumnType, columnTitle)
      onOpenChange(false)
      setSelectedColumnType(undefined)
      setColumnTitle('')
    }
  }

  const columnTypes = getAvailableColumnTypes(sheetType)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Column</DialogTitle>
          <DialogDescription>
            Add a new column to your sheet.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">
              Column Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="column-title"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              placeholder="Enter column title"
            />
          </div>
          <div className="space-y-2">
            <Label>
              Column Type <span className="text-red-500">*</span>
            </Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {columnTypes.map(({ type, label }) => (
                <div
                  key={type}
                  className={`cursor-pointer p-2 rounded-md transition-colors ${
                    selectedColumnType === type 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedColumnType(type)}
                >
                  {label}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedColumnType || !columnTitle || isLoading}
          >
            {isLoading ? "Adding..." : "Add Column"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}