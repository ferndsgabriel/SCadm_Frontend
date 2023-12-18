import Head from "next/head";
import Header from "../../components/header";
import style from "./styles.module.scss";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { useState, useEffect} from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { IoPeopleOutline } from "react-icons/io5";
import {FaXmark,FaCheck} from "react-icons/fa6";
import { Loading } from "../../components/loading";
import { ViewGuest } from "../../components/modals/guest";
import {AllTaxed} from "../../components/modals/taxed";
import {formatDate, formatHours} from "../../utils/formatted";

type ReservationsProps = {
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

type TowersProps = {
  id:string,
  numberTower:string 
  apartment:[]
}

interface ReservationInterface {
  newReservations: ReservationsProps[];
  reservationTrue: ReservationsProps[];
  towers:TowersProps[];
}

export default function reservation({  newReservations, reservationTrue, towers }: ReservationInterface) {
  Modal.setAppElement('#__next');
  const [listNewReservations, setListNewReservations] = useState (newReservations || null);
  const [listReservationsTrue, SetListReservationsTrue] = useState (reservationTrue || null);
  const [listTowers, setListTowers] = useState(towers || null);
  const [isOpenSetReservation, setIsOpenSetReservation] = useState(false);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [reservation_id, setReservation_id] = useState('');
  const [isOpenGuest, setIsOpenGuest] = useState(false);
  const [isOpenTaxed, setIsOpenTaxed] = useState (false);
  const [loadingPage, setLoadingPage] = useState (true);
  const [indexFilter, setIndexFilter] = useState(0);
  const [isOpenFilterByTower, setIsOpenFilterByTower] = useState(false);
  const [towerFilter, setTowerFilter] = useState(0);
  const [isOpenDeleteReservation, setIsOpenDeleteReservation] = useState(false);

  const setupApi = SetupApiClient();

  async function refreshDate(){
    try{
        const response = await setupApi.get("/adm/reservations");
        const response2 = await setupApi.get("/adm/actreservations");
        setListNewReservations(response.data);
        SetListReservationsTrue(response2.data);
        setLoadingPage(false)
    }
    catch(err){
      console.log('Erro ao obter dados do servidor');
      setTimeout(refreshDate, 500);
    }
  }

  useEffect(()=>{
      refreshDate();
  },[]);


  //--------------------- Deletar ou aprovar reservas ------------------------//

  function openModalSetReservation(id: string, status: boolean) {
    setReservationStatus(status);
    setReservation_id(id);
    setIsOpenSetReservation(true);
  }

  function closeModalSetReservation() {
    setReservationStatus(null);
    setReservation_id('');
    setIsOpenSetReservation(false);
  }

  async function handleSetReservation() {
    if (!reservation_id || reservationStatus === null){
      toast.warning('Informe os dados!');
    }
    try {
      await setupApi.put('/adm/setreservations', {
        reservation_id: reservation_id,
        status:reservationStatus,
      });
      if (reservationStatus){
        toast.success("Reserva aprovada :) ");
      }else{
        toast.success("Reserva recusada :( ");
      }
      refreshDate();
      closeModalSetReservation()
    } 
    catch (error) {
      console.log(error);
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
  }
  
  //--------------------- Ver lista de convidados ------------------------//

  function openModalGuest(id: string, guest: string) {
    setReservation_id(id);
    setIsOpenGuest(true);
  }

  function closeModalGuest() {
    setReservation_id('');
    setIsOpenGuest(false);
  }
  

 //--------------------- Ver lista de taxados ------------------------//

  function openTaxed(){
    setIsOpenTaxed(true);
  }

  function closedTaxed(){
    setIsOpenTaxed(false);
  }
   //---------------------------------------------------//
  const filterAll = listReservationsTrue;
  
  
  const filterByTower = listReservationsTrue.filter((item) => {
    return item.apartment.tower.id === listTowers[towerFilter].id;
  });
  
  const filteredUsers = [filterAll, filterByTower];

  function handleChangeFilter(e:React.ChangeEvent<HTMLSelectElement>){
    const indexOption = parseInt(e.target.value);
    if (indexOption === 1){
      openModalFilterByTower();
    }
    setIndexFilter(indexOption);
  }
  
  function openModalFilterByTower(){
    setIsOpenFilterByTower(true);
  }
  function closeMModalFilterByTower(){
    setIsOpenFilterByTower(false);
    setIndexFilter(0);
    setTowerFilter(0);
  }
  function changeTowerFilter(e:React.ChangeEvent<HTMLSelectElement>){
    const indexOption = parseInt(e.target.value);
    setTowerFilter(indexOption);
  }


  //--------------------- Deletar reservas -------------------------//

  function openModalDeleteReservation(id:string){
    setReservation_id(id);
    setIsOpenDeleteReservation(true);
  }

  function closeModalDeleteReservation(){
    setReservation_id('');
    setIsOpenDeleteReservation(false);
  }

  async function handleDeleteReservation(){
    try{
      await setupApi.delete('/adm/reservation',{
        data:{
          reservation_id:reservation_id
        }
      })
      toast.success('Reserva cancelada com sucesso.');
      refreshDate();
      closeModalDeleteReservation();
    }catch(error){
      console.log(error);
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
  }
   //--------------------------------------------------//
  if (loadingPage){
    return <Loading/>
  }

  return (
    <>
      <Head>
        <title>SalãoCondo - Agendamentos</title>
      </Head>
      {isOpenGuest || isOpenTaxed? null :<Header />}

      <main className={style.container}>
        <h1>Reservas</h1>
          {listNewReservations.length > 0 ? (
            <section className={style.section1}>
              <h2>Reservas solicitadas</h2>          
              <div className={style.allCards}>
                {listNewReservations.map((item) => (
                  <div key={item.id} className={style.map}>
                    <div className={style.card}>
                      <div className={style.userArea}>
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
                        <div className={style.buttons}>
                          <button onClick={() => { openModalSetReservation(item.id, 
                            false); 
                            }}>
                          <p>Recusar</p><FaXmark/></button>
                          <button onClick={() => { openModalSetReservation(item.id, 
                            true)}}>
                          <p>Aceitar</p> <FaCheck/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          
          {listReservationsTrue.length > 0 ?(
            <section className={style.section2}>
              <h2>Reservas aceitas</h2>
              <div>
              <select value={indexFilter} onChange={handleChangeFilter} className={style.select}>
                <option value={0}>Todas</option>
                <option value={1}>Torre</option>
              </select>
              </div>
              <div className={style.allcards2}>
                {filteredUsers[indexFilter].map((item, index)=>{
                  return(
                    <div key={item.id} className={style.card} style={{ backgroundColor: item.apartment.payment ? '' : '#f14a4a' }}>
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
                      <div className={style.buttonsCard}>
                        {item.guest ? (
                          <button onClick={() => openModalGuest(item.id, item.guest)}>
                            <p>Convidados </p> <IoPeopleOutline/>
                          </button>   
                        ) : null}
                        {item.apartment.payment?(null):(
                          <button onClick={()=>openModalDeleteReservation(item.id)}><p>Deletar</p><FaXmark/></button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
          </section>
          ):null}

          <article className={style.taxed}>
            <button onClick={openTaxed}>
                  Reservas canceladas com taxa
            </button>
          </article>
      </main>
      

      {/*- ------Modal aprovar ou recusar reservas ------------------ */}
      <Modal
      style={{overlay:{
      backgroundColor: 'rgba(64, 89, 113, 0.4)'
      }}}
      isOpen={isOpenSetReservation}
      onRequestClose={closeModalSetReservation}
      className='modal'
      > 
        <div className='modalContainer'>
          <div className='beforeButtons'>
            <h3>Validar reserva</h3>
            {reservationStatus?(
            <p>Tem certeza de que deseja aprovar a reserva?</p>
            ):(
              <p>Tem certeza que deseja recusar a reserva?</p>
            )}
          </div>
          <div className='buttonsModal'>
            <button onClick={handleSetReservation} className='true' autoFocus={true}><span>Confirmar</span></button>
            <button onClick={closeModalSetReservation} className='false'><span>Cancelar</span></button>
          </div>
        </div>
        </Modal>

        {/* -------------Modal ver lista de convidados -------------------*/}
        <Modal
          isOpen={isOpenGuest}
          onRequestClose={closeModalGuest}
          className={style.modalGuest}
          style={{overlay:{
            backgroundColor: 'rgba(64, 89, 113, 0.4)'
            }}}>
            <ViewGuest idViewGuest={reservation_id} closeModal={closeModalGuest}/>
        </Modal>

        {/* -------------Modal ver taxados  -------------------*/}
        <Modal isOpen={isOpenTaxed}
        onRequestClose={closedTaxed}
        style={{overlay:{
        backgroundColor: 'rgba(64, 89, 113, 0.4)',
        }}}
        className={style.modalTaxed}>
          <AllTaxed closeFunction={closedTaxed}/>
        </Modal>

      {/*- ------Modal deletarReservas ------------------ */}
      <Modal
      style={{overlay:{
      backgroundColor: 'rgba(64, 89, 113, 0.4)'
      }}}
      isOpen={isOpenDeleteReservation}
      onRequestClose={closeModalDeleteReservation}
      className='modal'
      > 
        <div className='modalContainer'>
          <div className='beforeButtons'>
            <h3>Deletar reserva</h3>
            <p>
            Reserva associada a um apartamento antes adimplente,
            agora está vinculada a um condomínio inadimplente.
            Deseja prosseguir com a exclusão?
            </p>
          </div>
          <div className='buttonsModal'>
            <button onClick={handleDeleteReservation} className='true' autoFocus={true}><span>Confirmar</span></button>
            <button onClick={closeModalDeleteReservation} className='false'><span>Cancelar</span></button>
          </div>
        </div>
        </Modal>

        {/*----------------------Filtrar por torre------------------------------*/}
        <Modal isOpen={isOpenFilterByTower}
        onRequestClose={closeMModalFilterByTower}
        className='modal'
        style={{overlay:{
        backgroundColor: 'rgba(64, 89, 113, 0.4)'
        }}}>
        <div className='modalContainer'> 
          <div className='beforeButtons'>
              <h3>Filtrar por torre</h3>
              <p>Selecione a torre</p>
              <select value={towerFilter} onChange={changeTowerFilter}autoFocus={true}>
                {listTowers.filter((item)=>item.apartment.length > 0
                ).map((item, index)=>{
                  return(
                    <option key={item.id} value={index}>
                      {item.numberTower}
                    </option>
                  )
                })}
              </select>
          </div>
          
          <div className='buttonsModal'>
              <button onClick={()=>setIsOpenFilterByTower(false)} className='true'><span>Filtrar</span></button>
              <button onClick={closeMModalFilterByTower} className='false'><span>Não</span></button>   
          </div> 
        </div>
      </Modal>
    </>
    );
  }



export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = SetupApiClient(ctx);
    const response = await apiClient.get("/adm/reservations");
    const response2 = await apiClient.get("/adm/actreservations");
    const response3 = await apiClient.get('/towers');
    console.log(response.data)
    return {
      props: {
        newReservations: response.data,
        reservationTrue: response2.data,
        towers:response3.data,
      },
    };
  } catch (error) {
  console.error('Erro ao obter dados da api');
  return {
      props: {
        newReservations: [],
        reservationTrue: [],
        towers:[]
      },
  };
}
});

