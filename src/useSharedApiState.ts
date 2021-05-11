import { useState, useEffect, useCallback } from 'react'
import { sharedStore } from './sharedStore'
import { InitialOperationState, OperationState } from './types'

const INITIAL_OPERATION_STATE: InitialOperationState = {
  called: false,
  data: null,
  loading: false,
  ok: false
}

export const useSharedApiState = <TData>(storeKey: string): OperationState<TData> => {
  const [operationState, setOperationState] = useState<OperationState<TData>>(sharedStore.getState(storeKey) || INITIAL_OPERATION_STATE)

  const handleStateChange = useCallback((newState: any) => {
    setOperationState(newState)
  }, [setOperationState])

  useEffect(() => {
    const unsubscribe = sharedStore.subscribe(storeKey, handleStateChange, INITIAL_OPERATION_STATE)
    return () => {
      unsubscribe()
    }
  }, [handleStateChange])

  return operationState
}
