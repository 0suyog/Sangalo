import type { ReceivedChatType } from "./ApiChatTypes";

export type ChatReducerAction = { type: "SET", payload: ReceivedChatType[] }