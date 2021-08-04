import { FetcherResult, FetchResultType } from './types'

export const ApiResult = Object.freeze({
  success: <T, E>(data: T): FetcherResult<T, E> => ({ type: FetchResultType.SUCCESS, data }),
  error: <T, E>(err: E): FetcherResult<T, E> => ({ type: FetchResultType.ERROR, error: err })
})
