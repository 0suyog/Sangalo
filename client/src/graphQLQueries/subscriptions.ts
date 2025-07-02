import { gql, type TypedDocumentNode } from "@apollo/client";
import type { MessageSubscriptionType } from "../types/messageTypes";

export const SubscribeToMessage: TypedDocumentNode<MessageSubscriptionType> = gql`
  subscription OnMessageReceived {
    message{
        chatId
        message
        sender
        receiver
        id
        sentTime
        reactions{
          chatter
          reaction
        }
    }
  }
`