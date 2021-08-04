# use-api

use-api is a set of simple React.JS hooks that helps managing state for api requests.

## Installation

```sh
npm install --save @gugamm/use-api
```

## Typescript

This library was built with TS. No need to install type descriptions.

## useApi example

`useApi` is a hook that manage the request state locally.

```tsx
import * as React from 'react'
import { useApi, FetcherResult, ApiResult } from '@gugamm/use-api'

type MyRequestSuccess = number
type MyRequestError = { message: string }
const myRequest = async (a: number, b: number) => Promise<FetcherResult<MyRequestSuccess, MyRequestError>> => {
    const request = await fetch(`https://yourapi.com/sum`, {
        method: 'POST',
        body: JSON.stringify({ a, b })
    })

    const parsedResponse = await request.json()

    if (request.ok) {
        return ApiResult.success(parsedResponse)
    }

    return ApiResult.error({ message: parsedResponse.errorMessage })
}

const App: React.FC = () => {
    const [state, request] = useApi(myRequest)

    React.useEffect(() => {
      request(10, 20)
    }, [])

    if (!state.called || state.loading) {
        return <div>Loading...</div>
    }

    if (!state.ok) {
        return <div>Error: {state.error}</div>
    }

    return <div>Result: {state.data}</div>
}
```

## useSharedApi and useSharedApiState example

`useSharedApi` is a hook that manage the request state at a shared store that the lib manage internally. By using the same `key` parameter, multiple components can access this shared state.

You can also consider using the `useSharedApiState`. This hook will only watch for changes at the request state. You should use this hook if your component will not be the one triggering the request.

```tsx
import * as React from 'react'
import { useSharedApiState, useSharedApi, FetcherResult, ApiResult } from '@gugamm/use-api'

type MyRequestSuccess = number
type MyRequestError = { message: string }
const myRequest = async (a: number, b: number) => Promise<FetcherResult<MyRequestSuccess, MyRequestError>> => {
    const request = await fetch(`https://yourapi.com/sum`, {
        method: 'POST',
        body: JSON.stringify({ a, b })
    })

    const parsedResponse = await request.json()

    if (request.ok) {
        return ApiResult.success(parsedResponse)
    }

    return ApiResult.error({ message: parsedResponse.errorMessage })
}

const ResultComponent: React.FC = () => {
    const state = useSharedApiState('example')

    if (!state.called || state.loading) {
        return <div>Loading...</div>
    }

    if (!state.ok) {
        return <div>Error: {state.error}</div>
    }

    return <div>Result: {state.data}</div>
}

const App: React.FC = () => {
    const [state, request] = useSharedApi(myRequest, 'example')

    React.useEffect(() => {
      request(10, 20)
    }, [])

    return <ResultComponent />
}
```

## Enhanced shared api hook recipe

`useSharedApi` does not handle cases where you might trigger multiple requests for the same key in parallel. Usually you should have one "shared request" being processed by time. You should avoid this in your application. If you want a hook to avoid having multiple shared requests happening at same time automatically, you can create your own hook. Here is an example:

```tsx
import * as React from 'react'
import { useSharedApi, Fetcher } from '@gugamm/use-api'

const sharedOperations: any = {}

const useEnhancedSharedApi: typeof useSharedApi = (fetcher: Fetcher<any, any>, key: string) => {
  const [state, makeRequest, clearState] = useSharedApi(fetcher, key)

  const connectedRequest: typeof makeRequest = React.useCallback(async (...args: any[]) => {
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
```

## License

MIT
