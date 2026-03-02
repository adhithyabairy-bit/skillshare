import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data, error } = await supabase.from('projects').select('*').limit(10)
        if (error) throw error
        if (mounted) setProjects(data || [])
      } catch (err) {
        console.error('Supabase error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main style={{padding:20,fontFamily:'system-ui, sans-serif'}}>
      <h1>Skillshare</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length ? (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>{p.title || p.name || `#${p.id}`}</li>
          ))}
        </ul>
      ) : (
        <p>No projects found. Ensure your `projects` table exists or set env vars.</p>
      )}
    </main>
  )
}
