'use client';

import React from 'react';

interface SheetSelectorProps {
  sheets: string[];
  selected: string;
  onSelect: (sheet: string) => void;
  disabled?: boolean;
}

export default function SheetSelector({
  sheets,
  selected,
  onSelect,
  disabled = false,
}: SheetSelectorProps) {
  return (
    <div className="glass-panel p-4">
      <div className="sidebar-item mb-3">
        <span className="sidebar-icon">📄</span>
        <span className="font-semibold text-white">Sheet</span>
      </div>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="input-field w-full text-sm disabled:opacity-50"
      >
        <option value="">Select a sheet</option>
        {sheets.map((sheet) => (
          <option key={sheet} value={sheet}>
            {sheet}
          </option>
        ))}
      </select>
    </div>
  );
}
