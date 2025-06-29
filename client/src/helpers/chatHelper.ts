import type { ReceivedChatterType } from "../types/ApiChatterTypes";
import type { ReceivedChatType } from "../types/ApiChatTypes";
import type { ChatListType } from "../types/ChatListTypes";

export const addFriendsWhoHaventBeenTextedYetInChatList = (friendList: ReceivedChatterType[], chatList: ReceivedChatType[]): ChatListType[] => {
  const chats: ChatListType[] = chatList.map((chat) => {
    const pictures = chat.participants.map((chatter) => {
      return `https://robohash.org/${chatter.username}`
    })
    return {
      type: "chat",
      ...chat,
      pictures: pictures
    }
  })
  friendList.forEach(friend => {
    if (!chatList.some(chat => chat.participants.some(chatter => chatter.id === friend.id))) {
      const { email, ...data } = friend;
      chats.push(
        {
          type: 'friend',
          chatStatus: 'read',
          ...data
        }

      )
    }
  })
  return chats
}