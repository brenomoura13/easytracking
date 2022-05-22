import { MongoClient } from 'mongodb'
import { hash } from 'bcryptjs'
async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Algum dos campos está inválido.' })
            return
        }
        const client = await MongoClient.connect(
            process.env.MONGODB_URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        const db = client.db()
        const checkExisting = await db
            .collection('cadastros')
            .findOne({ email: email })
        if (checkExisting) {
            res.status(422).json({ message: 'Este usuário já existe.' })
            client.close()
            return
        }
        const status = await db.collection('users').insertOne({
            email,
            password: await hash(password, 12),
        })
        res.status(201).json({ message: 'Usuário criado.', ...status })
        client.close()
    } else {
        res.status(500).json({ message: 'Rota inválida.' })
    }
}

export default handler