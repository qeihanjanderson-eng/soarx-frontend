'use client';

import React from 'react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  uploadedFiles: string[];
}

export default function FileUpload({
  onFileSelected,
  isLoading,
  uploadedFiles,
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.pdf')) {
        onFileSelected(file);
      } else {
        alert('Only .xlsx and .pdf files are supported');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-4">
      <div className="sidebar-item mb-4">
        <span className="sidebar-icon">📤</span>
        <span className="font-semibold text-white">Upload Files</span>
      </div>

      <div
        role="button"
        tabIndex={0}
        className={`group border-2 border-dashed rounded-3xl p-6 text-center transition-all duration-300 ${
          dragActive
            ? 'border-cyan-300 bg-cyan-500/10 shadow-[0_0_0_20px_rgba(56,189,248,0.06)]'
            : 'border-white/10 bg-white/5 hover:border-cyan-300'
        } cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
        <p className="text-sm font-semibold text-white">Drag & drop or click to upload</p>
        <p className="mt-2 text-xs text-white/60">Supports Excel (.xlsx) and PDF files</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Uploaded Files</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            {uploadedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-cyan-200">•</span>
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
