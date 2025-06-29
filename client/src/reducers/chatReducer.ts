import type { ReceivedChatType } from "../types/ApiChatTypes"
import type { ChatReducerAction } from "../types/ChatReducerTypes"

export const chatsInitialState: ReceivedChatType[] = []
export const chatsReducer = (state: ReceivedChatType[], action: ChatReducerAction) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    default:
      return state
  }
}
