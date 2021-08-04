import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Fetcher, OperationState, OperationTrigger, InitialOperationState, LoadingOperationState, ErrorOperationState, SuccessOperationState, FetchResultType } from './types'
import { ExtractResultsFromFetcher } from './utilTypes'
import { sharedStore } from './sharedStore'

const INITIAL_OPERATION_STATE: InitialOperationState = {
  called: false,
  data: null,
  loading: false,
  ok: false,
  error: null
}

const LOADING_STATE: LoadingOperationState = {
  called: true,
  data: null,
  loading: true,
  ok: false,
  error: null
}

const errorState = <TError>(errorData: TError): ErrorOperationState<TError> => {
  return {
    called: true,
    data: null,
    loading: false,
    ok: false,
    error: errorData
  }
}

const successState = <TData>(data: TData): SuccessOperationState<TData> => {
  return {
    called: true,
    data,
    loading: false,
    ok: true,
    error: null
  }
}

export type ClearStateFn = () => void
export type UseSharedApiResult<TArgs extends Array<any>, TSuccessData, TErrorData> = [OperationState<TSuccessData, TErrorData>, OperationTrigger<TArgs, TSuccessData, TErrorData>, ClearStateFn]
export const useSharedApi = <TFetcher extends Fetcher<any, any>>(fetcher: TFetcher, storeKey: string): UseSharedApiResult<Parameters<TFetcher>, ExtractResultsFromFetcher<TFetcher>[0], ExtractResultsFromFetcher<TFetcher>[1]> => {
  const initialState = useMemo(() => {
    return sharedStore.getState(storeKey) || INITIAL_OPERATION_STATE
  }, [storeKey])
  const [operationState, setOperationState] = useState<OperationState<ExtractResultsFromFetcher<TFetcher>[0], ExtractResultsFromFetcher<TFetcher>[1]>>(initialState)
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

    const result = await fetcher(...args)

    if (result.type === FetchResultType.SUCCESS) {
      sharedStore.publish(storeKey, successState(result.data))
      return successState(result.data)
    }

    sharedStore.publish(storeKey, errorState(result.error))
    return errorState(result.error)
  }, [fetcher, storeKey])

  return [operationState, operationTrigger, clearSharedState]
}
