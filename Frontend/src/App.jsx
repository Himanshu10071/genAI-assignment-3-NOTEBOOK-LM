import { useState } from 'react'
import UploadPanel from './components/UploadPanel.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import { askQuestion } from './services/api.js'

export default function App() {
  const [doc, setDoc] = useState(null)          // { name, collectionName, totalChunks }
  const [messages, setMessages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAsking, setIsAsking] = useState(false)

  const handleUploadSuccess = ({ name, collectionName, totalChunks }) => {
    setDoc({ name, collectionName, totalChunks })
    setMessages([])
  }

  const handleSend = async (question) => {
    if (!doc || isAsking) return
    const userId = `${Date.now()}_user`
    setMessages(prev => [...prev, { id: userId, role: 'user', content: question }])
    setIsAsking(true)
    try {
      const res = await askQuestion(question, doc.collectionName)
      const botId = `${Date.now()}_assistant`
      setMessages(prev => [...prev, { id: botId, role: 'assistant', content: res.answer, sources: res.source }])
    } catch (err) {
      const errorId = `${Date.now()}_error`
      setMessages(prev => [...prev, {
        id: errorId,
        role: 'assistant',
        content: `⚠️ ${err.message}`,
        isError: true,
        retryQuestion: question,
        sources: [],
      }])
    } finally {
      setIsAsking(false)
    }
  }

  const handleRetry = async (messageId, question) => {
    if (!doc || isAsking || !question) return
    setIsAsking(true)
    setMessages(prev => prev.map((msg) => (
      msg.id === messageId
        ? { ...msg, content: 'Retrying...', isError: false, isRetrying: true, sources: [] }
        : msg
    )))
    try {
      const res = await askQuestion(question, doc.collectionName)
      setMessages(prev => prev.map((msg) => (
        msg.id === messageId
          ? {
            ...msg,
            content: res.answer,
            sources: res.source,
            isError: false,
            isRetrying: false,
            retryQuestion: undefined,
          }
          : msg
      )))
    } catch (err) {
      setMessages(prev => prev.map((msg) => (
        msg.id === messageId
          ? {
            ...msg,
            content: `⚠️ ${err.message}`,
            isError: true,
            isRetrying: false,
            retryQuestion: question,
            sources: [],
          }
          : msg
      )))
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-tile" aria-hidden="true">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4.5h9a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v-12a2 2 0 0 1 2-2z" />
              <path d="M8 8.5h7" />
              <path d="M8 12h7" />
            </svg>
          </div>
          <span className="logo-text">Notebook LM</span>
        </div>
        <div className="header-badge">RAG-powered Q&amp;A</div>
      </header>

      <main className="main">
        <UploadPanel
          doc={doc}
          onUploadSuccess={handleUploadSuccess}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
        <div className="divider" />
        <ChatPanel
          doc={doc}
          messages={messages}
          onSend={handleSend}
          onRetry={handleRetry}
          isAsking={isAsking}
        />
      </main>
    </div>
  )
}
