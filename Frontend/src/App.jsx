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
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setIsAsking(true)
    try {
      const res = await askQuestion(question, doc.collectionName)
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer, sources: res.source }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message}`, isError: true }])
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
          isAsking={isAsking}
        />
      </main>
    </div>
  )
}
