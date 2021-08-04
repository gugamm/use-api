import React, { useState } from 'react'
import { FetchRepository } from './FetchRepository'

const App = () => {
  const [isMounted, setIsMounted] = useState(false)

  return (
    <>
      <button onClick={() => setIsMounted(!isMounted)}>toggle - {isMounted ? 'mounted' : 'not mounted'}</button>
      {isMounted && (
        <div>
          <FetchRepository />
        </div>
      )}
    </>
  )
}

export default App
