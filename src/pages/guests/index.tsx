import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from './styles.module.scss';
import { useState, useEffect } from "react";
import { SetupApiClient } from "../../services/api";
import {formatDate, formatHours} from "../../utils/formatted";
import { Loading } from "../../components/loading";
import HeaderConcierge from "../../components/headerConcierge";
import Link from "next/link";

interface ReservationProps{
    GuestList:{
        attended:boolean,
        id:string,
        name:string,
        rg:string
    }[];
    apartment:{
        numberApt:string,
        tower:{
            numberTower:string;
        },
    },
    cleaningService:true,
    date:number,
    finish:number,
    start:number,
    id:string,
    name:string,
    phone_number:string,
}
export default function Guests(){
    const [loading, setLoading] = useState(true);
    const [pageOld, setPageOld] = useState(1);
    const [maxPageOld, setMaxPageOld] = useState(1);
    const [pageFuture, setPageFuture] = useState(1);
    const [maxPageFuture, setMaxPageFuture] = useState(1);

    const [oldreservations, setOldReservations] = useState<ReservationProps[]>([]);
    const [futurereservations, setFutureReservations] = useState<ReservationProps[]>([]);
    const [todayreservations, setTodayReservations] = useState<ReservationProps[]>([]);


    const api = SetupApiClient();

    useEffect(()=>{

        async function getItens() {
            const [response, response2, response3] = await Promise.all([
                await api.get("concierge/oldreservations",{
                    params:{
                        per_page:8,
                        page:pageOld
                    }
                }).then((response)=>{
                    setOldReservations(response.data.itens);
                    setMaxPageOld(response.data.maxPages)
                }),
                await api.get("concierge/futurereservations",{
                    params:{
                        per_page:8,
                        page:pageFuture
                    }
                }).then((response)=>{
                    setFutureReservations(response.data.itens);
                    setMaxPageFuture(response.data.maxPages)
                }),
                await api.get("concierge/todayreservations").then((response)=>{
                    setTodayReservations(response.data);
                }),
            ])
            .finally(()=>{
                setLoading(false);
            })
        }

        getItens();
    },[pageOld, pageFuture]);

    const RepaginationOld = () => {
        if (maxPageOld > 1) {
            return (
                <div className={styles.containerRepagination}>
                    {[...Array(maxPageOld)].map((_, index) => (
                        <button className={`${styles.buttonPage} ${index === pageOld - 1 ? styles.active : ''}`} 
                        key={index} onClick={()=>setPageOld(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            );
        } else {
            return null; 
        }
    };

    const RepaginationFuture = () => {
        if (maxPageFuture > 1) {
            return (
                <div className={styles.containerRepagination}>
                    {[...Array(maxPageFuture)].map((_, index) => (
                        <button className={`${styles.buttonPage} ${index === pageFuture - 1 ? styles.active : ''}`} 
                        key={index} onClick={()=>setPageFuture(index + 1)}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            );
        } else {
            return null; 
        }
    };

    if (loading){
        return <Loading/>
    }

    return(
        <>
            <HeaderConcierge/>
            <main className={styles.container}>
                <h1>Controle de presença</h1>
                <section className={styles.section1}>
                    <h2>Reservas de hoje</h2>
                        {todayreservations && todayreservations.length > 0 ?(
                            <>
                            <div className={styles.containerReservations}>
                                {todayreservations.map((item, index)=>(
                                    <>
                                        <Link className={styles.reservation} href={`/guest/${item.id}`} key={item.id}>

                                            <div className={styles.title}>
                                                <h3>{item.name}</h3>
                                                <h3>{formatDate(item.date)}</h3>
                                            </div>

                                            <div className={styles.infos}>
                                                <p>Apartamento {item.apartment.numberApt} - Torre {item.apartment.tower.numberTower}</p>
                                                <p>{item.phone_number}</p>
                                                <p>Serviço de limpeza: {item.cleaningService ? "Sim" : "Não"}</p>
                                                <p>Quantidade de convidados: {item.GuestList.length}</p>
                                            </div>

                                            <div className={styles.hours}>
                                                <p>Inicio: {formatHours(item.start)}</p>
                                                <p>Término: {formatHours(item.finish)}</p>
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                            </>
                        ):(
                            <article className={styles.noContent}>
                                <h3>Não há reservas agendadas para hoje.</h3>
                            </article>
                        )}               
                </section>


                <section className={styles.section2}>
                    <h2>Próximas reservas</h2>
                        {futurereservations && futurereservations.length > 0 ?(
                            <>
                            <div className={styles.containerReservations}>
                                {futurereservations.map((item, index)=>(
                                    <>
                                        <Link className={styles.reservation} href={`/guest/${item.id}`} key={item.id}>

                                            <div className={styles.title}>
                                                <h3>{item.name}</h3>
                                                <h3>{formatDate(item.date)}</h3>
                                            </div>

                                            <div className={styles.infos}>
                                                <p>Apartamento {item.apartment.numberApt} - Torre {item.apartment.tower.numberTower}</p>
                                                <p>{item.phone_number}</p>
                                                <p>Serviço de limpeza: {item.cleaningService ? "Sim" : "Não"}</p>
                                                <p>Quantidade de convidados: {item.GuestList.length}</p>
                                            </div>

                                            <div className={styles.hours}>
                                                <p>Inicio: {formatHours(item.start)}</p>
                                                <p>Término: {formatHours(item.finish)}</p>
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                            {RepaginationFuture()}
                            </>
                        ):(
                            <article className={styles.noContent}>
                                <h3>Até o momento, não houve novas reservas realizadas.</h3>
                            </article>
                        )}               
                </section>

                <section className={styles.section3}>
                    <h2>Reservas anteriores</h2>
                        {oldreservations && oldreservations.length > 0 ?(
                            <>
                            <div className={styles.containerReservations}>
                                {oldreservations.map((item, index)=>(
                                    <>
                                        <Link className={styles.reservation} href={`/guest/${item.id}`} key={item.id}>

                                            <div className={styles.title}>
                                                <h3>{item.name}</h3>
                                                <h3>{formatDate(item.date)}</h3>
                                            </div>

                                            <div className={styles.infos}>
                                                <p>Apartamento {item.apartment.numberApt} - Torre {item.apartment.tower.numberTower}</p>
                                                <p>{item.phone_number}</p>
                                                <p>Serviço de limpeza: {item.cleaningService ? "Sim" : "Não"}</p>
                                                <p>Quantidade de convidados: {item.GuestList.length}</p>
                                            </div>

                                            <div className={styles.hours}>
                                                <p>Inicio: {formatHours(item.start)}</p>
                                                <p>Término: {formatHours(item.finish)}</p>
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                            {RepaginationOld()}
                            </>
                        ):(
                            <article className={styles.noContent}>
                                <h3>Até o momento, nenhuma reserva foi realizada no sistema.</h3>
                            </article>
                        )}               
                </section>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    };
}, [ "porter"]);
