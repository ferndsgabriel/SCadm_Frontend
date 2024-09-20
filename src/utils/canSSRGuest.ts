import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    
    // Verifica se o usuário já está logado com qualquer token
    const adminToken = cookies["@SalaoCondoAdm.token"];
    const porterToken = cookies["@SalaoCondoPort.token"];

    if (adminToken) {
      return {
        redirect: {
          destination: "/reservation",
          permanent: false
        }
      };
    }

    if (porterToken) {
      return {
        redirect: {
          destination: "/guests", 
          permanent: false
        }
      };
    }

    return await fn(ctx);
  };
}
