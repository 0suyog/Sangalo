import type { TokenType } from "../types/ApiChatterTypes"
import type { TokenActionType } from "../types/TokenReducerTypes"

export const initialTokenState: TokenType = { token: localStorage.getItem("token") || "" }
export const tokenReducer = (state: TokenType, action: TokenActionType): TokenType => {
  console.log(action)
  switch (action.type) {
    case "SET":
      return { ...action.payload }
    case "REMOVE":
      return { token: "" }
    case "CHECK":
      {
        return { token: localStorage.getItem("token") as string }
      }
    default:
      return { ...state }
  }
}