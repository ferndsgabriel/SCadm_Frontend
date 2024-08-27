import Head from "next/head";
import styles from "../../../styles/Home.module.scss";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { FormEvent, useState, useContext, ChangeEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContexts";
import { toast } from "react-toastify";
import {isMobilePhone, isEmail} from 'validator'
import zxcvbn from 'zxcvbn';
import { canSSRGuest } from "../../utils/canSSRGuest";
import { onlyString } from "../../utils/formatted";
import TermsModal from "../../components/modals/modalTerms";

export default function Home() {
  const { singUp } = useContext(AuthContext);
  const { dark } = useContext(ThemeContext);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState('');
  const [cod, setCod] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [isOpen, setIsOpen] = useState (false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (checkbox === false){
      toast.warning('É necessário aceitar os termos do contrato.');
      return;
    }
    if (name === "" || lastname === "" || cod === "" || email === "" || pass === "" || phone_number === "") {
      toast.warning('Por favor, insira todas as informações necessárias.');
      return;
    }
    if (!onlyString(name.trim()) || !onlyString(lastname.trim())){
      toast.warning('Por favor, insira um nome válido.');
      return;
    }
    if (!isMobilePhone(phone_number)){
      toast.error("Por favor, insira um número de telefone válido.");
      return
    }

    if (!isEmail(email.trim())) {
      toast.error("E-mail inválido. Utilize um endereço do Gmail ou Hotmail.");
      return;
    }

    if (!isEmailOfType(email.trim())) {
      toast.error("E-mail inválido. Utilize um endereço do Gmail ou Hotmail.");
      return;
    }

    if (zxcvbn(pass).score < 3) {
      toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
      return;
    }

    setLoading(true);

    let data = {
      name:name.trim(),
      lastname:lastname.trim(),
      cod,
      email:email.trim(),
      pass,
      phone_number,
    };

    try{
      await singUp(data);
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  const isEmailOfType = (email) => {
    const allowedDomains = ['gmail.com', 'hotmail.com'];
    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
  };

  function openModal(){
    setIsOpen(true);
  }

  function closedModal(){
    setIsOpen(false);
  }


  return (
    <>
      <Head>
        <title>SalãoCondo - Cadastrar</title>
      </Head>
      <main className={styles.container}>
        {dark?(
          <img src="./iconDark.svg" alt="SalãoCondo Logo" />
            ):(
          <img src="./iconLight.svg" alt="SalãoCondo Logo" />
        )}

        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputsRow }>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu primeiro nome:" type="text" />
            <Input value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Seu último nome:" type="text" />
          </div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail:" type="email" />
          <Input value={phone_number} onChange={(e) => setPhone_number(e.target.value)} placeholder="Número de telefone:" type="tel" mask="(99)99999-9999" />
          <Input value={cod} onChange={(e) => setCod(e.target.value)} placeholder="Código de administrador:" type="password" />
          <Input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Sua senha:" type="password"/>

          {!loading &&(
            <div className={styles.checkboxArea} tabIndex={0}>
              <input type="checkbox" onChange={(e)=>setCheckbox(e.target.checked)}/> 
                  <a onClick={openModal} tabIndex={1} className={styles.link}> Li e aceito os termos de contratos.</a>
            </div> 
          )}

          <Button loading={loading} type="submit" disabled={!checkbox}>
            Cadastrar
          </Button>
          {!loading && (
            <div className={styles.othersOptions}>
              <Link href={"/"} className={styles.link}>
                Fazer login
              </Link>
            </div>
          )}
        </form>

      </main>
      <TermsModal
      isOpen={isOpen}
      onClose={closedModal}
      />
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
