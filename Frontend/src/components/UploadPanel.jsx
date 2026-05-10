import { useState, useRef, useCallback } from 'react'
import { uploadDocument } from '../services/api.js'

export default function UploadPanel({ doc, onUploadSuccess, isUploading, setIsUploading }) {
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState(null)   // 'uploading' | 'indexing' | null
  const [error, setError] = useState(null)
  const [recentFiles, setRecentFiles] = useState([])
  const inputRef = useRef(null)

  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const addRecentFile = (file) => {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE'
    const entry = {
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      ext,
    }

    setRecentFiles((prev) => {
      const filtered = prev.filter((item) => item.name !== entry.name || item.size !== entry.size)
      return [entry, ...filtered].slice(0, 5)
    })
  }

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
      addRecentFile(file)
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
      <div className="panel-section">
        <span className="section-label">Sources</span>
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
              <div className="drop-icon-tile">
                <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="drop-title">Drop your file here</p>
              <p className="drop-subtitle">or click to browse</p>
              <div className="drop-formats">
                <span className="format-pill">PDF</span>
                <span className="format-pill">CSV</span>
                <span className="format-pill muted" title="TXT uploads are not supported yet">TXT</span>
              </div>
            </>
          )}
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}
      </div>

      <div className="panel-section">
        <span className="section-label">Recent</span>
        <div className="recent-list">
          {recentFiles.length === 0 ? (
            <div className="recent-empty">No uploads yet</div>
          ) : (
            recentFiles.map((file) => (
              <div className="recent-item" key={file.id}>
                <div className="recent-icon">{file.ext}</div>
                <div className="recent-info">
                  <p className="recent-name" title={file.name}>{file.name}</p>
                  <p className="recent-meta">{formatSize(file.size)}</p>
                </div>
                {doc?.name === file.name && (
                  <span className="recent-pill">Active</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="tip-card">
        <div className="tip-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 21h4" />
            <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.6 1.6 1.6 2.7h4c0-1.1.9-2.2 1.6-2.7A6 6 0 0 0 12 3z" />
          </svg>
        </div>
        <p className="tip-text"><span className="tip-accent">Tip:</span> Ask focused questions to get sharper answers.</p>
      </div>
    </aside>
  )
}
