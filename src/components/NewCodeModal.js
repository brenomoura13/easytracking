import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Dialog } from "@headlessui/react"

async function RegisterNewCode(email, code) {
  const response = await fetch("/api/correios/updateCodeList", {
    method: "PUT",
    body: JSON.stringify({ email, code }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data
}

const NewCodeModal = () => {
  const [alreadyRegisteredMsg, setalreadyRegisteredMsg] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const { data: session } = useSession()
  const email = session?.user.email
  async function registerHandler(event) {
    const enteredCode = event.code
    const result = await RegisterNewCode(email, enteredCode)
    switch (result.status) {
    case 201:
      setModalIsOpen(false)
      break
    case 409:
      setalreadyRegisteredMsg("Código já registrado.")
      break
    }
  }
  const validationSchema = Yup.object().shape({
  code: Yup.string()
    .length(13, "Código deve possuir 13 caracteres.")
    .required("É necessário informar um código para continuar.")
    .matches(/^[A-Z]{2}\d{9}[A-Z]{2}$/, "Seu código está com um formato errado."),
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  function onSubmit(data) {
    registerHandler(data)
  }

  return (
    <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
      <div id="NewCodeModal" tabIndex="-1" aria-hidden="true" className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full transition-200`}>
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto font-montserrat">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Informe o código
          </h3>
          <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="NewCodeModal">
            <FontAwesomeIcon icon={faXmark} />
          </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} method="put">
            <div className="p-6 space-y-6">
            <label className="block text-violet-700 text-xs md:text-base font-medium mb-2" htmlFor="email">E-mail:</label>
              <input                     
                className={`shadow-sm appearance-none border rounded w-full py-4 px-3 slate-900 text-sm leading-tight focus:outline-none ${errors.code ? "border-rose-700" : "border-slate-400"}`}
                id="code" 
                type="text"
                name="code"
                placeholder="joao@exemplo.com.br"
                {...register("code")}
              />
              <div className="text-amber-400 text-xs md:text-base mt-2 font-lato mb-2">{alreadyRegisteredMsg ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" key={"Code Already Registered"} />, alreadyRegisteredMsg] : null}</div>
              <div className="text-red-500 text-xs md:text-base mt-2 font-lato mb-2">{errors.code?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" key={"Code Error"} />, errors.code?.message] : null}</div>
            </div>
            <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
              <button data-modal-toggle="NewCodeModal" type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Inserir</button>
              <button data-modal-toggle="NewCodeModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Dialog>
  )
}

export default NewCodeModal