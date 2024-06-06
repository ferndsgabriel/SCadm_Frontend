import Head from "next/head";
import Header from "../../components/header";
import { Input } from "../../components/ui/input";
import {FiLogOut} from "react-icons/fi";
import {ChangeEvent, FormEvent, useState, useEffect} from "react";
import style from './styles.module.scss';
import {AiTwotoneDelete} from "react-icons/ai";
import { singOut } from "../../contexts/AuthContexts";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import zxcvbn from 'zxcvbn';
import { Loading } from "../../components/loading";
import { Gmodal } from "../../components/myModal";


type admPropsItens = {
    email: String;
    id: String;
    name: String;
    lastname: String;
    phone_number:String
}
interface admInterface{
    admProps: admPropsItens
}

export default function Settings({admProps}: admInterface){
const [admDate, setadmDate] = useState(admProps || null);
const [inputPass, setInputPass] = useState(false);
const [oldPass, setOldPass] = useState ('');
const [newPass, setNewPass] = useState ('');
const [isOpen, setIsOpen] = useState (false);
const [checkBox, setCheckBox] = useState (false);
const [inputDelete, setInputDelete] = useState ('');
const [loading, setLoading ] = useState(true);


const setupApi = SetupApiClient();

async function refreshDate(){
    try{
        
        const response = await setupApi.get('/adm/me');
        setadmDate(response.data)
        setLoading(false);
    }catch(err){
        console.log('Erro ao obter dados do servidor');
        setTimeout(refreshDate, 500);
    }
}
useEffect(()=>{
    refreshDate();
},[]);

function changeInputPass(){
    setInputPass(true);
}
function 
cancelPass(e:FormEvent){
    e.preventDefault();
    setInputPass(false);
    setOldPass('');
    setNewPass('');
}

async function handlePass(e:FormEvent){
    e.preventDefault();
    const SetupApi = SetupApiClient();
    if (newPass === "" || oldPass === ""){
        cancelPass(e);
        return;
    }
    if(newPass === oldPass){
        toast.warning('Senha duplicada. Por favor, escolha uma senha diferente da anterior.');
        return;
    }
    if (zxcvbn(newPass).score < 3) {
        toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
        return;
    }
    try{
        await SetupApi.put('/adm/pass',{
            pass:oldPass,
            newPass: newPass
        })
        toast.success("A senha foi alterada com êxito!");
        cancelPass(e);
        refreshDate();

    }catch(error){
        console.log(error)
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
}


function openModal(){
    setIsOpen(true);
}

function closeModal(){
    setIsOpen(false);
    setInputDelete('');
    setCheckBox(false);
}

function handleCheckboxChange(e:ChangeEvent<HTMLInputElement>){
    setCheckBox(e.target.checked)
}

async function handleDeleteAccount(e:FormEvent){
    e.preventDefault();
    const SetupApi = SetupApiClient();
    try{
        await SetupApi.delete('/adm/account',{
            data:{
                pass:inputDelete
            }   
        })
        toast.success("Sua conta foi excluída com êxito.");
        singOut();
        
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        return;
    }
}

if (loading){
    return <Loading/>;
}
    return(
        <>
        <Head>
            <title>SalãoCondo - Configurações</title>
        </Head>
        <Header/>
        <div className={style.bodyArea}>
            
            <main className={style.container}>
                
                <h1>Configurações</h1>
                <section className={style.section1}>
                    <h2>Dados</h2>
                    <div className={style.conteudo1}>
                        <p>Nome: {admDate.name}</p>
                        <p>Sobrenome: {admDate.lastname}</p>
                        <p>Email: {admDate.email}</p>
                        <p>Telefone: {admDate.phone_number}</p>
                    </div>
                </section>

                <section className={style.section2}>
                    <h2>Segurança</h2>
                    <div className={style.conteudo2}>
                        <p>Alterar senha: </p>
                        <form className={style.formChangePass}>   
                            <Input placeholder="Digite sua senha atual:"
                            type="password" 
                            disabled={!inputPass}
                            value={oldPass}
                            onChange={(e)=>setOldPass(e.target.value)}
                            />

                            <Input placeholder="Sua nova senha:"
                            type="password"
                            disabled={!inputPass}
                            value={newPass}
                            onChange={(e)=>setNewPass(e.target.value)}
                            />

                            <div className={style.buttons}>
                            {!inputPass ?(
                                <button onClick={changeInputPass} className="buttonSlide">Alterar</button>
                            ):null}   

                            {inputPass ?(
                                <>
                                <button onClick={handlePass} type="submit" className="buttonSlide">Salvar</button> 
                                <button onClick={cancelPass} className="buttonSlide">Cancelar</button>
                                    
                                </>
                            ):null}
                            </div>
                        </form> 
                    </div>
                    
                </section>

                <section className={style.section3}>
                    <h2>Apagar conta</h2>
                    <button onClick={openModal} className="buttonSlide"><span>Deletar minha conta <AiTwotoneDelete/></span></button>
                </section>


                <span className={style.section4}>
                    <h2>Fazer logout</h2>
                    <div className={style.areaButton}>
                        <button onClick={singOut} className="buttonSlide"><span>Sair da conta<FiLogOut/></span></button>
                    </div>
                </span>
            </main>
        </div>

        <Gmodal isOpen={isOpen}
            onClose={closeModal}
            className='modal'>
                <form className='modalContainer' onSubmit={handleDeleteAccount}>
                    <div className='beforeButtons'>
                        <h3>Deletar conta</h3>
                        <p>Tem certeza de que deseja excluir permanentemente sua conta?</p>
                        <input type="password" 
                        placeholder="Digite sua senha"
                        value={inputDelete} autoFocus={true}
                        onChange={(e)=>setInputDelete(e.target.value)}
                        className='inputModal'/>
                        <div className='modalCheckboxArea'>
                            <input type="checkbox"  onChange={handleCheckboxChange} className=''/>
                            <p>Excluir minha conta</p>
                        </div>
                    </div>
                    <div className='buttonsModal'>
                        <button disabled={!checkBox} type="submit" className='buttonSlide'>Deletar</button>
                        <button onClick={closeModal} className='buttonSlide'>Cancelar</button>
                    </div>
                </form>

        </Gmodal>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const SetupApi = SetupApiClient(ctx);
        const response = await SetupApi.get('/adm/me');
        return {
            props: {
                admProps: response.data
            }
        };
    } 
    catch (error) {
    console.error('Erro ao obter dados da api');
        return {
            props: {
                admProps: []
            },
        };
    }   
});