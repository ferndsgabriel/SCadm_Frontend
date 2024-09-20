import Head from "next/head";
import styles from "../../../styles/Home.module.scss";
import {Input} from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import {FormEvent, useContext, useState} from "react"
import { SetupApiClient } from "../../services/api";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { ThemeContext } from "../../contexts/ThemeContext";
import {toast} from "react-toastify";
import { AxiosError } from "axios";
import { setCookie } from "nookies";
import Router from "next/router";
export default function Home(){

  const [pass, setPass] = useState('');
  const [loading,setLoading] = useState(false);
  const {dark} = useContext(ThemeContext)
  const api = SetupApiClient();
  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (pass === ""){
      toast.warning("Preencha o campo de acesso");
      return;
    }

    setLoading(true);

    const response = await api.post('/concierge', {
      cod:pass
    }).then((response)=>{
      const token = response.data; 
      setCookie (undefined, "@SalaoCondoPort.token", token,{
        maxAge:60*60*24*30,
        path:"/"
    });

    toast.success("Logado com sucesso");

    Router.push("/guests");
    
    }).catch((err:AxiosError | any)=>{
      toast.error(err.response.data.error || "Erro logar");

    }).finally(()=>{
      setLoading(false);
    }) 
  }


  return(
    <>
    <Head>
        <title>
        SalãoCondo - Página inicial
        </title>
    </Head>
    <main className={styles.container}>
      {dark?(
          <img src="./iconDark.svg" alt="SalãoCondo Logo" />
      ):(
          <img src="./iconLight.svg" alt="SalãoCondo Logo" />
      )}
  
      <form className={styles.form} onSubmit={handleLogin}>
        <Input placeholder="Código de acesso" type="password"
        value={pass} onChange={(e)=>setPass(e.target.value)}/>

        <Button
          disabled={loading}
          type="submit"
          >
          Entrar
        </Button>
      </form>
      
      {!loading && (
        <div className={styles.othersOptions}>

          <Link href={"/"} className={styles.link}>
            Entrar como admninistrador
          </Link>
        </div>
      )}

    </main>
    </>
  )
}

export const getServerSideProps = canSSRGuest (async ()=>{
  return{
    props:{}
  }
})