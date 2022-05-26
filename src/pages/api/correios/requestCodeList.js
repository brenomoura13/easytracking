import { MongoClient } from 'mongodb'

async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.body
    const client = await MongoClient.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }
      )
      let db = client.db()
      const checkExisting = await db
      .collection('accounts')
      .findOne({ email: email })
      if (checkExisting) {
        res.status(201).json({ status: 201, message: 'Lista de codigos retornada com sucesso.' })
        client.close()
        return checkExisting.codes
      }
    } else {
      res.status(500).json({ status: 500, message: 'Rota inválida.' })
    }
  }
  
  export default handler