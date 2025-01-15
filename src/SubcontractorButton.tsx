import React, { useState } from 'react';
import { SubcontractorInfo } from './types';

interface SubcontractorButtonProps {
  columnId: string;
  sheetId: string;
  subcontractorInfo?: SubcontractorInfo;
  onViewDetails: (columnId: string, sheetId: string) => void;
}

export const SubcontractorButton: React.FC<SubcontractorButtonProps> = ({
  columnId,
  sheetId,
  subcontractorInfo,
  onViewDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onViewDetails(columnId, sheetId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '4px 8px',
        fontSize: '12px',
        backgroundColor: isHovered ? '#007bff' : '#e9ecef',
        color: isHovered ? 'white' : '#212529',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        transition: 'all 0.2s ease',
      }}
    >
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={isHovered ? 'white' : '#212529'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      {subcontractorInfo?.name || 'View Subcontractor'}
    </button>
  );
}; 