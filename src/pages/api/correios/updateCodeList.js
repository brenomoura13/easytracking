import { MongoClient } from 'mongodb'

async function handler(req, res) {
  if (req.method === 'PUT') {
    const { email, code, name } = req.body
    if (!code || code.length != 13) {
      res.status(422).json({ status: 422, message: 'Código é obrigatório e deve conter 13 caracteres.' })
      return
    }
    if (!name) {
      res.status(422).json({ status: 422, message: 'Apelido é obrigatório.' })
      return
    }
    const client = await MongoClient.connect(
        process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      let db = client.db()
      const checkOnDB = await db
      .collection('accounts')
      .findOne({ email: email, codes: { $elemMatch: { code: code } } })
      if (!checkOnDB) {
        db.collection('accounts').updateOne({ email: email }, { $push: {codes: {code: code, name: name} } })
        res.status(201).json({ status: 201, message: 'Lista de codigos atualizada com sucesso.' })
      } else {
        res.status(409).json({ status: 409, message: 'Código já registrado.' })
        client.close()
        return
      }
    } else {
      res.status(500).json({ status: 500, message: 'Rota inválida.' })
    }
  }
  
  export default handler