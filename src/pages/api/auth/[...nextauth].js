import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { verifyPassword } from '../../../lib/auth'
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoClient } from "mongodb"


export default NextAuth({
  session: {
    strategy: "jwt" 
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
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Breno" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {  
        const client = await MongoClient.connect(
          process.env.MONGODB_URI,
          { useNewUrlParser: true, useUnifiedTopology: true }
          )
          let db = client.db()
          const users = await db.collection('accounts')
          const result = await users.findOne({
            email: credentials.email,
          })
          const checkPassword = await verifyPassword(credentials.password, result.password)
          if (!checkPassword || !result) {
            client.close()
            throw new Error('pass_or_email_not_found')
          }
          client.close()
          return { email: result.email }
        },
      }),
    ],
    pages: {
      signIn: "/auth",
    }
  })