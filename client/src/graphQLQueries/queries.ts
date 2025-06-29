import { gql } from "@apollo/client";

const chatterInfo = gql`
  fragment ChatterInfo on Chatter{
    id
    username
    displayName
    status
  }
`

export const GetAllMessages = gql`
  query($count:Int!,$chatId:String!){
    getMessages(filter:{count:$count,chatId:$chatId}){
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

export const getAllChats = gql`
  query{
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