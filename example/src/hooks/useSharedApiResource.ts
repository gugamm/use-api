import { useSharedApi, Fetcher, OperationState } from '@gugamm/use-api'
import { useCallback } from 'react'

const sharedOperations: any = {}

export const useSharedApiResource: typeof useSharedApi = (fetcher: Fetcher<any, any>, key: string) => {
  const [state, makeRequest, clearState] = useSharedApi(fetcher, key)

  const connectedRequest: typeof makeRequest = useCallback(async (...args: any[]) => {
    if (sharedOperations[key]) {
      return sharedOperations[key]
    }

    sharedOperations[key] = makeRequest(...args)
    sharedOperations[key].then((state: OperationState<any, any>) => {
      delete sharedOperations[key]
      return state
    })

    return sharedOperations[key]
  }, [makeRequest, key])

  return [state, connectedRequest, clearState]
}
