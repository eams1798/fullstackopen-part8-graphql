import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag';
import { join } from 'path';
import { readFileSync } from 'fs'
import { Author, Context } from './types'
import resolvers from './resolvers'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import User from './models/User';
dotenv.config()

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI || ''

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql(readFileSync(join(__dirname, './schema.graphql'), 'utf8'));

const server = new ApolloServer<any /*fix Context type*/>({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET!
      ) as jwt.JwtPayload
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})