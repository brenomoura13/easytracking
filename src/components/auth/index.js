import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signIn } from "next-auth/react"
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from "next/image"
import Link from "next/link"

async function CreateUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Alguma coisa deu errado!')
  }

  return data
}


const FormAuth = ({providers}) => {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState)
  }

  async function submitHandler(event) {
    event.preventDefault()

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      })

      if (!result.error) {
        router.replace('/user')
      }
    } else {
      try {
        const result = await CreateUser(enteredEmail, enteredPassword)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    
    <div className="w-screen h-screen bg-gradient-to-r from-slate-300 to-slate-100">
      <div className="relative font-medium h-screen flex items-center content-center justify-center">
        <div className="mr-auto ml-auto w-full">
          <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
          <Image src={"/logo.png"} width={128} height={128}/>
          </div>
          <form onSubmit={submitHandler}>
            <div className="w-full max-w-md mr-auto ml-auto mt-4">
              <div className="rounded-md px-8 py-8 mb-4 ml-auto mr-auto">
                <div className="mb-4">
                  <label className="block text-violet-900 text-sm font-medium mb-2" htmlFor="email">E-mail</label>
                  <input required ref={emailInputRef} className="shadow-sm appearance-none border border-slate-400 rounded w-full py-4 px-3 slate-900 text-sm leading-tight focus:outline-none focus:border-indigo-300" id="email" type="email" placeholder="joao@exemplo.com.br" />
                </div>
                <div className="mb-6">
                  <label className="block text-violet-900 text-sm font-medium mb-2" htmlFor="password">Senha</label>
                  <input required ref={passwordInputRef} className="shadow-sm appearance-none border border-slate-400 rounded w-full py-4 px-3 slate-900 text-sm leading-tight focus:outline-none focus:border-indigo-300" id="password" type="password" placeholder="***************" />
                </div>
                <div className="mb-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="text-center sm:text-left">
                    </div>
                    <div className="text-center sm:text-right">
                      <Link href="/">
                        <a className="text-violet-600 font-medium text-sm duration-200 text-center transition-colors hover:text-violet-800">Esqueci minha senha</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <button type="button" className="bg-violet-500 hover:bg-violet-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-full hover:bg-tertiary duration-200 transition-all" onClick={() => signIn("credentials")}>
                    Continuar
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-0 mb-6">
                  <hr className="mt-3 hidden sm:block border-slate-400" />
                  <span className="text-center text-sm slate-900 font-normal">Ou continue com</span>
                  <hr className="mt-3 hidden sm:block border-slate-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                {Object.values(providers).map((provider) => (
                  provider.id === 'credentials' ? null : (
                      <button key={provider.name} type="button" className="relative border-solid border shadow-sm border-slate-400
                      font-semibold text-violet-600 text-sm py-1 text-center rounded text-center w-full
                      focus:outline-none hover:border-violet-600 transition-all duration-200" onClick={() => signIn(provider.id)}>
                        {(() => {
                          switch (provider.id) {
                            case "google":
                            return (
                              <FontAwesomeIcon icon={faGoogle} />
                            )
                            case "facebook":
                            return (
                              <FontAwesomeIcon icon={faFacebookF} />
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
      </div>
    </div>
  )
}

export default FormAuth
