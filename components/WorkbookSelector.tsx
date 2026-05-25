'use client';

import React from 'react';

interface WorkbookSelectorProps {
  selected: string;
  onSelect: (workbook: string) => void;
}

const WORKBOOKS = [
  'Master Excel Proto',
  'Personal Finance Intelligence Engine',
  'Pricing Model Valuation',
];

export default function WorkbookSelector({
  selected,
  onSelect,
}: WorkbookSelectorProps) {
  return (
    <div className="glass-panel p-4">
      <div className="sidebar-item mb-3">
        <span className="sidebar-icon">📘</span>
        <span className="font-semibold text-white">Workbook</span>
      </div>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="input-field w-full text-sm"
      >
        <option value="">Select a workbook</option>
        {WORKBOOKS.map((wb) => (
          <option key={wb} value={wb}>
            {wb}
          </option>
        ))}
      </select>
    </div>
  );
}
