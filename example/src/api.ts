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
export const getRepositories = async (): Promise<Repository[]> => {
  await delay(2000)
  return repositories
}
