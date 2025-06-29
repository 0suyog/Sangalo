import { gql } from "@apollo/client";

export const FirstMessage = gql`
  mutation($message:String!, $receiver:String!){
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

