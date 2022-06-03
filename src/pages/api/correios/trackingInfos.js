async function handler(req, res) {
  const code = req.query.code
  const data = await fetch(`https://proxyapp.correios.com.br/v1/sro-rastro/${code}`) 
  const json = await data.json()
  if (json) {
    res.status(201).json({ status: 201, details: json })
  }
}

  
export default handler