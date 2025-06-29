import { useContext } from "react"
import UserContext from "../components/UserContextProvider"
import TokenContext from "../components/TokenContextProvider"

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("User context should be only used within the providers scope")
  }
  return context
}

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("Token context should be only used within the providers scope")
  }
  return context
}