# use-api

use-api is a set of simple React.JS hooks that helps managing state for api requests. It comes with only two hooks: "useApi" and "useSharedApi".

## Installation

```sh
npm install --save @gugamm/use-api
```

## Typescript

This library was built with TS. No need to install type descriptions.

## Example

```tsx
import * as React from 'react'
import { useApi } from '@gugamm/use-api'

const myRequest = async (a: number, b: number) => Promise<number> => {
    const request = await fetch(`https://yourapi.com/sum`, {
        method: 'POST',
        body: JSON.stringify({ a, b })
    })
    const parsedResponse = await request.json()
    return parsedResponse
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
        return <div>Error: {state.data}</div>
    }

    return <div>Result: {state.data}</div>
}
```

## License

MIT
