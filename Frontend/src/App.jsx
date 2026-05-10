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
          <svg className="logo-svg" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#lg)" />
            <path d="M9 10h14M9 16h10M9 22h12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c5cfc"/>
                <stop offset="1" stopColor="#4f46e5"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">NOTEBOOK LM</span>
        </div>
        <p className="header-tag">RAG-powered document Q&amp;A</p>
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
