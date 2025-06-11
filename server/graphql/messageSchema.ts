import { GraphQlDate } from "../graphql/scalarTypes";
import { FirstMessageSchema, NewMessageSchema } from "../typeValidators/messageValidator";
import messageServices from "../services/message.services";
import { gqErrorHandler } from "../utils/graphQlErrorHandler";
import { FirstMessageReturnType, MessageReturnType } from "../messageTypes";
import { ChatterType } from "../chatterTypes";

export const typeDefs = `
  scalar Date

  enum Reactions{
    like
    love
    sad
    laugh
    cry
  }

  type Reaction{
    chatter:String!
    reaction:Reactions!
  }
  
  type Chat{
    id:String!
    participants:[String!]!
    name:String
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
    chat:Chat
    message:String
    sender:String
    receiver:String
    id:String
    sentTime:Date
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

  type Query{
    _empty:String!
  }

  type Mutation{
    firstMessage(message:FirstMessage!):FirstMessageReturn
    message(message:NewMessage!):Message
  }
`;

export const resolvers = {
  Date: GraphQlDate,

  Query: {},
  Mutation: {
    async message(_: any, args: { message: unknown }, context: ChatterType): Promise<MessageReturnType> {
      try {
        const message = NewMessageSchema.parse(args.message)
        let newMessage = await messageServices.addMessage(context.id, message)
        return newMessage
      }
      catch (e) {
        throw gqErrorHandler(e)
      }
    },
    async firstMessage(_: any, args: { message: unknown }, context: ChatterType): Promise<FirstMessageReturnType> {
      try {
        const message = FirstMessageSchema.parse(args.message);
        let newMessage = await messageServices.firstMessage(context.id, message);
        return newMessage;
      } catch (e) {
        throw gqErrorHandler(e)
      }
    }
  },
};
