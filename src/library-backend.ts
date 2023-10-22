import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag';
import { join } from 'path';
import { readFileSync } from 'fs'
import { Context } from './types'
import resolvers from './resolvers'

const typeDefs = gql(readFileSync(join(__dirname, './schema.graphql'), 'utf8'));

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})