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
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import DeleteAccountModal from "../../components/modals/modalsSettings/deleteAccount";

type admPropsItens = {
    email: String;
    id: String;
    name: String;
    lastname: String;
    phone_number:String
}
interface FAQItem {
    question: string;
    answers: string[];
}

interface FAQData {
    faq: FAQItem[];
}

export default function Settings(){
    const [admDate, setadmDate] = useState<admPropsItens>();
    const [inputPass, setInputPass] = useState(false);
    const [oldPass, setOldPass] = useState ('');
    const [newPass, setNewPass] = useState ('');
    const [isOpen, setIsOpen] = useState (false);
    const [loading, setLoading ] = useState(true);
    const setupApi = SetupApiClient();

    const faqData = require ("../../faq.json");
    const faq: FAQData = faqData as FAQData;
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const handleCheckboxFAQ = (question) => {
        setExpandedQuestions({
            ...expandedQuestions,
            [question]: !expandedQuestions[question]
        });
    };


    useEffect(()=>{
        async function refreshDate(){
            try{
                const response = await setupApi.get('/adm/me');
                setadmDate(response.data)
                
            }catch(err){
                console.log('Erro ao obter dados do servidor');
            }finally{
                setLoading(false);
            }
        }

        refreshDate();
    },[]);

    function changeInputPass(){
        setInputPass(true);
    }

    function cancelPass(e:FormEvent){
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
                    <h2>FAQ - Perguntas frequentes</h2>
                    <div className={style.questionsArea}>
                        {faq.faq.map((item, index) => {
                            const isExpanded = expandedQuestions[item.question];
                            return (
                                <div key={item.question} className={style.cardQuestion}>
                                    <label className={style.labelQuestion}>
                                        <h4>{item.question}</h4>
                                        <input
                                            type="checkbox"
                                            checked={isExpanded}
                                            onChange={() => handleCheckboxFAQ(item.question)}
                                        />
                                        {isExpanded ?(
                                            <FaAngleUp/>
                                        ):<FaAngleDown />}
                                        
                                    </label>
                                    {isExpanded && (
                                        <ul className={style.answer}>
                                            {item.answers.map((answer, index) => (
                                                <li key={index}>{answer}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    </section>

                    <section className={style.section4}>
                        <h2>Apagar conta</h2>
                        <button onClick={openModal} className="buttonSlide"><span>Deletar minha conta <AiTwotoneDelete/></span></button>
                    </section>


                    <span className={style.section5}>
                        <h2>Fazer logout</h2>
                        <div className={style.areaButton}>
                            <button onClick={singOut} className="buttonSlide"><span>Sair da conta<FiLogOut/></span></button>
                        </div>
                    </span>
                </main>
            </div>
            
            <DeleteAccountModal
            isOpen={isOpen}
            onClose={closeModal}
            />
        </>
    )
}


export const getServerSideProps = canSSRAuth (async ()=>{
    return{
        props:{}
    }
})
