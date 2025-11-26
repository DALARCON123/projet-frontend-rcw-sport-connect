import { sportsClient } from './apiClient'

export async function listSports() {
  return sportsClient.get<Array<{id:string; name:string; level:string}>>('/sports')
}

export async function searchSports(q: string) {
  return sportsClient.get<Array<{id:string; name:string; level:string}>>(`/sports/search?q=${encodeURIComponent(q)}`)
}
