import { GraphQLError } from "graphql";
import { GraphQlDate } from "../graphql/scalarTypes";
import { MessageReactionType, NewMessageType } from "../messageTypes";
import { isMongoID } from "../typeGuards";
import { NewMessageSchema } from "../validators/messageValidator";
import messageServices from "../services/message.services";
import { gqError } from "../utils/errors";

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

  type NewMessage{
    chatId:String!
    message:String!
    sender:String!
    receiver:String!
    sentTime:Date!
  }


  type Mutation{
    sendMessage(message:NewMessage!):Message!
    
  }
`;

export const resolvers = {
  Date: GraphQlDate,

  Mutation: {
    sendMessage(message: unknown) {
      try {

        let newMessage = NewMessageSchema.parse(message);
        let savedMessage = messageServices.addMessage(newMessage)
        return savedMessage
      }
      catch(e){
      }
    }
  },
};
