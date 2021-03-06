import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTruckArrowRight } from "@fortawesome/free-solid-svg-icons"
import Link from 'next/link' 

const TrackingList = ({codeList}) => {
  return (
    <>
      <div className="w-full px-4 mt-20 flex flex-col-reverse">
        {codeList.list.map((list) => (
        <Link href={{
          pathname: '/details',
          query: { code: list.code },
          }} 
          key={list.code} passHref
        >
          <button>
            <div className="rounded-lg border pb-6 border-gray-200 font-montserrat" key={list.code}>
              <div className="px-6 pt-6 overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center">
                          <div className="bg-slate-100 text-violet-600 rounded-sm p-2.5">
                            <FontAwesomeIcon icon={faTruckArrowRight} />
                          </div>
                          <div className="pl-3">
                            <div className="flex items-center text-sm leading-none">
                              <p className="font-semibold text-gray-800">{list.code}</p>
                              <p className="text-violet-500 ml-3">({list.name})</p>
                            </div>
                            <div className="flex items-center max-w-fit justify-center px-2 py-1 mt-2 bg-violet-100 rounded-full">
                              <p className="text-xs leading-3 text-violet-700">Em transito</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>       
                  </tbody>
                </table>
              </div>
            </div>
          </button>
        </Link>
      ))}
      </div>
    </>
  )
}

export default TrackingList
