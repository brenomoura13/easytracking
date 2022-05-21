import Register from "../components/Register"
import { getProviders } from "next-auth/react"
import clientPromise from '../lib/mongodb'

const Home = ({ providers }) => {
  return (
    <Register providers={providers}/>
  )
}

export default Home

export async function getServerSideProps(_context) {
  const providers = await getProviders()
  let connected = false
  try {
    await clientPromise
    connected = true
  } catch (e) {
    throw new Error(e)
  }
  return {
    props: { 
      providers,
      isConnected: connected, 
    },
  }
}
