import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"

async function CreateUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data
}

const FormAuth = ({ providers }) => {
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  async function registerHandler(event) {
    const enteredEmail = event.email
    const enteredPassword = event.password
    const result = await CreateUser(enteredEmail, enteredPassword)
    switch (result.status) {
      case 409:
        const login = await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        })
      if (!login?.error) {
        router.replace("/logged")
      } else {
        setErrorMsg("Email ou senha incorretos")
      }
      break
      case 422:
      break
      case 201:
        const login2 = await signIn("credentials", {
          redirect: false,
          email: enteredEmail,
          password: enteredPassword,
        })
        if (!login2?.error) {
          router.replace("/logged")
        }
      break
    }
  }
  
  const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("E-mail é obrigatório.")
    .email("E-mail inválido."),
  password: Yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres.")
    .max(20, "Senha deve ter no máximo 20 caracteres.")
    .required("Senha é obrigatória.")
    .matches(/^([a-zA-Z0-9@*#]{6,20})$/, "Senha precisa conter: Uma letra maiúscula, uma caractere especial, no mínimo de 6 caracteres e no máximo 20."),
  terms: Yup.bool()
    .oneOf([true], "Você deve aceitar os termos para continuar."),
  })

  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  function onSubmit(data) {
    registerHandler(data)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-r from-slate-300 to-slate-100 flex flex-col items-center content-center justify-center relative font-medium">
      <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
        <Image src={"/logo.png"} width={128} height={128}/>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} method="post">
        <div className="w-full max-w-md mt-2">
          <div className="rounded-md px-8 py-8 mb-4 ml-auto mr-auto">
            <div className="text-red-500 text-xs md:text-base mt-2 mb-6 font-lato">{errorMsg ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />, errorMsg] : null}</div>
            <label className="block text-violet-700 text-xs md:text-base font-medium mb-2" htmlFor="email">E-mail:</label>
            <input                     
              className={`shadow-sm appearance-none border rounded w-full py-4 px-3 slate-900 text-sm leading-tight focus:outline-none ${errors.email ? "border-rose-700" : "border-slate-400"}`}
              id="email" 
              type="text"
              name="email"
              placeholder="joao@exemplo.com.br"
              {...register("email")}
            />
            <div className="text-red-500 text-xs md:text-base mt-2 mb-6 font-lato">{errors.email?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />, errors.email?.message] : null}</div>
            <label className="block text-violet-700 text-xs md:text-base font-medium mb-2" htmlFor="password">Senha:</label>
            <input  
              className={`shadow-sm appearance-none border border-slate-400 rounded w-full py-4 px-3 slate-900 text-sm leading-tight focus:outline-none ${errors.email ? "border-rose-700" : "border-slate-400"}`} 
              id="password" 
              type="password" 
              placeholder="Informe uma senha"
              {...register("password")}
            />
            <div className="text-red-500 text-xs md:text-base mt-2 font-lato mb-2">{errors.password?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />, errors.password?.message] : null}</div>
            <div className="mb-6">
              <div className="text-left">
                <div className="form-check mb-3">
                  <label className="form-check-label" htmlFor="terms">
                  <input 
                    className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-1 cursor-pointer" 
                    type="checkbox" 
                    value="" 
                    id="terms" 
                    {...register("terms")}/>
                    <p className="font-medium text-xs md:text-sm text-gray-800">Concordo com os<Link href="/auth"><a className="text-violet-600 duration-200 transition-colors hover:text-violet-800"> termos de uso</a></Link></p>
                  </label>
                  <div className="text-red-500 text-xs md:text-base mt-2 font-lato mb-2">{errors.terms?.message ? [<FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />, errors.terms?.message] : null}</div>
                </div>
              </div>
              <Link href="/auth">
                <a className="text-violet-600 font-medium text-xs md:text-sm duration-200 text-center transition-colors hover:text-violet-800">Esqueci minha senha</a>
              </Link>
            </div>
            <div className="mb-6">
              <button type="submit" className="bg-violet-500 hover:bg-violet-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-full hover:bg-tertiary duration-200 transition-all">
                Continuar
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-0 mb-6">
              <hr className="mt-3 hidden sm:block border-slate-400 mr-2" />
              <span className="text-center text-sm slate-900 font-normal">Ou continue com</span>
              <hr className="mt-3 hidden sm:block border-slate-400 ml-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
            {Object.values(providers).map((provider) => (
              provider.id === "credentials" ? null : (
                  <button key={provider.id} type="button" className="relative border-solid border shadow-sm border-slate-400
                  font-semibold text-violet-600 text-sm py-1 text-center rounded text-center w-full
                  focus:outline-none hover:border-violet-600 transition-all duration-200" onClick={() => signIn(provider.id)}>
                    {(() => {
                      switch (provider.id) {
                        case "google":
                        return (
                          <FontAwesomeIcon icon={faGoogle} key={provider.id} />
                        )
                        case "facebook":
                        return (
                          <FontAwesomeIcon icon={faFacebookF} key={provider.id} />
                        )
                      }
                    }
                    )()}
                  </button>
                )
              ))}            
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormAuth
