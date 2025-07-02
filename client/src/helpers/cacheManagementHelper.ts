import type { ApolloCache } from "@apollo/client";
import { getAllChats, GetAllMessages } from "../graphQLQueries/queries";
import type { MessageFilterType, ReceivedMessageType } from "../types/messageTypes"
import type { ReceivedChatType } from "../types/ApiChatTypes";

const bumpChatToTop = (chats: ReceivedChatType[], latestMessage: ReceivedMessageType): ReceivedChatType[] => {
  const index = chats.findIndex((chat) => {
    return chat.id === latestMessage.chatId
  })
  if (index > -1) {
    const scopedChat = [...chats]
    const removedChat = scopedChat.splice(index, 1)
    return [{ ...removedChat[0], latestMessage: { ...latestMessage, reactions: [] } }, ...scopedChat]
  }
  return [...chats]
}



export const addNewMessageToCache = (caches: ApolloCache<unknown>, variables: MessageFilterType, newMessage: ReceivedMessageType) => {
  caches.updateQuery(
    {
      query: GetAllMessages,
      variables: { chatId: newMessage.chatId, count: 10 },
    },
    (existingData) => {
      if (!existingData)
        return {
          getMessages: [newMessage],
        };
      return {
        getMessages: [newMessage, ...existingData.getMessages],
      };
    }
  );
}

export const addNewChatToCache = (caches: ApolloCache<unknown>, newChat: ReceivedChatType) => {
  caches.updateQuery({
    query: getAllChats
  }, (existingData) => {
    if (!existingData) {
      return {
        getChats: [newChat]
      }
    }
    return { getChats: [newChat, ...existingData.getChats,] }
  })
}

export const updateChatOrderInCache = (caches: ApolloCache<unknown>, ReceivedMessage: ReceivedMessageType) => {
  caches.updateQuery({ query: getAllChats }, (existingData) => {
    if (!existingData) {
      return {
        getChats: []
      }
    }
    const updatedChat = bumpChatToTop(existingData.getChats, ReceivedMessage);
    console.log(updatedChat)
    return { getChats: updatedChat }
  })
}