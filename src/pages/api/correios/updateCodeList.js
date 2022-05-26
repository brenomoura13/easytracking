import { MongoClient } from 'mongodb'

async function handler(req, res) {
  if (req.method === 'PUT') {
    const { email, code } = req.body
    if (!code || code.length != 13) {
      res.status(422).json({ status: 422, message: 'Código é requirido e deve conter 13 caracteres.' })
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
        db.collection('accounts').updateOne({ email: email }, { $push: { codes:code } })
        res.status(201).json({ status: 201, message: 'Lista de codigos atualizada com sucesso.' })
      }
    } else {
      res.status(500).json({ status: 500, message: 'Rota inválida.' })
    }
  }
  
  export default handler