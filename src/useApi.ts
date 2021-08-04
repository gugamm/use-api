import { useState, useCallback, useRef, useEffect } from 'react'
import { Fetcher, OperationState, OperationTrigger, InitialOperationState, LoadingOperationState, ErrorOperationState, SuccessOperationState, FetchResultType } from './types'
import { ExtractResultsFromFetcher } from './utilTypes'

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
    data: data,
    loading: false,
    ok: true,
    error: null
  }
}

export type UseApiResult<TArgs extends Array<any>, TSuccessData, TErrorData> = [OperationState<TSuccessData, TErrorData>, OperationTrigger<TArgs, TSuccessData, TErrorData>]
export const useApi = <TFetcher extends Fetcher<any, any>>(fetcher: TFetcher): UseApiResult<Parameters<TFetcher>, ExtractResultsFromFetcher<TFetcher>[0], ExtractResultsFromFetcher<TFetcher>[1]> => {
  const [operationState, setOperationState] = useState<OperationState<ExtractResultsFromFetcher<TFetcher>[0], ExtractResultsFromFetcher<TFetcher>[1]>>(INITIAL_OPERATION_STATE)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [isMountedRef])

  const operationTrigger = useCallback(async (...args: Parameters<TFetcher>) => {
    if (isMountedRef.current) {
      setOperationState(LOADING_STATE)
    }

    const result = await fetcher(...args)

    if (result.type === FetchResultType.SUCCESS) {
      if (isMountedRef.current) {
        setOperationState(successState(result.data))
      }
      return successState(result.data)
    }

    if (isMountedRef.current) {
      setOperationState(errorState(result.error))
    }
    return errorState(result.error)
  }, [fetcher, isMountedRef])

  return [operationState, operationTrigger]
}
