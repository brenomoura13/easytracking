import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useRouter } from "next/router"

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
  const [isOpen, setIsOpen] = useState(true)
  const closeModal = () => {
    setIsOpen(false)
  }

  const router = useRouter()
  const refreshData = () => router.replace(router.asPath)

  const { data: session } = useSession()
  const email = session?.user.email
  async function registerHandler(event) {
    const enteredCode = event.code
    const enteredName = event.name
    const result = await RegisterNewCode(email, enteredCode, enteredName)
    switch (result.status) {
    case 201:
      closeModal()
      refreshData()
      break
    case 409:
      setalreadyRegisteredMsg("Código já registrado.")
      break
    }
  }
  function onSubmit(evt) {
    registerHandler(evt)
  }

  const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(20, "Apelido deve possuir no máximo 20 caracteres.")
    .min(3, "Apelido deve possuir no mínimo 3 caracteres.")
    .required("É necessário informar um apelido para continuar."),
  code: Yup.string()
    .length(13, "Código deve possuir 13 caracteres.")
    .required("É necessário informar um código para continuar.")
    .matches(/^[A-Z]{2}\d{9}[A-Z]{2}$/, "Seu código está com um formato errado."),
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState
  const [alreadyRegisteredMsg, setalreadyRegisteredMsg] = useState('')

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all font-montserrat">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Informe o código
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} method="put">
                    <input                     
                      className={`shadow-sm appearance-none border rounded w-full py-4 px-3 mt-2 slate-900 text-sm leading-tight focus:outline-none ${errors.name ? "border-rose-700" : "border-slate-400"}`}
                      id="name" 
                      type="text"
                      name="name"
                      placeholder="Apelido"
                      {...register("name")}
                    />
                    <div className="text-red-500 text-xs md:text-base mt-2 font-lato mb-2">{errors.name?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Error"} />, errors.name?.message] : null}</div>
                    <input                     
                      className={`shadow-sm appearance-none border rounded w-full py-4 px-3 mt-2 slate-900 text-sm leading-tight focus:outline-none ${errors.code ? "border-rose-700" : "border-slate-400"}`}
                      id="code" 
                      type="text"
                      name="code"
                      placeholder="Código (Sigla + 9 dígitos + Sigla)"
                      {...register("code")}
                    />
                    <div className="text-amber-400 text-xs md:text-base mt-2 font-lato mb-2">{alreadyRegisteredMsg != '' ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Already Registered"} />, alreadyRegisteredMsg] : null}</div>
                    <div className="text-red-500 text-xs md:text-base mt-2 font-lato mb-2">{errors.code?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" key={"Code Error"} />, errors.code?.message] : null}</div>                    
                    <div className="flex items-center justify-center">
                      <button className="bg-rose-500 hover:bg-rose-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-1/2 hover:bg-tertiary duration-200 transition-all" onClick={closeModal}>
                        Cancelar
                      </button>       
                      <button className="ml-4 bg-violet-500 hover:bg-violet-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-1/2 hover:bg-tertiary duration-200 transition-all" type="submit">
                        Enviar
                      </button>                        
                    </div>
                  </form>     
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default NewCodeModal