import { MongoClient } from 'mongodb'

async function handler(req, res) {
  const email = req.query.email
  const client = await MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  let db = client.db()
  const checkExisting = await db
  .collection('accounts')
  .findOne({ email: email })
  if (checkExisting) {
    res.status(201).json({ status: 201, list: checkExisting.codes })
  }
}

  
export default handler