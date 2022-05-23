import { getSession } from "next-auth/react"
import BurgerMenu from "../components/Burger";

const UserInterface = () => {
  return (
    <BurgerMenu />
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
  return {
    props: { session },
  };
}

export default UserInterface