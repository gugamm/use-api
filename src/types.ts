export type InitialOperationState = {
  called: false,
  ok: false,
  data: null,
  loading: false
}

export type LoadingOperationState = {
  called: true,
  ok: false,
  data: null,
  loading: true
}

export type SuccessOperationState<TData> = {
  called: true,
  ok: true,
  data: TData,
  loading: false
}

export type ErrorOperationState<TData> = {
  called: true,
  ok: false,
  data: TData,
  loading: false
}

export type OperationState<TData> = InitialOperationState | LoadingOperationState | SuccessOperationState<TData> | ErrorOperationState<TData>
export type OperationTrigger<TArgs extends Array<any>, TData> = (...args: TArgs) => Promise<SuccessOperationState<TData> | ErrorOperationState<TData>>
export type Fetcher<TData> = (...args: any[]) => Promise<TData>
