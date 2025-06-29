import type { ReceivedPopoulatedChatterType } from "../types/ApiChatterTypes"
import type { ChatterReducerAction, ChatterReducerInitialType } from "../types/ChatterReducerTypes"

export const chatterReducerInitialState: ChatterReducerInitialType = null

export const chatterDetailsReducer = (state: ChatterReducerInitialType, action: ChatterReducerAction): ChatterReducerInitialType => {
  switch (action.type) {
    case "ADD":
      return { ...action.payload } as ReceivedPopoulatedChatterType
    case "ADDFRIEND":
      if (!state) {
        return null
      }
      return { ...state, friends: [...state.friends, action.payload] } as ReceivedPopoulatedChatterType
    case "REMOVEFRIEND":
      if (!state) {
        return null
      }
      return { ...state, friends: state.friends.filter(friend => friend.id !== action.payload) }
    default:
      return { ...state } as ChatterReducerInitialType
  }
}
