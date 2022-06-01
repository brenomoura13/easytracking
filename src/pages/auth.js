import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { getProviders } from "next-auth/react"
import FormAuth from '../components/Auth'
import Loading from '../components/Loading'

function AuthPage({providers}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        console.log(session);
        router.replace('/logged')
      } else {
        setIsLoading(false)
      }
    })
  }, [router])

  if (isLoading) {
    return <Loading />
  }

  return <FormAuth providers={providers}/>
}

export default AuthPage

export async function getServerSideProps(_) {
  const providers = await getProviders()
  return {
    props: { 
      providers
    },
  }
}