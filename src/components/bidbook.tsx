'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover.tsx"
import { Button } from "./ui/button.tsx"
import { Input } from "./ui/input.tsx"
import { Label } from "./ui/label.tsx"
import { Check } from 'lucide-react'

export default function BidBookUploader() {
  const [open, setOpen] = useState(false)
  const [subcontractor, setSubcontractor] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSave = () => {
    console.log('Saving changes:', { subcontractor, phone, email })
    setOpen(false)
  }

  const isValidEmail = !email || email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  const isValidPhone = !phone || phone.length >= 10
  const isFormValid = subcontractor.trim().length > 0 && isValidEmail && isValidPhone

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">BidBook</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[425px]">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold">BidBook</h1>
            <p className="text-sm text-muted-foreground">
              Upload this sub's latest contact info and proposal.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcontractor">Subcontractor Name <span className="text-red-500">*</span></Label>
            <Input 
              id="subcontractor" 
              placeholder="Enter subcontractor name" 
              value={subcontractor}
              onChange={(e) => setSubcontractor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Enter phone number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phone && !isValidPhone && (
              <p className="text-sm text-red-500">Phone number must be at least 10 digits</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && !isValidEmail && (
              <p className="text-sm text-red-500">Please enter a valid email address</p>
            )}
          </div>
          <Button onClick={handleSave} className="w-full" disabled={!isFormValid}>
            Save Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}