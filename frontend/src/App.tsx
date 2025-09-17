import { useEffect, useState } from 'react'
import './App.css'

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

  // When running in docker with nginx, the backend is proxied at /api
  const API = import.meta.env.VITE_API_URL ?? (typeof window !== 'undefined' && window.location.hostname ? '/api' : 'http://localhost:4000')

  useEffect(() => {
    fetch(`${API}/stories`).then((r) => r.json()).then(setStories)
  }, [])

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

  return (
    <div id="app-root">
      <header>
        <h1 className="typewriter">Bathroom Stories</h1>
        <p className="subtitle">What do you think the bathroom story is?</p>
      </header>

      <main>
        <section className="form-section">
          <form onSubmit={submit}>
            <label>
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alice" />
            </label>
            <label>
              Story
              <textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Once upon a time..." rows={6} />
            </label>
            <div className="actions">
              <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Share story'}</button>
            </div>
          </form>
        </section>

        <section className="list-section">
          {stories.length === 0 ? (
            <p className="muted">No stories yet. Be the first!</p>
          ) : (
            stories.map(s => (
              <article className="story" key={s.id}>
                <div className="meta">
                  <strong className="name">{s.name}</strong>
                  <time>{new Date(s.created_at).toLocaleString()}</time>
                </div>
                <p className="content">{s.story}</p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
