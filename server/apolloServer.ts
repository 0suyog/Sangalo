import { ApolloServer } from "@apollo/server"
import { resolvers, typeDefs } from "./graphql/messageSchema"
import type { ChatterType } from "./chatterTypes";

export const apolloServer = async () => {
  const server = new ApolloServer<ChatterType>({
    typeDefs: typeDefs,
    resolvers: resolvers
  })
  await server.start();
  return server
}