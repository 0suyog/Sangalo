export const firstMessageMutation = (message: string, receiver: string) => {
  const mutation = `
    mutation ($receiver:String!,$message:String!){
      firstMessage(message:{receiver:$receiver,message:$message}){
        chat{
          id
          participants{
          id
          username
          displayName
          status
          }
          status
        }
        message
        sender
        receiver
        id
      }
    }
    `
  const variables = {
    message,
    receiver
  }
  return { query: mutation, variables }
}

export const messageMutation = (message: string, chatId: string) => {
  const mutation = `mutation($message:String!,$chatId:String!){
    message(message:{message:$message,chatId:$chatId}){
      chatId
      sender
      receiver
      reactions{
        chatter
        reaction
      }
      id
      message
    }
  }`

  const variables = {
    message: message,
    chatId: chatId
  }
  return { query: mutation, variables }
}

export const reactMessageMutation = (messageId: string, chatId: string, reaction: string) => {
  const mutation = `
    mutation($messageId:String!,$chatId:String!,$reaction:Reactions!){
      messageReaction(details:{messageId:$messageId,chatId:$chatId,reaction:$reaction}){
        chatId
        sender
        receiver
        reactions{
        chatter
        reaction
        }
        id
        message
      }
    }
  `
  const variables = { messageId, chatId, reaction }
  return { query: mutation, variables }
}

export const chatStatusUpdateMutation = (chatId: string, status: string) => {
  const mutation = `
    mutation($chatId:String!,$status:ChatStatus!){
      chatStatusUpdate(details:{ status:$status,chatId:$chatId }){
        id
        participants{
          id
          username
          displayName
          status
        }
        name
        isGroup
        latestMessage{
          id
          sender
          receiver
          chatId
        }
        status
      }
    }
  `
  const variables = { chatId, status }
  return { query: mutation, variables }
}