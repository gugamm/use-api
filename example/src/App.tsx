import React, { FormEvent, useCallback, useState } from 'react'
import { useApi } from '@gugamm/use-api'
import * as api from './api'

const App = () => {
  const [user, setUser] = useState('')
  const [getRepositoriesState, getRepositories] = useApi(api.getRepositories)

  const fetchRepositories = useCallback((user: string) => {
    getRepositories(user)
  }, [getRepositories])

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()
    fetchRepositories(user)
  }, [user])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>User:</label>
        <input type='text' value={user} onChange={e => setUser(e.target.value)} />
        <button type='submit' disabled={getRepositoriesState.loading}>Search</button>
      </form>
      <div>
        {!getRepositoriesState.called && 'Click search to fetch a list'}
        {getRepositoriesState.loading && 'Loading'}
        {getRepositoriesState.called && !getRepositoriesState.loading && getRepositoriesState.ok && getRepositoriesState.data.map(repos => <div key={repos.id}>{repos.name}</div>)}
        {getRepositoriesState.called && !getRepositoriesState.loading && !getRepositoriesState.ok && 'Error fetching the list...'}
      </div>
    </div>
  )
}

export default App
