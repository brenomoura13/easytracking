import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlaneArrival, faBoxesPacking, faShippingFast, faTruck, faClipboardCheck, faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import BurgerMenu from "../components/Burger"

const uri = process.env.NEXTAUTH_URL

function Details({infos}) {
  return (
    <>
    <BurgerMenu />
    <div className="w-full px-4 mt-20">
      {infos.map((info) => (
        <div className="rounded-lg mt-2 border pb-6 border-gray-200 font-montserrat" key={info.dtHrCriado}>
          <div className="px-6 pt-6 overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <div className="bg-slate-100 text-violet-600 rounded-sm w-12 text-center text-2xl p-2.5">
                        <FontAwesomeIcon icon={(() => {
                          switch (info.descricao) {
                            case 'Objeto postado': {
                              return faBoxesPacking 
                            }
                            case 'Objeto recebido pelos Correios do Brasil': {
                              return faPlaneArrival
                            }
                            case "Objeto em trânsito - por favor aguarde": {
                              return faTruck
                            }
                            case "Objeto saiu para entrega ao destinatário": {
                              return faShippingFast
                            }
                            case "Objeto entregue ao destinatário": {
                              return faClipboardCheck
                            }
                            default: {
                              return faCircleQuestion
                            }
                          }
                          })()}
                         />
                      </div>
                      <div className="pl-3">
                        <div className="flex flex-col text-sm leading-none">
                          <p className="font-semibold text-gray-800">{info.descricao}</p>
                          <p className="text-gray-800 text-xs">De: {!info.unidade?.endereco.cidade ? info.unidade?.nome : `${info.unidade?.endereco.cidade}/${info.unidade?.endereco.uf} - ${info.unidade?.tipo}`}</p>
                          <p className="text-violet-500 ml-3"></p>
                        </div>
                        <p className="text-xs leading-3 text-violet-700">{new Date(info.dtHrCriado).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                </tr>       
              </tbody>
            </table>
          </div>
        </div>
    ))}
    </div>
  </>
  )
}



export async function getServerSideProps(ctx){
  const { code } = ctx.query
  const res = await fetch(`${uri}/api/correios/trackingInfos?code=${code}`)
  const data = await res.json()
  const infos = data.details.objetos[0].eventos
  return {
    props:{
      infos
    }
  }
}

export default Details