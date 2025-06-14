import Chat from "../models/chat.model";
import type { MongoID } from "../types";

const canSendMessage = async (ids: MongoID[], chatId: MongoID): Promise<boolean> => {
  let authorized = await Chat.exists({ _id: chatId, participants: { $all: ids } })
  return Boolean(authorized)
}
const messagingAuthorization = { canSendMessage }
export default messagingAuthorization