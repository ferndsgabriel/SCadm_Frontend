import Gmodal  from "../../myModal";
import { useState, useRef , useEffect} from "react";
import { SetupApiClient } from "../../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineClose } from "react-icons/ai";
import {formatDate, formatHours} from "../../../utils/formatted";
import { SlPrinter } from "react-icons/sl";
import { Loading } from "../../loading";

type reservationGuestType =  {
    id: string,
    date: number,
    start: number,
    finish: number,
    cleaningService: boolean,
    guest: string | null,
    name:string,
    email:string,
    phone_number:string,
    apartment: {
        id: string,
        numberApt: string,
        payment: boolean,
        tower: {
            id:string,
            numberTower:string
        },
        user:{
            name:string,
            lastname:string,
            email:string,
            phone_number:string
        }
    }
}



export default function ViewGuestModal({isOpen, onClose,  idViewGuest}){
    const apiClient = SetupApiClient();
    const [loadingPage, setLoadingPage] = useState(true);
    const [listGuest, setListGuest] = useState<reservationGuestType | null>(null);
    const [guestInList, setGuestInList] = useState<string[]>([]);
    const modalContentRef = useRef(null);
    const modalContentRefData = useRef(null);

    useEffect(()=>{
        async function getGuest() {
            try {
                const response = await apiClient.post('/adm/guets', {
                reservation_id: idViewGuest,
            });
            setListGuest(response.data);
            setGuestInList(response.data.guest.split(','));
            } catch (error) {
                console.error('API Error:', error);
                console.log(listGuest)
            }
        }

        if (isOpen && idViewGuest !== ''){
            try{
                getGuest();
            }catch(error){
                console.log(error)
            }finally{
                setLoadingPage(false);
            }
        }
    }, [isOpen]);

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
            {isOpen ?(
                loadingPage?(
                    <Loading/>
                ):(
                    <Gmodal isOpen={isOpen} onClose={onClose} className={styles.modalGuest}>
                        {listGuest ?(
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
                                        <p><b>{listGuest.name}</b> - {listGuest.phone_number}  </p>
                                        <p>Data: {formatDate(listGuest.date)} - {formatHours(listGuest.start)} às {formatHours(listGuest.finish)}</p>
                                        {listGuest.cleaningService?(
                                            <p>Serviço de limpeza: sim</p>
                                        ):(
                                            <p>Serviço de limpeza: não</p>
                                        )}
                                        <p>Torre {listGuest.apartment.tower.numberTower} - Apartamento {listGuest.apartment.numberApt}</p>
                                        </div>

                                    <button onClick={handlePrint} autoFocus={true}>
                                        <SlPrinter/>
                                    </button>
                                </div>    
                                <ul className={styles.ul} ref={modalContentRef}>
                                    {guestInList.map((item, index)=>{
                                        return(
                                            <li key={index}>
                                                {index + 1} - {item}
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