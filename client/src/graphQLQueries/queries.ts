import { gql, type TypedDocumentNode } from "@apollo/client";
import type { GetAllMessagesQueryType, MessageFilterType } from "../types/messageTypes";
import type { AllChatsQuery } from "../types/ApiChatTypes";

const chatterInfo = gql`
  fragment ChatterInfo on Chatter{
    id
    username
    displayName
    status
  }
`

export const GetAllMessages: TypedDocumentNode<GetAllMessagesQueryType, MessageFilterType> = gql`
  query GetAllMessages($count:Int!,$chatId:String!,$earliest:Date){
    getMessages(filter:{count:$count,chatId:$chatId,earliest:$earliest}){
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

export const getAllChats: TypedDocumentNode<AllChatsQuery> = gql`
  query GetAllChats{
    getChats{
      id
      name
      isGroup
      status
      latestMessage{
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
        participants{
         ...ChatterInfo
        }
    }
  }
    ${chatterInfo}
`