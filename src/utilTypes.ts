import { Fetcher } from './types'

export type ExtractResultsFromFetcher<T> = T extends Fetcher<infer TSuccess, infer TError> ? [TSuccess, TError] : never
