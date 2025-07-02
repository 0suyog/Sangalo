import { GraphQlDate } from "../graphql/scalarTypes";
import { FirstMessageSchema, MessageFilterSchema, MessageReactedSchema, NewMessageSchema } from "../typeValidators/messageValidator";
import messageServices from "../services/message.services";
import { gqErrorHandler } from "../utils/graphQlErrorHandler";
import type { FirstMessageReturnType, MessageReturnType } from "../messageTypes";
import type { ChatterType } from "../chatterTypes";
import type { ChatReturnType } from "chatTypes";
import { ChatStatusUpdateSchema, NewChatSchema } from "typeValidators/chatValidator";
import chatServices from "services/chat.services";
import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub()

const events = {
  MESSAGE: 'new_message',
  FIRST_MESSAGE: 'first_message',
  GROUP_CREATED: "group_created",
  MESSAGE_REACTED: "message_reacted",
  CHAT_STATUS: "chat_status"
}

export const typeDefs = `
  scalar Date

  enum Reactions{
    like
    love
    sad
    laugh
    cry
  }

  enum ChatterStatus{
    online
    offline
    idle
    dnd
  }
  
  enum ChatStatus{
    sent
    delivered
    read
  }

  
  type Reaction{
    chatter:String!
    reaction:Reactions
  }

  input NewChat{
    participants:[String!]!
    name:String!
  }
  

  type Chatter{
    id:String!
    username:String!
    displayName:String!
    status:ChatterStatus!
  }

  input NewMessage{
    chatId:String!
    message:String!
  }
  input FirstMessage{
    message:String!
    receiver:String!
  }
  
  type FirstMessageReturn{
    chat:Chat!
    message:String!
    sender:String!
    receiver:String!
    id:String!
    sentTime:Date!
  }

  type Message{
    chatId:String!
    message:String!
    sender:String!
    receiver:String!
    id:String!
    sentTime:Date!
    reactions:[Reaction!]!
  }

  input MessageFilter{
    earliest:Date
    count:Int!
    chatId:String!
  }

  type Chat{
    id:String!
    participants:[Chatter!]!
    name:String
    isGroup:Boolean
    latestMessage:Message
    status:ChatStatus
  }
  input MessageReacted{
    chatId:String!
    messageId:String!
    reaction:Reactions!
  }
  input ChatStatusUpdate{
    status:ChatStatus!
    chatId:String!
  }

  type Query{
    getMessages(filter:MessageFilter!):[Message!]!
    getChats:[Chat!]!
    
  }

  type Mutation{
    firstMessage(message:FirstMessage!):FirstMessageReturn!
    message(message:NewMessage!):Message!
    createGroup(groupDetails:NewChat!):Chat!
    messageReaction(details:MessageReacted!):Message!
    chatStatusUpdate(details:ChatStatusUpdate!):Chat!
  }

  type Subscription{
    message:Message!
    firstMessage:FirstMessageReturn!
    messageReaction:Message!
    chatStatusUpdate:Chat!
    newGroup:Chat!
  }
`;

