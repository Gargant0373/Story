import React from 'react'

type Story = {
  id: number
  name: string
  story: string
  created_at: string
  likes?: number
}

export default function Home(props: {
  stories: Story[]
  name: string
  story: string
  loading: boolean
  onName: (v: string) => void
  onStory: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onLike: (id: number) => Promise<void>
}){
  const { stories, name, story, loading, onName, onStory, onSubmit, onLike } = props
  const [liked, setLiked] = React.useState<Set<number>>(() => {
    try {
      const raw = sessionStorage.getItem('liked')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch { return new Set() }
  })

  React.useEffect(() => {
    try { sessionStorage.setItem('liked', JSON.stringify(Array.from(liked))) } catch {}
  }, [liked])
  return (
    <>
      <section className="form-section">
        <form onSubmit={onSubmit}>
          <label>
            Your name
            <input value={name} onChange={(e) => onName(e.target.value)} placeholder="Alice" />
          </label>
          <label>
            Story
            <textarea value={story} onChange={(e) => onStory(e.target.value)} placeholder="Once upon a time..." rows={6} />
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
              <div className="meta below">
                <span className="likes">Likes: {s.likes ?? 0}</span>
                <button disabled={liked.has(s.id)} onClick={async () => { await onLike(s.id); setLiked(prev => new Set(prev).add(s.id)) }}>{liked.has(s.id) ? '<3' : '</3'}</button>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  )
}
