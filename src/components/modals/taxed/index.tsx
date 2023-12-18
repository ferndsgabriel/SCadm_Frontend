import { SetupApiClient } from "../../../services/api";
import {useState, useEffect, useRef} from "react";
import styles from "./styles.module.scss";
import {AiOutlineClose} from "react-icons/ai"
import {formatDate, formatHours} from "../../../utils/formatted";

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

interface AllTaxedProps {
    closeFunction: () => void;
}

export const AllTaxed = ({ closeFunction }: AllTaxedProps) => {
    const SetupApi = SetupApiClient();
    const [taxed, setTaxed] = useState <taxedType[]> ([]);
    const modalContentRefData = useRef(null);

    useEffect (()=>{
        async function handleTaxed(){
            try{
                const response = await SetupApi.get('/adm/taxed');
                setTaxed(response.data)
                console.log(taxed)
            }catch(err){
                console.log('Erro ao buscar dados da api')
            }
        }

        handleTaxed();
    },[]);

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
        <div className={styles.container}>
            <div className={styles.taxed}>
                <div className={styles.borderArea}>
                    <h2>Lista de taxados</h2>
                    <button onClick={closeFunction}>
                        <AiOutlineClose />
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
            <div className={styles.buttonImpression}>
                <button
                onClick={handlePrint} autoFocus={true}>Imprimir</button>
            </div>
        </div>
    </div>
    )
}