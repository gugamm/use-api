import { useState, useCallback } from 'react'
import { Fetcher, OperationState, OperationTrigger, InitialOperationState, LoadingOperationState, ErrorOperationState, SuccessOperationState } from './types'
import { ExtractPromiseType } from './utilTypes'

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
export const useApi = <TFetcher extends Fetcher<any>>(fetcher: TFetcher): UseApiResult<Parameters<TFetcher>, ExtractPromiseType<ReturnType<TFetcher>>> => {
  const [operationState, setOperationState] = useState<OperationState<ExtractPromiseType<ReturnType<TFetcher>>>>(INITIAL_OPERATION_STATE)
  const operationTrigger = useCallback(async (...args: Parameters<TFetcher>) => {
    setOperationState(LOADING_STATE)

    try {
      const data = await fetcher(...args)
      setOperationState(successState(data))
      return successState(data)
    } catch (err) {
      setOperationState(errorState(err))
      return errorState(err)
    }
  }, [fetcher])

  return [operationState, operationTrigger]
}