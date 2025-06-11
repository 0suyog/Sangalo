export const firstMessageMutation = (message: string, receiver: string) => {
  const mutation = `
    mutation ($receiver:String!,$message:String!){
      firstMessage(message:{receiver:$receiver,message:$message}){
        chat{
          id
          participants
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