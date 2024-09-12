import Gmodal from "../../default";
import { useState, useRef , useEffect} from "react";
import { SetupApiClient } from "../../../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import {formatDate, formatHours} from "../../../../utils/formatted";
import { SlPrinter } from "react-icons/sl";
import { Loading } from "../../../loading";

interface listGuestProps{
    apartament:string,
    cleaningService:boolean,
    date:number,
    start:number,
    finish:number,
    guest:{
        name:string;
        rg:string;
    }[];
}


type reservationGuestType = {
    isOpen: boolean,
    onClose: () => void,
    data:listGuestProps
}

export default function ViewGuestModal({isOpen, onClose,  data}:reservationGuestType){
    const modalContentRef = useRef(null);
    const modalContentRefData = useRef(null);




    const handlePrint = () => {
        const data = modalContentRefData.current.innerHTML;
        const content = modalContentRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                <title>Impressão</title>
                </head>
                <body>
                ${data}
                ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
    
    return(
        <>  
            <Gmodal isOpen={isOpen} onClose={onClose} className={styles.modalGuest}> 
                {data && (
                    <div className={styles.container}>          
                        <div className={styles.borderArea}>
                            <h2>Lista de convidados</h2>
                            <button onClick={onClose}>
                                <AiOutlineClose />
                            </button>
                        </div>

                    <div className={styles.all}>
                        <div className={styles.beforeUl} ref={modalContentRefData}>
                            <div>
                                <p>Data: {formatDate(data.date)} - {formatHours(data.start)} às {formatHours(data.finish)}</p>
                                {data.cleaningService?(
                                    <p>Serviço de limpeza: sim</p>
                                ):(
                                    <p>Serviço de limpeza: não</p>
                                )}
                                <p>{data.apartament}</p>
                                </div>

                            <button onClick={handlePrint} autoFocus={true}>
                                <SlPrinter/>
                            </button>
                        </div>    
                        <ul className={styles.ul} ref={modalContentRef}>
                            {data.guest && data.guest.length > 0 &&(
                                
                                data.guest.map((item, index)=>{
                                    return(
                                        <li key={index}>
                                            {index + 1} - {item.name} - {item.rg}
                                        </li>
                                    )
                                })
                            )}
                        </ul>
                    </div>
                    </div>
                )}
            </Gmodal>
        </>
    )
}