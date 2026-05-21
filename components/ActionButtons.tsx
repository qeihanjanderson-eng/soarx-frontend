'use client';

import React from 'react';

interface ActionButtonsProps {
  onFillExcel: () => void;
  onAnalyzeClient: () => void;
  onGenerateReport: () => void;
  isLoading: boolean;
}

export default function ActionButtons({
  onFillExcel,
  onAnalyzeClient,
  onGenerateReport,
  isLoading,
}: ActionButtonsProps) {
  return (
    <div className="card p-4 m-4 space-y-2">
      <button
        onClick={onFillExcel}
        disabled={isLoading}
        className="button-primary w-full"
      >
        Fill Excel Automatically
      </button>
      <button
        onClick={onAnalyzeClient}
        disabled={isLoading}
        className="button-secondary w-full"
      >
        Analyze Client Data
      </button>
      <button
        onClick={onGenerateReport}
        disabled={isLoading}
        className="button-secondary w-full"
      >
        Generate Word Report
      </button>
    </div>
  );
}
