import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MessageBubble({ message, onRetry, isAsking }) {
  const isUser = message.role === 'user'

  return (
    <div className={`bubble-row ${isUser ? 'user-row' : 'ai-row'}`}>
      <div className="bubble-avatar">{isUser ? '👤' : '🤖'}</div>
      <div className={`bubble ${isUser ? 'user-bubble' : 'ai-bubble'} ${message.isError ? 'error-bubble' : ''}`}>
        <span className="bubble-role">{isUser ? 'You' : 'NOTEBOOK LM'}</span>
        <div className="bubble-text">
          {isUser
            ? <p>{message.content}</p>
            : <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          }
        </div>
        {!isUser && message.sources?.length > 0 && (
          <div className="sources-row">
            <span className="sources-label">Sources:</span>
            {message.sources.map((src, i) => (
              <span key={i} className="source-chip">
                {src.metadata?.originalName
                  ? `${src.metadata.originalName.split('.')[0]} · chunk ${i + 1}`
                  : `Chunk ${i + 1}`}
              </span>
            ))}
          </div>
        )}
        {!isUser && message.isError && message.retryQuestion && onRetry && (
          <div className="retry-row">
            <button
              className="retry-btn"
              type="button"
              onClick={() => onRetry(message.id, message.retryQuestion)}
              disabled={isAsking || message.isRetrying}
            >
              {message.isRetrying ? 'Retrying...' : 'Try again'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