export const resolvers = {
  Date: GraphQlDate,
  Query: {
    getMessages: async (_root: unknown, args: { filter: unknown }, context: ChatterType): Promise<MessageReturnType[]> => {
      try {
        const filter = MessageFilterSchema.parse(args.filter);
        let messages = await messageServices.getMessages(context.id, filter)
        return messages
      } catch (e) {
        throw gqErrorHandler(e)
      }
    },
    getChats: async (_root: unknown, _args: unknown, context: ChatterType): Promise<ChatReturnType[]> => {
      try {
        const chats = await chatServices.getChats(context.id);
        return chats;
      } catch (e) {
        throw gqErrorHandler(e)
      }
    }
  },
  Mutation: {
    async message(_: unknown, args: { message: unknown }, context: ChatterType): Promise<MessageReturnType> {
      try {
        const message = NewMessageSchema.parse(args.message)
        let newMessage = await messageServices.addMessage(context.id, message)
        await chatServices.updateChatLatestMessage({ id: newMessage.id, chatId: newMessage.chatId })
        pubsub.publish(events.MESSAGE, { message: newMessage })
        return newMessage;
      }
      catch (e) {
        throw gqErrorHandler(e)
      }
    },
    async firstMessage(_: any, args: { message: unknown }, context: ChatterType): Promise<FirstMessageReturnType> {
      try {
        const message = FirstMessageSchema.parse(args.message);
        let newMessage = await messageServices.firstMessage(context.id, message);
        await chatServices.updateChatLatestMessage({ id: newMessage.id, chatId: newMessage.chat.id })
        let updatedChat = await chatServices.updateChatStatus(context.id, { status: "sent", chatId: newMessage.chat.id })
        pubsub.publish(events.FIRST_MESSAGE, { firstMessage: { ...newMessage, chat: updatedChat } })
        return {
          ...newMessage,
          chat: updatedChat
        };
      } catch (e) {
        throw gqErrorHandler(e)
      }
    },
    async createGroup(_: any, args: { groupDetails: unknown }, context: ChatterType): Promise<ChatReturnType> {
      try {
        console.log(args.groupDetails)
        const chatDetails = NewChatSchema.parse(args.groupDetails);
        let newChat = await chatServices.createChatRoom(context.id, chatDetails)
        pubsub.publish(events.GROUP_CREATED, { groupCreation: newChat })
        return newChat
      } catch (e) {
        throw gqErrorHandler(e)
      }
    },
    async chatStatusUpdate(_: unknown, args: { details: unknown }, context: ChatterType): Promise<ChatReturnType> {
      try {
        const statusDetail = ChatStatusUpdateSchema.parse(args.details);
        let updatedChat = await chatServices.updateChatStatus(context.id, statusDetail);
        pubsub.publish(events.CHAT_STATUS, { chat: updatedChat })
        return updatedChat
      } catch (e) {
        throw gqErrorHandler(e)
      }
    },
    async messageReaction(_: unknown, args: { details: unknown }, context: ChatterType): Promise<MessageReturnType> {
      try {
        const reactionDetail = MessageReactedSchema.parse(args.details);
        const updatedMessage = await messageServices.messageReacted(context.id, reactionDetail);
        pubsub.publish(events.MESSAGE_REACTED, { messageReaction: updatedMessage })
        return updatedMessage
      } catch (e) {
        throw gqErrorHandler(e)
      }
    }
    ,
  },
  Subscription: {
    message: {
      subscribe: withFilter((_root: unknown, _args: unknown, _context?: ChatterType) => {
        return pubsub.asyncIterableIterator([events.MESSAGE])
      },
        async (p, _v, context) => {
          if (!context) {
            return false
          }
          let payload = p as { message: MessageReturnType }
          let message = payload.message
          if (message.sender === context.id) {
            return false
          }
          console.log(message.receiver, context.id, message.receiver === context.id)
          if (message.receiver) {
            return message.receiver === context.id
          }
          let participants = await chatServices.getChatParticipants(message.chatId);
          if (participants.includes(context?.id)) {
            return true
          }
          return false
        })
    },
    firstMessage: {
      subscribe: withFilter((root, _args) => {
        return pubsub.asyncIterableIterator([events.FIRST_MESSAGE])
      }, (root, _args, context?: ChatterType) => {
        if (!context) {
          return false
        }
        const { firstMessage } = root as { firstMessage: FirstMessageReturnType }
        return context.id === firstMessage.receiver
      })
    },
    newGroup: {
      subscribe: withFilter(() => {
        return pubsub.asyncIterableIterator([events.GROUP_CREATED])
      }, (root, _args, context?: ChatterType) => {
        if (!context) {
          return false
        }
        let { newGroup } = root as { newGroup: ChatReturnType }
        return Boolean(newGroup.participants.find(chatter => chatter.id === context.id));
      })
    },
    messageReaction: {
      subscribe: withFilter(() => {
        return pubsub.asyncIterableIterator([events.MESSAGE_REACTED])
      }, (root, _args, context?: ChatterType) => {
        if (!context) {
          return false
        }
        let { messageReaction } = root as { messageReaction: MessageReturnType };
        let send = Boolean(messageReaction.reactions.find(reaction => reaction.chatter === context.id))
        return send
      })
    },
    chatStatusUpdate: {
      subscribe: withFilter(() => {
        return pubsub.asyncIterableIterator([events.CHAT_STATUS]);
      }, (root, _args, context?: ChatterType) => {
        if (!context) {
          return false
        }
        let { chatStatusUpdate } = root as { chatStatusUpdate: ChatReturnType }
        let send = Boolean(chatStatusUpdate.participants.find((chatter) => chatter.id === context.id))
        return send
      })
    }
  }
};
