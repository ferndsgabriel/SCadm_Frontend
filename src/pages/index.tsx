import Head from "next/head";
import styles from "../../styles/Home.module.scss";
import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";
import Link from "next/link";
import {FormEvent, useContext, useState} from "react"
import { AuthContext } from "../contexts/AuthContexts"
import {isEmail} from "validator";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Home(){

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading,setLoading] = useState(false);
  const {signIn} = useContext(AuthContext)
  const {dark} = useContext(ThemeContext)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" && pass === ""){
      return;
    }
    if (email === "" || pass === ""){
      toast.warning('Por favor, insira todas as suas informações.');
      return;
    }
    if (!isEmail(email.trim())){
      toast.warning('Por favor, insira um e-mail válido.');
      return;
    } 

    let data = {
      email:email.trim(),
      pass
    };
    
    setLoading(true);
    try{
        await signIn(data);
    }catch(err){
        console.log(err)
    }finally{
        setLoading(false);
    }
    
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
        <Input placeholder="Insira seu email:" type="email"
        value={email} onChange={(e)=>setEmail(e.target.value)}/>

        <Input placeholder="Sua senha:" type="password"
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
        <Link href={"/recovery"} className={styles.link}>
          <p>Recuperar conta</p>
        </Link>
        <Link href={"/singup"} className={styles.link}>
          Não tem uma conta? Cadastre-se
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