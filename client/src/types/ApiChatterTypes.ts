export interface LoginRequestType {
  username: string,
  password: string,
}

export interface TokenType {
  token: string
}

export interface NewChatterType extends LoginRequestType {
  displayName: string,
  email?: string
}

export type ChatterStatusType = "online" | "offline" | "idle" | "dnd";

export interface ReceivedChatterType extends Omit<NewChatterType, "password"> {
  id: string,
  status: ChatterStatusType
}

export interface ReceivedPopoulatedChatterType extends ReceivedChatterType {
  friends: ReceivedChatterType[]
}

export interface SearchRequestType {
  displayName: string
}
