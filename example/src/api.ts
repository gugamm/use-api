export interface Repository {
  id: string,
  name: string,
  full_name: string
}
export const getRepositories = async (user: string): Promise<Repository[]> => {
  const response = await fetch(`https://api.github.com/users/${user}/repos`)
  const parsedResponse = await response.json()
  return parsedResponse
}
