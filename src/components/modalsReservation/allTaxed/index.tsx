import Gmodal  from "../../myModal";
import { useState, useRef , useEffect} from "react";
import { SetupApiClient } from "../../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import {formatDate} from "../../../utils/formatted";
import { SlPrinter } from "react-icons/sl";
import { Loading } from "../../loading";

type taxedType = {
    dateGuest:Date,
    dateCancellation:Date,
    id:string,
    name:string,
    email:string,
    phone_number:string,
    apartment:{
    numberApt:string,
        user:{
            name:string,
            lastname:string,
            email:string,
            phone_number:string
    },
        tower:{
            numberTower:true
        }
    }
}


export default function AllTaxed({isOpen, onClose}){
    const apiClient = SetupApiClient();
    const [loadingPage, setLoadingPage] = useState(true);
    const [taxed, setTaxed] = useState <taxedType[]> ([]);
    const modalContentRefData = useRef(null);

    useEffect(()=>{
        async function handleTaxed(){
            try{
                const response = await apiClient.get('/adm/taxed');
                setTaxed(response.data)
                console.log(taxed)
            }catch(err){
                console.log('Erro ao buscar dados da api')
            }
        }

        if (isOpen){
            try{
                handleTaxed();
            }catch(error){
                console.log(error)
            }finally{
                setLoadingPage(false);
            }
        }
    }, [isOpen]);

    const handlePrint = () => {
        const data = modalContentRefData.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                <title>Impressão</title>
                </head>
                <body>
                ${data}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    
    
    return(
        <>
            {isOpen ?(
                loadingPage?(
                    <Loading/>
                ):(
                    <Gmodal isOpen={isOpen} onClose={onClose} className={styles.modalTaxed}>
                        {taxed && taxed.length > 0 ?(
                            <div className={styles.container}>
                                <div className={styles.borderArea}>
                                    <h2>Lista de taxados</h2>
                                    <button onClick={onClose}>
                                        <AiOutlineClose />
                                    </button>
                                </div>
                                <div className={styles.all}>
                                <div className={styles.beforeUl}>
                                    <button onClick={handlePrint} autoFocus={true}>
                                        <SlPrinter/>
                                    </button>
                                </div>
                                <ul className={styles.ul} ref={modalContentRefData}>
                                    {taxed.map((item, index)=>{
                                        return(
                                            <li key={index}>
                                            <b>{item.name}</b>
                                                <p>Torre {item.apartment.tower.numberTower} - Apartamento {item.apartment.numberApt}</p>
                                                <p>Data reservada: {formatDate(item.dateGuest)}</p>
                                                <p>Data cancelada: {formatDate(item.dateCancellation)}</p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        ):(
                            null
                        )}
                </Gmodal>
                )
            ):null}
        </>
    )
}