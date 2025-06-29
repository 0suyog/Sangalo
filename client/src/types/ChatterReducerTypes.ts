import type { ReceivedChatterType, ReceivedPopoulatedChatterType } from "./ApiChatterTypes"

export type ChatterReducerActionTypes = "ADD" | "REMOVE" | "ADDFRIEND"

export type ChatterReducerInitialType = ReceivedPopoulatedChatterType | null

export type ChatterReducerAction = {
  type: "ADD"
  payload: ReceivedPopoulatedChatterType
} | { type: "ADDFRIEND", payload: ReceivedChatterType } | { type: "REMOVEFRIEND", payload: string }
