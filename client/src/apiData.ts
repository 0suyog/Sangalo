export const BASEURL = import.meta.env.VITE_API_URL
export let TOKEN = `Bearer `


export const setToken = (token: string) => {
  TOKEN = `Bearer ${token}`
}
