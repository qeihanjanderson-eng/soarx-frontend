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
    <div className="card p-4 space-y-4 m-4">
      <h3 className="font-semibold text-soarx-silver text-futuristic">Upload Files</h3>

      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-soarx-cyber-green bg-soarx-cyber-green/10 shadow-soarx-glow-green'
            : 'border-soarx-silver/30 bg-soarx-navy/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.pdf"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
        <div className="text-sm text-soarx-silver/80">
          <p className="font-medium">Drag and drop your files here</p>
          <p className="text-xs text-soarx-silver/60 mt-1">or click to select</p>
          <p className="text-xs text-soarx-silver/60 mt-1">Supported: Excel (.xlsx), PDF</p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <p className="text-xs font-medium text-soarx-silver/50 uppercase tracking-wide">
            Uploaded Files
          </p>
          <ul className="mt-2 space-y-1">
            {uploadedFiles.map((file, idx) => (
              <li key={idx} className="text-sm text-soarx-cyber-green">
                ✓ {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
