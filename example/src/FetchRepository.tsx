import * as React from 'react'
import { useApi } from '@gugamm/use-api'
import * as api from './api'

export const FetchRepository: React.FC = () => {
  const [getReposState, getRepos] = useApi(api.getRepositories)

  React.useEffect(() => {
    (async () => {
      const result = await getRepos()
      if (result.ok) {
        console.log(result.data)
      } else {
        console.log(result.error)
      }
    })()
  }, [getRepos])

  if (!getReposState.called || getReposState.loading) {
    return (
      <div>
        <pre>
          {JSON.stringify({...getReposState, data: null }, null, 2)}
        </pre>
        <hr />
      </div>
    )
  }

  if (!getReposState.ok) {
    return (
      <div>
        <h2>Error</h2>
        <pre>
          {JSON.stringify(getReposState.error)}
        </pre>
      </div>
    )
  }

  // const repos = getReposState.data.map(repo => <div key={repo}>{repo}</div>)

  return (
    <div>
      <h2>Success</h2>
      <pre>
        {JSON.stringify({...getReposState, data: null }, null, 2)}
      </pre>
      <hr />
    </div>
  )
}
