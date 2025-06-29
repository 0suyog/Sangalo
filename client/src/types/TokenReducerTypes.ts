import type { TokenType } from "./ApiChatterTypes";

export type TokenActionType = { type: "SET", payload: TokenType } | { type: "REMOVE" | "CHECK" }
