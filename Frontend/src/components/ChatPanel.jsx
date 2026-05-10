import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble.jsx'

const SUGGESTIONS = [
  'Summarize this document',
  'What are the key points?',
  'Explain the main concepts',
]

export default function ChatPanel({ doc, messages, onSend, onRetry, isAsking }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const resizeTextarea = (element = textareaRef.current) => {
    if (!element) return
    element.style.height = 'auto'
    const nextHeight = Math.min(element.scrollHeight, 200)
    element.style.height = `${nextHeight}px`
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAsking])

  useEffect(() => {
    resizeTextarea()
  }, [input])

  const submit = () => {
    const q = input.trim()
    if (!q || isAsking || !doc) return
    onSend(q)
    setInput('')
    requestAnimationFrame(() => resizeTextarea())
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'Enter' && e.shiftKey) {
      requestAnimationFrame(() => resizeTextarea(e.currentTarget))
    }
  }

  return (
    <section className="chat-panel">

      {/* ── Messages area ── */}
      <div className="messages-area">
        {!doc ? (
          <div className="empty-state">
            <div className="empty-icon-tile" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18h6" />
                <path d="M4 6h16v9a3 3 0 0 1-3 3H7l-3 3V6z" />
              </svg>
            </div>
            <h3 className="empty-title">No document loaded</h3>
            <p className="empty-subtitle">Upload a source to start asking questions.</p>
            <div className="step-pills">
              <span className="step-pill"><span>1.</span><span>Upload</span></span>
              <span className="step-arrow">&rarr;</span>
              <span className="step-pill"><span>2.</span><span>Process</span></span>
              <span className="step-arrow">&rarr;</span>
              <span className="step-pill"><span>3.</span><span>Chat</span></span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-tile" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </div>
            <h3 className="empty-title">Ready to answer</h3>
            <p className="empty-subtitle">Ask anything about <strong>{doc.name}</strong></p>
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggestion-btn" onClick={() => onSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id || i}
                message={msg}
                onRetry={onRetry}
                isAsking={isAsking}
              />
            ))}
            {isAsking && (
              <div className="thinking">
                <span className="t-avatar">🤖</span>
                <div className="thinking-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div className="input-area">
        <div className={`input-wrapper ${!doc ? 'locked' : ''}`}>
          <div className="input-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </div>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => resizeTextarea(e.currentTarget)}
            onKeyDown={onKeyDown}
            placeholder={doc ? `Ask about ${doc.name}…` : 'Upload a document first…'}
            disabled={!doc || isAsking}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={submit}
            disabled={!doc || !input.trim() || isAsking}
            aria-label="Send message"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift+Enter for new line</p>
      </div>
    </section>
  )
}
