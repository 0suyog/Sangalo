import { gql, type TypedDocumentNode } from "@apollo/client";
import type { FirstMessageType, MessageFilterType, ReceivedFirstMessageType, ReceivedMessageType } from "../types/messageTypes";

export const FirstMessage: TypedDocumentNode<ReceivedFirstMessageType, FirstMessageType> = gql`
  mutation FirstMessage($message:String!, $receiver:String!){
    firstMessage(message:{message:$message,receiver:$receiver}){
      chat{
        id
        participants{
          id
          username
          displayName
          status
        }
          latestMessage{
        message
        sender
        receiver
        id
        sentTime
          }
      }
    }
  }
`

export const SendMessage: TypedDocumentNode<ReceivedMessageType, MessageFilterType> = gql`
  mutation SendMessage($message:String!,$chatId:String!){
    message(message:{message:$message,chatId:$chatId}){
      chatId
      sender
      receiver
      message
      sentTime
      id
    }
  }
`

