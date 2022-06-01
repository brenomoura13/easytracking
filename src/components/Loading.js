import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const Loading = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-slate-300 to-slate-100">
      <div className="relative font-medium h-screen flex items-center content-center justify-center">
        <div className="mr-auto ml-auto w-full">
          <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
            <p className="font-montserrat font-semibold text-violet-600 text-4xl md:text-6xl py-1 rounded text-center focus:outline-none">             
              <FontAwesomeIcon icon={faCircleNotch} className="no-underline text-3xl md:text-5xl mr-5" spin/>Carregando
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading