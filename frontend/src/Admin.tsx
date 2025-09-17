import React from 'react'

type Story = {
  id: number
  name: string
  story: string
  created_at: string
  likes?: number
}

export default function Admin(props: {
  stories: Story[]
  adminSecret: string | null
  setAdminSecret: (v: string | null) => void
  onTrySecret: (e: React.FormEvent) => void
  onDelete: (id: number) => void
  onLike?: (id: number) => Promise<void>
}) {
  const { stories, adminSecret, setAdminSecret, onTrySecret, onDelete } = props
  return (
    <section className="admin-section">
      <h2>Admin</h2>
      <form onSubmit={onTrySecret}>
        <label>
          Secret
          <input value={adminSecret ?? ''} onChange={(e) => setAdminSecret(e.target.value)} placeholder="secret" />
        </label>
        <div className="actions">
          <button type="submit">Enter</button>
        </div>
      </form>
      <p className="muted">If secret is valid you'll see delete buttons next to stories.</p>

      <section className="list-section">
        {stories.length === 0 ? (
          <p className="muted">No stories.</p>
        ) : (
          stories.map(s => (
            <article className="story" key={s.id}>
              <div className="meta">
                <strong className="name">{s.name}</strong>
                <time>{new Date(s.created_at).toLocaleString()}</time>
              </div>
              <p className="content">{s.story}</p>
              <div className="meta below">
                <span className="likes">❤️ {s.likes ?? 0}</span>
                {adminSecret && (
                  <div className="actions">
                    <button onClick={() => onDelete(s.id)}>Delete</button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </section >
  )
}
