import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/header";
import { Loading } from "../../components/loading";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {FaXmark,FaCheck} from "react-icons/fa6";
import { IoPeopleOutline } from "react-icons/io5";
import { formatDate, formatHours } from "../../utils/formatted";
import SetReservationModal from "../../components/modalsReservation/setReservation";
import ViewGuestModal from "../../components/modalsReservation/viewGuest";
import AllTaxed from "../../components/modalsReservation/allTaxed";
import DeleteReservationModal from "../../components/modalsReservation/deleteReservation";

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
  const [calendar, setCalendar] = useState([]);
  const monthNow = new Date().getMonth();
  const yearNow = new Date().getFullYear();
  const [monthCalendar, setMonthCalendar] = useState(monthNow);
  const [yearCalendar, setYearCalendar] = useState(yearNow);
  const [nextMonthBoolean, setNextMonthBoolean] = useState(false);


  const monthString = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const [reservationTrueCalendar, SetReservationTrueCalendar] = useState([]);
  const [reservationNewCalendar, setReservationNewCalendar] = useState([]);
  const [daysBefore, setDaysBefore] = useState([]);
  const [listTowers, setListTowers] = useState <TowersProps>([]);
  const [isOpenSetReservation, setIsOpenSetReservation] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [reservation_id, setReservation_id] = useState('');
  const [isOpenGuest, setIsOpenGuest] = useState(false);
  const [isOpenTaxed, setIsOpenTaxed] = useState (false);
  const [isOpenDeleteReservation, setIsOpenDeleteReservation] = useState(false);
  const [towerFilter, setTowerFilter] = useState<string>('0'); 
  // --------------------------------------------------------/////////


  useEffect(()=>{

    async function getDate() {

      if (loading || !isOpenDeleteReservation || !isOpenDeleteReservation){
        try {
          const setupApi = SetupApiClient();
          const response = await setupApi.get("/adm/reservations");
          const response2 = await setupApi.get("/adm/actreservations");
          const response3 = await setupApi.get('/towers');

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


  // -----------------------Passar para o formato data minhas datas number --------------------------/////////
  function formatInDate(date: number) {
    if (date !== null) {
      const dateString = date.toString();
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const monthInt = parseInt(month);
      const inDate = new Date();
      inDate.setDate(parseInt(day));
      inDate.setFullYear(parseInt(year));
      inDate.setMonth(monthInt - 1);
      return inDate;
    }
  }

  useEffect(() => {
    const formatByTrue = trueReservations.map((item) => formatInDate(item.date));
    SetReservationTrueCalendar(formatByTrue);

    const formatByNew = newReservations.map((item) => formatInDate(item.date));
    setReservationNewCalendar(formatByNew);

    const onDay = new Date();
    const lastDay = onDay.getDate();

    for (var x = 1; x <= lastDay; x++) {
      const days = new Date();
      days.setDate(x);
      setDaysBefore((prevDays) => [...prevDays, new Date(days)]);
    }
  }, [newReservations, trueReservations]);

  // -------------------- Alterar o mês  -----------------------/////////
  function changeMonth(number: number) {
    setNextMonthBoolean(!nextMonthBoolean);
    const newMonth = monthCalendar + number;
    if (newMonth > 11) {
      setMonthCalendar(0);
      setYearCalendar(yearCalendar + 1);
    } else {
      setMonthCalendar(newMonth);
    }
    if (newMonth < 0) {
      setMonthCalendar(11);
      setYearCalendar(yearCalendar - 1);
    }
  }

  // -------------------- Renderizar calendario -----------------------/////////
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(monthCalendar);
    currentDate.setFullYear(yearCalendar);

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const newCalendar = [];
    let dayOfMonth = 1;

    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          row.push(null);
        } 
      else if (dayOfMonth <= daysInMonth) {

          const isNew = reservationNewCalendar.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          const isTrue = reservationTrueCalendar.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          const daysPast = daysBefore.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          row.push({ day: dayOfMonth, isTrue, isNew, daysPast });
          dayOfMonth++;
        } else {
          row.push(null);
        }
      }
      newCalendar.push(row);
    }
    setCalendar(newCalendar);
  }, [monthCalendar, reservationTrueCalendar, reservationNewCalendar, yearCalendar]);

//---------------------------------------------------------------------------------------------------------///

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

          <section className={styles.section2}>
            <div className={styles.calendarArea}>

              <article className={styles.dateInfo}>
                <button onClick={() => changeMonth(-1)} disabled={!nextMonthBoolean}><AiOutlineLeft /></button>
                <p>{monthString[monthCalendar]} - {yearCalendar}</p>
                <button onClick={() => changeMonth(+1)} disabled={nextMonthBoolean}><AiOutlineRight /></button>
              </article>

            <table className={styles.calendar}>
              <thead>
                <tr>
                  <th>Dom</th>
                  <th>Seg</th>
                  <th>Ter</th>
                  <th>Qua</th>
                  <th>Qui</th>
                  <th>Sex</th>
                  <th>Sáb</th>
                </tr>
              </thead>
              <tbody>
                {calendar.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`}>
                        {cell ? (
                          <span
                            style={{
                              backgroundColor: cell.isTrue ? '#51AB7B' : (cell.isNew ? '#405971' : ''),
                              color: cell.isTrue ? 'white' : (cell.isNew ? 'white' : (cell.daysPast ? 'gray' : '')),
                              pointerEvents: cell.isTrue || cell.isNew || cell.daysPast ? 'none' : 'auto',
                            }}
                          >
                            {cell.day}
                          </span>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <article className={styles.legends}>
              <p style={{ color: "#51AB7B", fontSize: '1.2rem' }}>Aprovadas</p>
              <p style={{ color: '#405971', fontSize: '1.2rem' }}>Aguardando resposta</p>
            </article>
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
        <AllTaxed 
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