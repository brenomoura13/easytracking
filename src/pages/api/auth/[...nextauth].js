import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { compare } from 'bcryptjs'
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    jwt: true, 
  },
  
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const client = await MongoClient.connect(
          process.env.MONGODB_URI,
          { useNewUrlParser: true, useUnifiedTopology: true }
          )
          const users = await client.db().collection('cadastros')
          const result = await users.findOne({
            email: credentials.email,
          })
          if (!result) {
            client.close()
            throw new Error('Nenhum usuário encontrado com este e-mail.')
          }
          const checkPassword = await compare(credentials.passowrd, result.passowrd)
          if (!checkPassword) {
            client.close()
            throw new Error('Senha não confere.')
          }
          client.close()
          return { email: result.email }
        },
      }),
    ],
    pages: {
      signIn: "/",
    }
  })