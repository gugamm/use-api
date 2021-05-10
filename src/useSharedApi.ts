import { useState, useCallback, useEffect } from 'react'
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

export type UseApiResult<TArgs extends Array<any>, TData> = [OperationState<TData>, OperationTrigger<TArgs, TData>]
export const useSharedApi = <TFetcher extends Fetcher<any>>(fetcher: TFetcher, storeKey: string): UseApiResult<Parameters<TFetcher>, ExtractPromiseType<ReturnType<TFetcher>>> => {
  const [operationState, setOperationState] = useState<OperationState<ExtractPromiseType<ReturnType<TFetcher>>>>(sharedStore.getState(storeKey) || INITIAL_OPERATION_STATE)

  const handleStateUpdate = useCallback((newState: any) => {
    setOperationState(newState)
  }, [setOperationState])

  useEffect(() => {
    const unsubscribe = sharedStore.subscribe(storeKey, handleStateUpdate, INITIAL_OPERATION_STATE)

    return () => {
      unsubscribe()
    }
  }, [handleStateUpdate, storeKey])

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

  return [operationState, operationTrigger]
}
