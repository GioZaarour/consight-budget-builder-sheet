'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx"
import { Button } from "./ui/button.tsx"

interface BidBookUploaderProps {
  columnId: string;
  sheetId: string;
  subcontractorName: string;
}

export default function BidBookUploader({ 
  columnId, 
  sheetId,
  subcontractorName 
}: BidBookUploaderProps) {
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [uploadStatus, setUploadStatus] = useState({ complete: false, filename: '' })

  const handleSave = () => {
    console.log('Saving changes:', { 
      columnId, 
      sheetId, 
      subcontractorName, 
      phone, 
      email 
    });
    setOpen(false);
    setUploadStatus({ complete: false, filename: '' });
  }

  const handleUploadComplete = (res: { name: string }[]) => {
    console.log('Upload completed for:', subcontractorName);
    if (res && res[0]) {
      setUploadStatus({ 
        complete: true, 
        filename: res[0].name 
      });
    }
  }

  const isValidEmail = !email || email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const isValidPhone = !phone || phone.length >= 10;
  const isFormValid = isValidEmail && isValidPhone;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          📋
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[425px]">
        {/* Rest of the component remains the same */}
      </PopoverContent>
    </Popover>
  );
} 