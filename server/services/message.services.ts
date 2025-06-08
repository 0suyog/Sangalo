import { MessageType, NewMessageType } from "../messageTypes";
import Message from "../models/message.model";

const addMessage = (message: NewMessageType): MessageType => {
  const newMessage = new Message(message);
  newMessage.save()
  return newMessage.toJSON<MessageType>()
}


const messageServices = {
  addMessage
}

export default messageServices