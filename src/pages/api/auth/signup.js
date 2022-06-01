import { MongoClient } from 'mongodb'
import { hashPassword } from '../../../lib/auth'

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    if (!email || !email.includes('@') || !password) {
      res.status(422).json({ status: 422, message: 'Algum dos campos está inválido.' })
      return
    }
    const client = await MongoClient.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
      )
      let db = client.db()
      const checkExisting = await db
      .collection('accounts')
      .findOne({ email: email })
      if (checkExisting) {
        res.status(409).json({ status: 409, message: 'Esse usuário já existe.' })
        client.close()
        return
      }
      const status = await db.collection('accounts').insertOne({
        email,
        password: await hashPassword(password),
        codes:[
          {code:'', name:''}
        ]
      })
      res.status(201).json({ status: 201, message: 'Usuário criado.', ...status })
      client.close()
    } else {
      res.status(500).json({ status: 500, message: 'Rota inválida.' })
    }
  }
  
  export default handler