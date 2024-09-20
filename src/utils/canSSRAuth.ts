import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/error/AuthTokenError";

// Adiciona uma função para verificar o nível de acesso (role)
export function canSSRAuth<P>(fn: GetServerSideProps<P>, allowedRoles: string[]) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const adminToken = cookies["@SalaoCondoAdm.token"];
    const porterToken = cookies["@SalaoCondoPort.token"];

    const token = adminToken || porterToken;

    if (!token) {
      destroyCookie(ctx, "@SalaoCondoAdm.token");
      destroyCookie(ctx, "@SalaoCondoPort.token");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      if (allowedRoles.includes("admin") && adminToken) {
        return await fn(ctx); 
      } else if (allowedRoles.includes("porter") && porterToken) {
        return await fn(ctx);
      } else {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } catch (err) {
      if (err instanceof AuthTokenError || (err.response && err.response.status === 401)) {
        destroyCookie(ctx, "@SalaoCondoAdm.token");
        destroyCookie(ctx, "@SalaoCondoPort.token");
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      throw err;
    }
  };
}
