'use client';

import React from 'react';

interface Result {
  fieldsUpdated: string[];
  sheetsModified: string[];
  extractedValues: Record<string, string>;
  reportPath?: string;
}

interface ResultsPanelProps {
  result: Result | null;
  isVisible: boolean;
}

export default function ResultsPanel({ result, isVisible }: ResultsPanelProps) {
  if (!isVisible || !result) return null;

  return (
    <div className="card border-t m-4 mt-0 p-4 bg-soarx-deep-gray space-y-4">
      <h3 className="font-semibold text-soarx-silver text-futuristic">Results</h3>

      {result.fieldsUpdated.length > 0 && (
        <div>
          <p className="text-sm font-medium text-soarx-cyber-green">Fields Updated</p>
          <ul className="mt-2 space-y-1">
            {result.fieldsUpdated.map((field, idx) => (
              <li key={idx} className="text-sm text-soarx-silver/80">
                • {field}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.sheetsModified.length > 0 && (
        <div>
          <p className="text-sm font-medium text-soarx-cyber-green">Sheets Modified</p>
          <ul className="mt-2 space-y-1">
            {result.sheetsModified.map((sheet, idx) => (
              <li key={idx} className="text-sm text-soarx-silver/80">
                • {sheet}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(result.extractedValues).length > 0 && (
        <div>
          <p className="text-sm font-medium text-soarx-cyber-green">Extracted Values</p>
          <div className="mt-2 space-y-1">
            {Object.entries(result.extractedValues).map(([key, value]) => (
              <div key={key} className="text-sm text-soarx-silver/80">
                <span className="font-medium text-soarx-electric-blue">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.reportPath && (
        <div>
          <a
            href={result.reportPath}
            download
            className="inline-flex items-center text-sm font-medium text-soarx-cyber-green hover:text-soarx-orange transition-colors"
          >
            📥 Download Report
          </a>
        </div>
      )}
    </div>
  );
}
