import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Dialog } from "@headlessui/react"

async function RegisterNewCode(email, code, name) {
  const response = await fetch("/api/correios/updateCodeList", {
    method: "PUT",
    body: JSON.stringify({ email, code, name }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data
}

const NewCodeModal = ({setModalState}) => {
  const [alreadyRegisteredMsg, setalreadyRegisteredMsg] = useState('')
  const closeModal = (evt) => {
    evt.preventDefault()
    setModalState(false)
  }
  const { data: session } = useSession()
  const email = session?.user.email
  async function registerHandler(event) {
    const enteredCode = event.code
    const enteredName = event.name
    const result = await RegisterNewCode(email, enteredCode, enteredName)
    switch (result.status) {
    case 201:
      closeModal
      break
    case 409:
      setalreadyRegisteredMsg("Código já registrado.")
      break
    }
  }
  const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(20, "Apelido deve possuir no máximo 20 caracteres.")
    .required("É necessário informar um apelido para continuar."),
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
    <Dialog open={true} onClose={()=> closeModal }>
      <div id="modal" tabIndex="-1" className="overflow-y-auto overflow-x-hidden relative top-40 z-9999 h-screen w-screen">
        <div className="absolute inset-0 h-screen">
          <div className="relative w-screen md:w-1/3 bg-violet-900 rounded-lg shadow font-montserrat">
            <div className="flex justify-center items-center p-5 rounded-t border-violet-600">
              <h3 className="text-xl w-full text-center font-medium underline text-slate-200">
                Informe o código
              </h3>
              <button onClick={closeModal} type="button" className="text-slate-200 bg-transparent hover:bg-violet-600 rounded hover:text-slate-300 text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="modal">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} method="put">
              <div className="w-full flex items-center flex-col">
                <input                     
                  className={`shadow-sm appearance-none border rounded w-5/6 py-4 px-3 mt-2 slate-900 text-sm leading-tight focus:outline-none ${errors.name ? "border-rose-700" : "border-slate-400"}`}
                  id="name" 
                  type="text"
                  name="name"
                  placeholder="Apelido"
                  {...register("name")}
                />
                <div className="text-red-500 text-xs md:text-base mt-2 font-lato ml-8 mb-2">{errors.name?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Error"} />, errors.name?.message] : null}</div>
                <input                     
                  className={`shadow-sm appearance-none border rounded w-5/6 py-4 px-3 mt-2 slate-900 text-sm leading-tight focus:outline-none ${errors.code ? "border-rose-700" : "border-slate-400"}`}
                  id="code" 
                  type="text"
                  name="code"
                  placeholder="Código (Sigla + 9 dígitos + Sigla)"
                  {...register("code")}
                />
                <div className="text-amber-400 text-xs md:text-base mt-2 font-lato ml-8 mb-2">{alreadyRegisteredMsg != '' ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Already Registered"} />, alreadyRegisteredMsg] : null}</div>
                <div className="text-red-500 text-xs md:text-base mt-2 font-lato ml-8 mb-2">{errors.code?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Error"} />, errors.code?.message] : null}</div>
              </div>
              <div className="flex w-full justify-center items-center p-6 space-x-2 rounded-b">
                <button data-modal-toggle="modal" type="submit" className="bg-violet-500 hover:bg-violet-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-3/4 hover:bg-tertiary duration-200 transition-all">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default NewCodeModal