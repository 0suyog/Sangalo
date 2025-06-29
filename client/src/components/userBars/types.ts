import type { MouseEventHandler, ReactNode } from "react"
import type { ReceivedChatterType } from "../../types/ApiChatterTypes"

export type UserBarVariants = "messageList" | 'friendRequest' | 'acceptRequest' | 'search'

export interface BaseProps {
  chatter: ReceivedChatterType
}

export interface UserBarProps extends BaseProps {
  type: "button",
  onClick: MouseEventHandler<HTMLButtonElement>
  buttonIcon?: ReactNode
}