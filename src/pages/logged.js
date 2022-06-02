import { getSession, useSession } from "next-auth/react"
import BurgerMenu from "../components/Burger";
import TrackingList from "../components/TrackingList";

const UserInterface = ({data}) => {
  console.log(data);
  return (
    <>
      <BurgerMenu />
      <TrackingList codeList={data}/>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }
  const { email } = session.user  
  const res = await fetch(`http://localhost:3000/api/correios/requestCodeList?email=${email}`)
  const data = await res.json()
  return {
    props: { session, data },
  };
}

export default UserInterface