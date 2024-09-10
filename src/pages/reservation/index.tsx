import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/header";
import { Loading } from "../../components/loading";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import styles from "./styles.module.scss";
import Head from "next/head";
import {FaXmark,FaCheck} from "react-icons/fa6";
import { IoPeopleOutline } from "react-icons/io5";
import { formatDate, formatHours } from "../../utils/formatted";
import SetReservationModal from "../../components/modals/modalsReservation/setReservation";
import ViewGuestModal from "../../components/modals/modalsReservation/viewGuest";
import AllTaxedModal from "../../components/modals/modalsReservation/allTaxed";
import DeleteReservationModal from "../../components/modals/modalsReservation/deleteReservation";
import Calendar from "../../components/calendar";
import Chat from "../../components/chat";

type AllReservationsProps = {
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
}[];

type TowersProps = {
  id:string,
  numberTower:string 
  apartment:[]
}[]



export default function Reservation() {
  const [newReservations, setNewReservations] = useState <AllReservationsProps>([]);
  const [trueReservations, setTrueReservations] = useState<AllReservationsProps>([]);
  const [loading, setLoading] = useState(true);
  const [listTowers, setListTowers] = useState <TowersProps>([]);
  const [isOpenSetReservation, setIsOpenSetReservation] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [reservation_id, setReservation_id] = useState('');
  const [isOpenGuest, setIsOpenGuest] = useState(false);
  const [isOpenTaxed, setIsOpenTaxed] = useState (false);
  const [isOpenDeleteReservation, setIsOpenDeleteReservation] = useState(false);
  const [towerFilter, setTowerFilter] = useState<string>('0'); 
  const setupApi = SetupApiClient();
  // --------------------------------------------------------/////////


  useEffect(()=>{

    async function getDate() {

      if (loading || !(isOpenDeleteReservation || isOpenDeleteReservation)){
        try {

          const [response, response2, response3] = await Promise.all([
              await setupApi.get("/adm/reservations"),
              await setupApi.get("/adm/actreservations"),
              await setupApi.get('/towers'),
          ]);
          setNewReservations(response.data);
          setTrueReservations(response2.data);
          setListTowers(response3.data);
        } catch (err) {
          console.log(err)
        }finally{
          setLoading(false);
        }
      }
  }

    getDate();
  },[isOpenSetReservation, isOpenDeleteReservation, loading]);


const closeModalSetReservation = useCallback(() => {
  setReservationStatus(null);
  setReservation_id('');
  setIsOpenSetReservation(false);
}, [setIsOpenSetReservation]);

const openModalSetReservation = useCallback((id: string, status: boolean) => {
  setReservationStatus(status);
  setReservation_id(id);
  setIsOpenSetReservation(true);
}, [setIsOpenSetReservation]);

//---------------------------------------------------------------------------------------------------//
  
const filterTower = towerFilter === "0" ? trueReservations :
trueReservations.filter((item) => item.apartment.tower.id == towerFilter)


function handleChangeFilter(e: React.ChangeEvent<HTMLSelectElement>) {
  setTowerFilter(e.target.value);
}

function openModalGuest(id: string, guest: string) {
  setReservation_id(id);
  setIsOpenGuest(true);
}

function closeModalGuest() {
  setReservation_id('');
  setIsOpenGuest(false);
}

const closeModalDeleteReservation = useCallback(() => {
  setReservation_id('');
  setIsOpenDeleteReservation(false);
}, [setIsOpenDeleteReservation]);

const openModalDeleteReservation = useCallback((id:string) => {
  setReservation_id(id);
  setIsOpenDeleteReservation(true);
}, [setIsOpenDeleteReservation]);


function openTaxed(){
  setIsOpenTaxed(true);
}

function closedTaxed(){
  setIsOpenTaxed(false);
}

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>SalãoCondo - Reservas</title>
      </Head>
      <Chat/>
      <Header/>
      <div className={styles.bodyArea}>
        <main className={styles.container}>
          <h1>Reservas</h1>

            {newReservations.length > 0 ? (
              <section className={styles.section1}>
                <h2>Reservas solicitadas</h2>          
                <div className={styles.cards}>
                  {newReservations.map((item) => (
                    <div key={item.id} className={styles.map}>
                      <div className={styles.card}>
                        <div className={styles.userInfo}>
                          <b>{item.name}</b>
                          <p>Data: {formatDate(item.date)} - {formatHours(item.start)} às {formatHours(item.finish)}</p>
                          {item.cleaningService ?(
                            <p>Serviço de limpeza: sim</p>
                          ):(
                            <p>Serviço de limpeza: não</p>
                          )}
                          <p>Torre {item.apartment.tower.numberTower} - Apartamento {item.apartment.numberApt}</p>
                          <p>Telefone: {item.phone_number}</p>
                          <p style={{fontSize:'14px'}}>{item.email}</p>
                        </div>
                          <div className={styles.buttonSet}>
                            <button className={styles.false} onClick={() => { openModalSetReservation(item.id, false);}}>
                              <span>Recusar</span><FaXmark/>
                            </button>

                            <button className={styles.true} onClick={() => { openModalSetReservation(item.id,true)}}>
                              <span>Aceitar</span><FaCheck/>
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

          <section className={styles.calendarSection}>
            <div className={styles.calendarContainer}>
              <Calendar trueReservations={trueReservations} 
              newReservations={newReservations}/> 
            </div>
          </section>

          {trueReservations.length > 0 ?(
            <section className={styles.section3}>
              <h2>Reservas aceitas</h2>
              <select onChange={handleChangeFilter} className={styles.select}>
                <option value={'0'}>Todas</option>
                {listTowers.length > 0 && (
                  listTowers.map((item, index)=>(
                    <option value={item.id}
                    key={item.id}>Torre {item.numberTower}</option>
                  ))
                )}
              </select>

              <div className={styles.cards}>
                {filterTower.map((item, index)=>{
                  return(
                    <div key={item.id} className={`${styles.card} ${!item.apartment.payment? styles.noPayment : ''}`}>
                      <div className={styles.userInfo}>
                        <b>{item.name}</b>
                        <p>Data: {formatDate(item.date)} - {formatHours(item.start)} às {formatHours(item.finish)}</p>
                        {item.cleaningService ?(
                          <p>Serviço de limpeza: sim</p>
                        ):(
                          <p>Serviço de limpeza: não</p>
                        )}
                        <p>Torre {item.apartment.tower.numberTower} - Apartamento {item.apartment.numberApt}</p>
                        <p>Telefone: {item.phone_number}</p>
                        <p>{item.email}</p>
                      </div>

                      <div className={styles.buttonsCard}>
                        {item.guest ? (
                          <button onClick={() => openModalGuest(item.id, item.guest)} className="buttonSlide">
                            Convidados <IoPeopleOutline/>
                          </button>   
                        ) : null}
                        {item.apartment.payment?(null):(
                          <button onClick={()=>openModalDeleteReservation(item.id)}className="buttonSlide">
                            Deletar<FaXmark/>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
          </section>
          ):null}
          

          <section className={styles.section4}>
            <h2>Taxados</h2>
            <button onClick={openTaxed} className="buttonSlide">
                    Reservas taxadas
              </button>
          </section>
        </main>
      </div>


      {/*- ------Modal aprovar ou recusar reservas ------------------ */}
      <SetReservationModal 
      isOpen={isOpenSetReservation} 
      onClose={closeModalSetReservation}
      reservation_id={reservation_id}
      reservationStatus={reservationStatus}/>

      {/* -------------Modal ver lista de convidados -------------------*/}

      <ViewGuestModal
        isOpen={isOpenGuest}
        onClose={closeModalGuest}
        idViewGuest={reservation_id}
        /> 

        {/* -------------Modal ver taxados  -------------------*/}
        <AllTaxedModal
        onClose={closedTaxed}
        isOpen={isOpenTaxed}
        />

        
      {/*- ------Modal deletarReservas ------------------ */}
      <DeleteReservationModal
        isOpen={isOpenDeleteReservation}
        onClose={closeModalDeleteReservation}
        reservation_id={reservation_id}
      />
    </>
  );
}


export const getServerSideProps = canSSRAuth (async ()=>{
  return{
    props:{}
  }
})