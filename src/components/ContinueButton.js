import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const ContinueButton = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-slate-300 to-slate-100">
      <div className="relative font-medium h-screen flex items-center content-center justify-center">
        <div className="mr-auto ml-auto w-full">
          <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
            <Link href="/auth">
              <button type="button" className="font-montserrat font-semibold text-violet-600 focus:outline-none">             
                  <a className="no-underline text-4xl md:text-6xl">Continuar</a><p><FontAwesomeIcon icon={faArrowDown} className="no-underline text-3xl md:text-5xl"/></p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContinueButton