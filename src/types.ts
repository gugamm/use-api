export type InitialOperationState = {
  called: false,
  ok: false,
  data: null,
  loading: false,
  error: null
}

export type LoadingOperationState = {
  called: true,
  ok: false,
  data: null,
  loading: true,
  error: null
}

export type SuccessOperationState<TData> = {
  called: true,
  ok: true,
  data: TData,
  loading: false,
  error: null
}

export type ErrorOperationState<TError> = {
  called: true,
  ok: false,
  error: TError,
  data: null,
  loading: false
}

export type OperationState<TSuccessData, TErrorData> = InitialOperationState | LoadingOperationState | SuccessOperationState<TSuccessData> | ErrorOperationState<TErrorData>
export type OperationTrigger<TArgs extends Array<any>, TSuccessData, TErrorData> = (...args: TArgs) => Promise<SuccessOperationState<TSuccessData> | ErrorOperationState<TErrorData>>
export enum FetchResultType {
  SUCCESS = 'success',
  ERROR = 'error'
}
export type SuccessFetchResult<T> = { type: FetchResultType.SUCCESS, data: T }
export type ErrorFetchResult<T> = { type: FetchResultType.ERROR, error: T }
export type FetcherResult<TSuccess, TError> = SuccessFetchResult<TSuccess> | ErrorFetchResult<TError>
export type Fetcher<TSuccessData, TErrorData> = (...args: any[]) => Promise<FetcherResult<TSuccessData, TErrorData>>
