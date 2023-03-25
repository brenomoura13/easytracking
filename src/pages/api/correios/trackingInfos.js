import {rastrearEncomendas} from "correios-brasil/dist";
async function handler(req, res) {
  const code = req.query.code
  rastrearEncomendas([code]).then(response => {
    res.status(201).json({ status: 201, details: response })
  }).catch(e => {
    console.error(e)
  })
}

export default handler