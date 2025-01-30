import React, { useState } from 'react';
import { SubcontractorInfo } from '../types/types';

interface BidBookProps {
  columnId: string;
  sheetId: string;
  subcontractorInfo?: SubcontractorInfo;
  onSave: (info: SubcontractorInfo) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const BidBook: React.FC<BidBookProps> = ({
  columnId,
  sheetId,
  subcontractorInfo,
  onSave,
  onClose,
  isOpen,
}) => {
  const [name, setName] = useState(subcontractorInfo?.name || '');
  const [email, setEmail] = useState(subcontractorInfo?.email || '');
  const [phone, setPhone] = useState(subcontractorInfo?.phone || '');
  const [company, setCompany] = useState(subcontractorInfo?.company || '');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = phone.replace(/\D/g, '').length >= 10;
  const isFormValid = name && isValidEmail && isValidPhone && company;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave({
        name,
        email,
        phone,
        company,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '400px',
      }}>
        <h2 style={{ marginTop: 0 }}>Subcontractor Details</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
                placeholder="Enter subcontractor name"
              />
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Company:
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
                placeholder="Enter company name"
              />
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Phone:
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
                placeholder="Enter phone number"
              />
            </label>
            {phone && !isValidPhone && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                Phone number must be at least 10 digits
              </p>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
                required
                placeholder="Enter email address"
              />
            </label>
            {email && !isValidEmail && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                Please enter a valid email address
              </p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isFormValid ? '#007bff' : '#6c757d',
                color: 'white',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};