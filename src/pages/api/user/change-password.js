import { getSession } from 'next-auth/react'

import { hashPassword, verifyPassword } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return
  }

  const session = await getSession({ req: req })

  if (!session) {
    res.status(401).json({ message: 'Não está autenticado!' })
    return
  }

  const userEmail = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()

  const usersCollection = client.db().collection('users')

  const user = await usersCollection.findOne({ email: userEmail })

  if (!user) {
    res.status(404).json({ message: 'Usuário não encontrado.' })
    client.close()
    return
  }

  const currentPassword = user.password

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword)

  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Senha invalida.' })
    client.close()
    return
  }

  const hashedPassword = await hashPassword(newPassword)

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  )

  client.close()
  res.status(200).json({ message: 'Senha atualizada com sucesso.' })
}

export default handler