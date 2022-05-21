import Register from "../components/Register"
import { getProviders, signIn } from "next-auth/react"

const Home = ({ providers }) => {
  return (
    <Register providers={providers}/>
  )
}

export default Home

export async function getServerSideProps(_context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
