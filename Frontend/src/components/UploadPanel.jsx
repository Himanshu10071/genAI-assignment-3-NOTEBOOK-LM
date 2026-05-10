import { useState, useRef, useCallback } from 'react'
import { uploadDocument } from '../services/api.js'

export default function UploadPanel({ doc, onUploadSuccess, isUploading, setIsUploading }) {
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState(null)   // 'uploading' | 'indexing' | null
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'csv'].includes(ext)) {
      setError('Only PDF and CSV files are supported.')
      return
    }
    setError(null)
    setIsUploading(true)
    setStatus('uploading')
    try {
      setStatus('indexing')
      const res = await uploadDocument(file)
      onUploadSuccess({
        name: file.name,
        collectionName: res.data.collectionName,
        totalChunks: res.data.totalChunks,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
      setStatus(null)
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  return (
    <aside className="upload-panel">
      <div className="panel-header">
        <span className="panel-icon">📂</span>
        <div>
          <h2 className="panel-title">Sources</h2>
          <p className="panel-subtitle">Upload a document to begin</p>
        </div>
      </div>

      {doc && (
        <div className="doc-card">
          <div className="doc-file-icon">
            {doc.name.endsWith('.pdf') ? '📄' : '📊'}
          </div>
          <div className="doc-info">
            <p className="doc-name" title={doc.name}>{doc.name}</p>
            <p className="doc-meta">{doc.totalChunks} chunks indexed</p>
          </div>
          <span className="doc-badge">✓ Ready</span>
        </div>
      )}

      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${isUploading ? 'loading' : ''}`}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !isUploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload document"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {isUploading ? (
          <div className="upload-loader">
            <span className="spinner" />
            <p className="loader-text">{status === 'uploading' ? 'Uploading...' : 'Indexing document...'}</p>
          </div>
        ) : (
          <>
            <div className="drop-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="drop-label">{doc ? 'Replace document' : 'Drop your file here'}</p>
            <p className="drop-hint">Click to browse · PDF or CSV</p>
          </>
        )}
      </div>

      {error && <div className="error-box">⚠️ {error}</div>}

      <div className="formats-row">
        <span className="fmt-chip pdf">PDF</span>
        <span className="fmt-chip csv">CSV</span>
        <span className="fmt-note">Max file size depends on your plan</span>
      </div>
    </aside>
  )
}
