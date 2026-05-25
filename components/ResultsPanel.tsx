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
    <div className="glass-panel border border-white/10 p-5 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Result Summary</p>
          <h3 className="text-lg font-semibold text-white">Recent insights</h3>
        </div>
        {result.reportPath && (
          <a
            href={result.reportPath}
            download
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
          >
            📥 Download Report
          </a>
        )}
      </div>

      {result.fieldsUpdated.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm font-semibold text-cyan-200">Fields Updated</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {result.fieldsUpdated.map((field, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-cyan-300">•</span>
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.sheetsModified.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm font-semibold text-cyan-200">Sheets Modified</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            {result.sheetsModified.map((sheet, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-cyan-300">•</span>
                {sheet}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(result.extractedValues).length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm font-semibold text-cyan-200">Extracted Values</p>
          <div className="mt-3 space-y-2 text-sm text-white/75">
            {Object.entries(result.extractedValues).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <span className="min-w-[100px] font-semibold text-white/90">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
