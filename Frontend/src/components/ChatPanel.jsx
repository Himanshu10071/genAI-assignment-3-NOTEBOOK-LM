import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble.jsx'

const SUGGESTIONS = [
  'Summarize this document',
  'What are the key points?',
  'Explain the main concepts',
]

export default function ChatPanel({ doc, messages, onSend, isAsking }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAsking])

  const submit = () => {
    const q = input.trim()
    if (!q || isAsking || !doc) return
    onSend(q)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  return (
    <section className="chat-panel">

      {/* ── Messages area ── */}
      <div className="messages-area">
        {!doc ? (
          <div className="empty-state">
            <div className="empty-emoji">💬</div>
            <h3>No document loaded</h3>
            <p>Upload a PDF or CSV on the left to start chatting</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-emoji">🔍</div>
            <h3>Ready to answer</h3>
            <p>Ask anything about <strong>{doc.name}</strong></p>
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
              <MessageBubble key={i} message={msg} />
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
          <textarea
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={doc ? `Ask about ${doc.name}…` : 'Upload a document first'}
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
