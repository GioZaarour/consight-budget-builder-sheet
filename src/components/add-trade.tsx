import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog.tsx"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "./ui/command.tsx"
import { ScrollArea } from "./ui/scroll-area.tsx"
import defaultCostCodes from "../utils/defaultCostCodes.ts"

interface AddTradeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTrade: (code: string, trade: string) => void;
  isLoading?: boolean;
}

export default function AddTradeDialog({
  isOpen,
  onOpenChange,
  onAddTrade,
  isLoading
}: AddTradeDialogProps) {
  const handleSelect = (item: { code: string; trade: string }) => {
    onAddTrade(item.code, item.trade);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>Add a Division Sheet</DialogTitle>
        </DialogHeader>
        <div className="relative h-[400px]">
          <Command className="rounded-lg border shadow-md absolute inset-0">
            <CommandList>
              <CommandEmpty>No divisions found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[400px]">
                  <div className="p-1">
                    {defaultCostCodes.map((item) => (
                      <CommandItem
                        key={item.code}
                        onSelect={() => handleSelect(item)}
                        className={`flex items-center px-4 py-2 rounded-sm ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
                        }`}
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-4 w-full">
                          <span className="font-medium min-w-[60px] text-sm">{item.code}</span>
                          <span className="text-sm text-muted-foreground">{item.trade}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}