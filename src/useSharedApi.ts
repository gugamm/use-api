import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Fetcher, OperationState, OperationTrigger, InitialOperationState, LoadingOperationState, ErrorOperationState, SuccessOperationState } from './types'
import { ExtractPromiseType } from './utilTypes'
import { sharedStore } from './sharedStore'

const INITIAL_OPERATION_STATE: InitialOperationState = {
  called: false,
  data: null,
  loading: false,
  ok: false
}

const LOADING_STATE: LoadingOperationState = {
  called: true,
  data: null,
  loading: true,
  ok: false
}

const errorState = <TData>(errorData: TData): ErrorOperationState<TData> => {
  return {
    called: true,
    data: errorData,
    loading: false,
    ok: false
  }
}

const successState = <TData>(data: TData): SuccessOperationState<TData> => {
  return {
    called: true,
    data: data,
    loading: false,
    ok: true
  }
}

export type ClearStateFn = () => void
export type UseSharedApiResult<TArgs extends Array<any>, TData> = [OperationState<TData>, OperationTrigger<TArgs, TData>, ClearStateFn]
export const useSharedApi = <TFetcher extends Fetcher<any>>(fetcher: TFetcher, storeKey: string): UseSharedApiResult<Parameters<TFetcher>, ExtractPromiseType<ReturnType<TFetcher>>> => {
  const initialState = useMemo(() => {
    return sharedStore.getState(storeKey) || INITIAL_OPERATION_STATE
  }, [storeKey])
  const [operationState, setOperationState] = useState<OperationState<ExtractPromiseType<ReturnType<TFetcher>>>>(initialState)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [isMountedRef])

  const handleStateUpdate = useCallback((newState: any) => {
    if (isMountedRef.current) {
      setOperationState(newState)
    }
  }, [setOperationState, isMountedRef])

  const clearSharedState = useCallback(() => {
    sharedStore.publish(storeKey, INITIAL_OPERATION_STATE)
  }, [storeKey])

  useEffect(() => {
    const unsubscribe = sharedStore.subscribe(storeKey, handleStateUpdate, initialState)

    return () => {
      unsubscribe()
    }
  }, [handleStateUpdate, storeKey, initialState])

  const operationTrigger = useCallback(async (...args: Parameters<TFetcher>) => {
    sharedStore.publish(storeKey, LOADING_STATE)

    try {
      const data = await fetcher(...args)
      sharedStore.publish(storeKey, successState(data))
      return successState(data)
    } catch (err) {
      sharedStore.publish(storeKey, errorState(err))
      return errorState(err)
    }
  }, [fetcher, storeKey])

  return [operationState, operationTrigger, clearSharedState]
}
