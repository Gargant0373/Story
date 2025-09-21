import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Home'
import Admin from './Admin'

type Story = {
  id: number
  name: string
  story: string
  created_at: string
}

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [name, setName] = useState('')
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminSecret, setAdminSecret] = useState<string | null>(() => sessionStorage.getItem('adminSecret'))
  const navigate = useNavigate()

  const API = import.meta.env.VITE_API_URL ?? (typeof window !== 'undefined' && window.location.hostname ? '/api' : 'http://localhost:4000')

  useEffect(() => {
    fetch(`${API}/stories`).then((r) => r.json()).then(setStories)
  }, [])

  useEffect(() => {
    if (adminSecret) sessionStorage.setItem('adminSecret', adminSecret)
    else sessionStorage.removeItem('adminSecret')
  }, [adminSecret])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !story.trim()) return
    setLoading(true)
    const res = await fetch(`${API}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, story })
    })
    const created = await res.json()
    setStories((s) => [created, ...s])
    setName('')
    setStory('')
    setLoading(false)
  }

  async function trySecret(e: React.FormEvent) {
    e.preventDefault()
    // verify secret by attempting an empty DELETE check is avoided; use a lightweight probe
    const res = await fetch(`${API}/stories`, { method: 'GET', headers: adminSecret ? { 'X-Admin-Secret': adminSecret } : {} })
    if (res.ok) {
      navigate('/admin')
    } else {
      alert('secret rejected')
    }
  }

  async function handleDelete(id: number) {
    if (!adminSecret) return alert('no secret set')
    if (!confirm('Delete story '+id+'?')) return
    const res = await fetch(`${API}/stories/${id}`, { method: 'DELETE', headers: { 'X-Admin-Secret': adminSecret } })
    if (res.status === 204) {
      setStories(s => s.filter(x => x.id !== id))
    } else {
      const j = await res.json().catch(() => ({}))
      alert('delete failed: ' + (j.error || res.status))
    }
  }

  async function handleLike(id: number) {
    try {
      const res = await fetch(`${API}/stories/${id}/like`, { method: 'POST' })
      if (!res.ok) throw new Error('like failed')
      const json = await res.json()
      setStories(s => s.map(st => st.id === id ? { ...st, likes: json.likes ?? (st as any).likes ?? 0 } : st))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div id="app-root">
      <header>
        <h1 className="typewriter">Bathroom Stories</h1>
        <p className="subtitle">What do you think the bathroom story is?</p>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home stories={stories} name={name} story={story} loading={loading} onName={setName} onStory={setStory} onSubmit={submit} onLike={handleLike} />} />
          <Route path="/admin" element={<Admin stories={stories} adminSecret={adminSecret} setAdminSecret={setAdminSecret} onTrySecret={trySecret} onDelete={handleDelete} onLike={handleLike} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
