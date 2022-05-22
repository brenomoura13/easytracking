import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getProviders } from "next-auth/react"
import FormAuth from '../components/auth/';

function AuthPage({providers}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return <FormAuth providers={providers}/>;
}

export default AuthPage;

export async function getServerSideProps(_) {
  const providers = await getProviders()
  console.log(providers);
  return {
    props: { 
      providers
    },
  }
}