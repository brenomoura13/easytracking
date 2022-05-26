async function rastrear (codigo) {
 const data = await fetch(`https://proxyapp.correios.com.br/v1/sro-rastro/${codigo}`) 
 const json = await data.json()
 return console.log(json)
}