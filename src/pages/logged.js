import { getSession } from "next-auth/react"
import BurgerMenu from "../components/Burger"
import TrackingList from "../components/TrackingList"

const uri = process.env.NEXTAUTH_URL

const UserInterface = ({data}) => {
  return (
    <>
      <BurgerMenu />
      <TrackingList codeList={data}/>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }
  const { email } = session.user  
  const res = await fetch(`${uri}/api/correios/requestCodeList?email=${email}`)
  const data = await res.json()
  return {
    props: { session, data },
  }
}

export default UserInterface