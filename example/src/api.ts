import { ApiResult, FetcherResult } from '@gugamm/use-api'

const delay = async (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const repositories: Repository[] = [
  { id: '0', name: 'a', full_name: 'a' },
  { id: '1', name: 'b', full_name: 'b' },
  { id: '2', name: 'c', full_name: 'c' },
  { id: '3', name: 'd', full_name: 'd' }
]

export interface Repository {
  id: string,
  name: string,
  full_name: string
}
export interface GetRepositoriesError {
  message: string,
  value: number,
  test: string
}
export const getRepositories = async (): Promise<FetcherResult<Repository[], GetRepositoriesError>> => {
  const random = Math.floor(Math.random() * 10)
  await delay(2000)

  if (random > 5) {
    return ApiResult.error({
      message: 'Test',
      value: random,
      test: 'hello'
    })
  }

  return ApiResult.success(repositories)
}
