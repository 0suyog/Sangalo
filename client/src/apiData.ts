export const BASEURL = import.meta.env.VITE_API_URL
console.log(BASEURL)
export let TOKEN = `Bearer `

export const setToken = (token: string) => {
  TOKEN = `Bearer ${token}`
}