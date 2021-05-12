import * as React from 'react'
import { useSharedApi, Fetcher, OperationState } from '@gugamm/use-api'
import * as api from './api'

const sharedOperations: any = {}

const useSharedApiResource: typeof useSharedApi = (fetcher: Fetcher<any>, key: string) => {
  const [state, makeRequest, clearState] = useSharedApi(fetcher, key)

  const connectedRequest: typeof makeRequest = React.useCallback(async (...args: any[]) => {
    if (sharedOperations[key]) {
      return sharedOperations[key]
    }

    sharedOperations[key] = makeRequest(...args)
    sharedOperations[key].then((state: OperationState<any>) => {
      delete sharedOperations[key]
      return state
    })

    return sharedOperations[key]
  }, [makeRequest, key])

  return [state, connectedRequest, clearState]
}

export const FetchRepository: React.FC = () => {
  const [getReposState, getRepos, clearState] = useSharedApiResource(api.getRepositories, 'repos')

  React.useEffect(() => {
    getRepos()
  }, [getRepos])

  React.useEffect(() => {
    return () => {
      clearState()
    }
  }, [clearState])

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
    return <div>Error...</div>
  }

  // const repos = getReposState.data.map(repo => <div key={repo}>{repo}</div>)

  return (
    <div>
      <pre>
        {JSON.stringify({...getReposState, data: null }, null, 2)}
      </pre>
      <hr />
    </div>
  )
}
