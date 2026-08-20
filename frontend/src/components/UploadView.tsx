import React, { useState } from 'react';
import { uploadPlanningSpreadsheet, PlanningVersion } from '../lib/api';
import { UploadCloud, FileCheck, AlertCircle, Loader2 } from 'lucide-react';

interface UploadViewProps {
  onUploadSuccess: (newVersion: PlanningVersion) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const result = await uploadPlanningSpreadsheet(selectedFile);
      setSuccessMsg(`Successfully uploaded and validated "${result.file_name}"!`);
      onUploadSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload failed. Please check backend connection.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
        <UploadCloud color="var(--accent-cyan)" size={28} />
        Upload Monthly Capacity Spreadsheet
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Upload `.xlsx` or `.csv` files for Bhubaneswar plant capacity validation and automated 12-month horizon ingestion into the Capacity Engine.
      </p>

      {errorMessage && (
        <div style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(0, 230, 118, 0.1)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <FileCheck size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="dropzone" onClick={() => document.getElementById('file-input')?.click()}>
        <input 
          id="file-input" 
          type="file" 
          accept=".xlsx,.csv" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        <UploadCloud size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          {selectedFile ? selectedFile.name : 'Click to select or drag & drop Excel planning file'}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Supported Formats: .xlsx, .csv (Max 25 MB)'}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {selectedFile && (
          <button
            onClick={() => setSelectedFile(null)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Clear
          </button>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          style={{
            background: selectedFile && !isUploading ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255, 255, 255, 0.1)',
            color: selectedFile && !isUploading ? '#fff' : 'var(--text-dim)',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: selectedFile && !isUploading ? '0 0 15px rgba(0, 210, 255, 0.3)' : 'none'
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Validating & Uploading...</span>
            </>
          ) : (
            <span>Run Automated Ingestion</span>
          )}
        </button>
      </div>
    </div>
  );
};
