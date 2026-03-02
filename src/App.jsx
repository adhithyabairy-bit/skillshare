import React, { useEffect, useState } from 'react'
import { supabase, hasValidCredentials } from './lib/supabase'

const MOCK_PROJECTS = [
  { id: 1, title: 'Learn React Basics' },
  { id: 2, title: 'Build a Chat App' },
  { id: 3, title: 'Master Node.js' },
]

export default function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingMock, setIsUsingMock] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!hasValidCredentials) {
        console.warn('Using mock data – replace placeholder credentials in .env to fetch real data')
        if (mounted) {
          setProjects(MOCK_PROJECTS)
          setIsUsingMock(true)
          setLoading(false)
        }
        return
      }

      try {
        console.log('Fetching projects from Supabase...')
        const { data, error: err } = await supabase.from('projects').select('*').limit(10)
        if (err) {
          console.error('Supabase error:', err)
          if (mounted) setError(err.message)
          return
        }
        console.log('Projects fetched:', data)
        if (mounted) setProjects(data || [])
      } catch (err) {
        console.error('Fetch error:', err)
        if (mounted) setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main style={{padding:20,fontFamily:'system-ui, sans-serif', minHeight:'100vh'}}>
      <h1>Skillshare</h1>
      {isUsingMock && <p style={{backgroundColor:'#fff3cd', padding:'10px', borderRadius:'4px'}}>📌 Using mock data. Add real Supabase credentials to .env</p>}
      {loading && <p>Loading projects...</p>}
      {error && <p style={{color:'red'}}>❌ Error: {error}</p>}
      {!loading && !error && projects.length > 0 && (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>{p.title || p.name || `#${p.id}`}</li>
          ))}
        </ul>
      )}
      {!loading && !error && projects.length === 0 && !isUsingMock && (
        <p>No projects found. Create a `projects` table in Supabase with `id` and `title` columns.</p>
      )}
    </main>
  )
}
