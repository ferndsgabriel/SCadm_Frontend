import Head from "next/head";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import style from "../../../styles/Home.module.scss";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { useState, FormEvent, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {isEmail} from 'validator';
import { toast } from "react-toastify";
import { SetupApiClient } from "../../services/api";
import RecoveryModal from "../../components/modals/modalRecovery";

export default function Recovery(){
const [email, setEmail] = useState ('');
const [isOpen, setIsOpen] = useState (false);
const {dark} = useContext(ThemeContext);
const setupApi = SetupApiClient();
const [loadingButton, setLoadingButton] = useState(false);


function openModal(){
    setIsOpen(true)
}

function closeModal(){
    setEmail('');
    setIsOpen (false)
}

async function handleCodigo (e:FormEvent){
    e.preventDefault();

    if (!email){
        toast.warning('Por favor, insira seu e-mail.');
        return
    }
    if (!isEmail(email.trim())){
        toast.warning('Por favor, insira um e-mail válido.');
        return
    }

    setLoadingButton(true);
    try{
        await setupApi.post('adm/cod',{
            email:email
        })
        toast.success('Código de recuperação enviado com sucesso para seu e-mail.');
        openModal()
    }catch(error){{
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        console.log(error)
    }}finally{
        setLoadingButton(false)
    }
}


    return(
        <>
        <Head>
            <title>SalãoCondo - Recovery</title>
        </Head>
        <main className={style.container}>
            {dark?(
                <img src="./iconDark.svg" alt="SalãoCondo Logo" />
                ):(
                <img src="./iconLight.svg" alt="SalãoCondo Logo" />
            )}
            <h1>Recuperar senha</h1>
            <form className={style.form } onSubmit={handleCodigo}>    
                <Input type="email" placeholder="Digite seu email:"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <Button disabled={loadingButton} type="submit">Enviar código</Button>
            </form>

            {!loadingButton && (
                <div className={style.othersOptions}>
                    <Link href={'/'} className={style.link}>
                        Fazer login
                    </Link>
                </div>
            )}

        </main>
        < RecoveryModal
        email={email}
        isOpen={isOpen}
        onClose={closeModal}/>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {
                
        }
    }
});