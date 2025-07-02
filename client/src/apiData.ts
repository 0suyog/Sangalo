export const BASEURL = import.meta.env.VITE_API_URL
export let TOKEN = `Bearer ${localStorage.getItem("token")}`

export const setToken = (token: string) => {
  TOKEN = `Bearer ${token}`
}

export const getToken = () => TOKEN
