import Chat from "../models/chat.model";
import { MongoID } from "../types";

const canSendMessage = async (ids: MongoID[], chatId: MongoID): Promise<Boolean> => {
  let authorized = await Chat.exists({ _id: chatId, participants: { $all: ids } })
  return Boolean(authorized)
}
const messagingAuthorization = { canSendMessage }
export default messagingAuthorization