const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export async function uploadDocument(file) {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Upload failed')
  return json
}

export async function askQuestion(question, collectionName) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, collectionName }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Chat request failed')
  return json
}
