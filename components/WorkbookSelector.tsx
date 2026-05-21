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
    <div className="card p-4 m-4">
      <label className="block text-sm font-medium text-soarx-silver mb-2 text-futuristic">
        Workbook
      </label>
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
