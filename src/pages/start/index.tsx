import Head from "next/head";
import Header from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import style from "./styles.module.scss";
import { SetupApiClient } from "../../services/api";
import { useState, useEffect, FormEvent} from "react";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { FaSpinner } from "react-icons/fa";
import {AiOutlineSearch} from "react-icons/ai";
import {BiEdit} from "react-icons/bi";
import {FaXmark,FaCheck} from "react-icons/fa6";
import { Loading } from "../../components/loading";
import { MdFilterListOff } from "react-icons/md";



type UserProps = {
  cpf: string,
  id: string,
  name: string,
  lastname: string,
  email: string,
  photo: null | string,
  accountStatus: boolean,
  phone_number: string,
  apartment_id: string,
  apartment: {
    numberApt: string,
    tower_id: string,
    payment: boolean,
    payday: Date,
    tower: {
      numberTower:string
    }
  }
}
type AptProps = {
  id: string;
  numberApt: string;
  tower_id: string;
  user: any[]; 
}
type TowersProps = {
  id:string,
  numberTower:string 
  apartment:[]
}
interface UserPropsInterface {
  newUsers: UserProps[];
  allUsers: UserProps[];
  Alltowers: TowersProps[];
  AllApts:AptProps[];
}

export default function start({newUsers, allUsers, Alltowers, AllApts}:UserPropsInterface) {
const [allUsersRequest, SetAllUserRequest] = useState (newUsers);
const [allResidents, SetAllResidents] = useState (allUsers);
const [allTowersList, setAllTowersList] = useState(Alltowers);
const [allAptList, setAllAptList] = useState(AllApts);
const [accountStatus, setAccountStatus] = useState(null);
const [isOpenNewUsers, setIsOpenNewUsers] = useState (false);
const [idNewUsers, setIdNewUsers] = useState ('');
const [searchResident, setSearchResident] = useState('');
const [isLoading, setIsLoading] = useState(true); //pagamento automatico spinner
const [isOpenPayment, setIsOpenPayment] = useState(false);
const [apartament_id, setapartament_id] = useState ('');
const [isOpenEditApt, setIsOpenEditApt] = useState (false);
const [user_id, setUserId] = useState('');
const [towerAptEditIndex, setTowerAptEditIndex] = useState(0);
const [aptEditIndex, setAptEditIndex] = useState(0);
const [loadingPage, setLoadingPage] = useState (true);
const [indexFilter, setIndexFilter] = useState(0);
const [isOpenFilterByTower, setIsOpenFilterByTower] = useState(false);
const [towerFilter, setTowerFilter] = useState(0);



const SetupApi = SetupApiClient();

async function refreshDate(){
  try{
      const response = await SetupApi.get("/adm/users");
      const response2 = await SetupApi.get("/adm/filter");
      SetAllUserRequest(response.data);
      SetAllResidents(response2.data);
      setLoadingPage(false)
  }catch(err){
    console.log('Erro ao obter dados do servidor');
    setTimeout(refreshDate, 500);
  }
}

useEffect(()=>{
  refreshDate();
},[]);

Modal.setAppElement('#__next');

//------------------- -Aprovar ou recusar novos moradores ------------------------//
function openModalNewUsers(id:string, setAccount:boolean) {
    setAccountStatus(setAccount);
    setIsOpenNewUsers(true);
    setIdNewUsers(id);
}

function closeModalNewUsers() {
  setIsOpenNewUsers(false);
  setAccountStatus(null);
  setIdNewUsers('');
}

async function handleNewUser(){
  try{
    await SetupApi.put("/adm/useron",{
        id:idNewUsers,
        accountStatus:accountStatus
    });  
    toast.success("Ação executada!");
    refreshDate();
    closeModalNewUsers();
  }catch(error){
    toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
  }
}
//--------------------Alterar pagamento -------------------------//

function openModalPayment(id:string){
  setIsOpenPayment(true);
  setapartament_id(id);
}

function closeModalPayment(){
  setapartament_id('');
  setIsOpenPayment(false);
}

async function handlePayment(){
    try{
      await SetupApi.put("/adm/setpayment",{
          apartment_id:apartament_id
      })
      toast.success("Pagamento alterado com êxito!");
      refreshDate();

      closeModalPayment();
    }catch(error){
      console.log(error)
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }  
}

//-------------------- Pagamento automatico -------------------------//
async function aumationPayment(){
  setIsLoading(false);

  try{
    await SetupApi.put('/adm/automation');
    setIsLoading(true);
  }catch(error){
    console.log(error)
    toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
  }
  refreshDate();
}

//-------------------- editar apartamento -------------------------//

function openModalEditApt(id:string){
  setUserId(id);
  setIsOpenEditApt(true);
}
function closeModalEditApt(){
  setUserId('');
  setAptEditIndex(0);
  setTowerAptEditIndex(0);
  setIsOpenEditApt(false);

}

function changeOptionTower(e:React.ChangeEvent<HTMLSelectElement>){
  const indexOption = parseInt (e.target.value);
  setAptEditIndex(0);
  setTowerAptEditIndex(indexOption);
}
function changeOptionApt(e:React.ChangeEvent<HTMLSelectElement>){
  const indexOption = parseInt (e.target.value);
  setAptEditIndex(indexOption);
}

async function handleEditApt(e:FormEvent){
  e.preventDefault();
  const allAptInTower = allAptList.filter((item)=>item.tower_id === 
  allTowersList[towerAptEditIndex].id
  );

  const idApt = allAptInTower[aptEditIndex].id;
  try{
    await SetupApi.put('/adm/aptuser',{
      apartment_id:idApt ,
      user_id:user_id
    });
    toast.success('Apartamento alterado com sucesso!');
    refreshDate();
    closeModalEditApt();
  }catch(error){
    console.log(error)
    toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
  }
}


//-------------------- Filters -------------------------//
const filterByName = allResidents.filter((item) => {
  const fullName = `${item.name} ${item.lastname}`;
  return (
    item.name.toLowerCase().includes(searchResident.toLowerCase()) ||
    fullName.toLowerCase().includes(searchResident.toLowerCase())
  );
});

const filterByTower = allResidents.filter((item) => {
  return item.apartment.tower_id === allTowersList[towerFilter].id;
});

const filterPayment = allResidents.filter((item)=>{
  return item.apartment.payment === true
});

const filterNoPayment = allResidents.filter((item)=>{
  return item.apartment.payment === false
});

const filteredUsers = [filterByName, filterByTower, filterPayment, filterNoPayment ];

//------------------------- alterar a torre do filtro -------------------//
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

//--------------------/////////////////// -------------------------//
if (loadingPage){
  return <Loading/>
}

  return(
    <>
      <Head>
        <title>SalãoCondo - Início</title>
      </Head>
      <Header/>
    <main className={style.container}>
      <h1>Moradores</h1>
      {allUsersRequest.length > 0 ? (
        <section className={style.newUsers}>
          <h2>Novos moradores</h2>
          <div className={style.cards}>
          {allUsersRequest.map((item)=>{
            return(
              <article key={item.id} className={style.card}> 
                <div className={style.UserArea} >
                  <p><b>{item.name} {item.lastname}</b></p>
                  <p>CPF: {item.cpf} </p>
                  <p>Torre {item.apartment.tower.numberTower} - apartamento {item.apartment.numberApt} </p>
                  <p style={{fontSize:'14px'}}>{item.email}</p>
              </div>
              <div className={style.buttonUser}>
                <button onClick={() => { openModalNewUsers(item.id, true); 
                  }}><p>Aceitar</p> <FaCheck/>
                </button>
                <button onClick={() => { openModalNewUsers(item.id, false);
                  }}><p>Recusar</p> <FaXmark/>
                </button>
              </div>
            </article>
            )
          })}
          </div> 

      </section>
    ):null}

      <section className={style.residents}>
        <h2>Controle de moradores</h2>

        <article className={style.filters}>
          {indexFilter > 0 ?
          null:(
            <label className={style.inputLabel}>
              <input type="text" autoFocus={true} 
              value={searchResident} onChange={(e) => setSearchResident(e.target.value)}
              placeholder="Digite um nome:"/>
              <AiOutlineSearch/>
            </label>
          )}

          <select value={indexFilter} onChange={handleChangeFilter} className={style.select}>
            <option value={0}>Todos</option>
            <option value={1}>Torre</option>
            <option value={2}>Adimplentes</option>
            <option value={3}>Inadimplentes</option>
          </select>
        </article>

        <label className={style.AreaAutomation} tabIndex={1}>
            <button className={style.automation}
              disabled={!isLoading}
              onClick={aumationPayment}>
            {isLoading ?(
              <p className={style.p}>Atualizar pagamentos</p> 
            ):(
              <p className={style.p}>Atualizar pagamentos <FaSpinner/></p> 
            )}

            </button>
          <div className={style.alert}>
            <p>Este botão verifica todos os usuários cujos pagamentos estão ativos por mais
              de 30 dias e altera seu status para 'inativo'.</p>
          </div>
        </label>


        {allResidents.length > 0 ? (
          <div className={style.allcards}>
            {filteredUsers[indexFilter].map((item) => {
                return (
                    <div  className={style.cards} key={item.id}>
                      <div className={style.cardData}>
                          <div>
                          <p>
                            <b> {item.name} {item.lastname}</b>
                          </p>
                          {item.apartment.payment? (
                            <p>Status: adimplente</p>
                          ) : (
                            <p>Status: inadimplente</p>
                          )}
                          <div className={style.editApt}>
                          <p>Torre {item.apartment.tower.numberTower} - apartamento {item.apartment.numberApt} </p> 
                            <button onClick={() =>openModalEditApt(item.id)}>
                              <BiEdit/>
                            </button>
                          </div>
                            
                          
                          {item.phone_number ? (
                            <p>Contato: {item.phone_number}</p>
                          ) : null}
                          <p style={{fontSize:'14px'}}> {item.email}</p>

                        </div>
                        {item.photo? (
                          <div className={style.photoArea}>
                            <img src={`https://drive.google.com/uc?export=view&id=${item.photo}`} />
                          </div>
                        ) : null}
                      </div>
                        <button onClick={()=>openModalPayment(item.apartment_id)} className={style.button}>
                          <p>Alterar status de pagamento</p></button> 
                    </div >        
                  );
                  
                })}
            </div>
            
          ) : (
            <p>Não há nenhum morador cadastrado</p>
          )}
        </section>
      </main>


    {/*------------------------------------Modal novos usuarios*/}
    <Modal isOpen={isOpenNewUsers}
        onRequestClose={closeModalNewUsers}
        className='modal'
        style={{overlay:{
          backgroundColor: 'rgba(64, 89, 113, 0.4)'
          }}}>   
        <div className='modalContainer'>     
          <div className='beforeButtons'>
            <h3>Validação</h3>
            {accountStatus?(
              <p>Você tem certeza de que deseja aprovar este usuário?</p>
            ):(
              <p>Você tem certeza de que deseja recusar este usuário? </p>
            )}
          </div>
          <div className='buttonsModal'>
              <button onClick={handleNewUser} className='true'><span>Confirmar</span></button>
              <button onClick={closeModalNewUsers}className='false'><span>Cancelar</span></button> 
          </div>
        </div>
      </Modal>
      {/*------------------------------------Modal pagamento apt */}
      <Modal isOpen={isOpenPayment}
        onRequestClose={closeModalPayment}
        className='modal'
        style={{overlay:{
        backgroundColor: 'rgba(64, 89, 113, 0.4)'
        }}}>
        <div className='modalContainer'> 
          <div className='beforeButtons'>
              <h3>Alterar Pagamento</h3>
              <p>Tem certeza de que deseja modificar o pagamento deste usuário?</p>
          </div>  
          <div className='buttonsModal'>
              <button onClick={handlePayment} className='true' autoFocus={true}><span>Confirmar</span></button>
              <button onClick={closeModalPayment} className='false'><span>Cancelar</span></button>   
          </div> 
        </div>
      </Modal>
      {/*------------------------------------Modal editar apt */}
      <Modal isOpen={isOpenEditApt}
      onRequestClose={closeModalEditApt}
      className='modal'
      style={{overlay:{
        backgroundColor: 'rgba(64, 89, 113, 0.4)'
        }}}>
          <form className='modalContainer' onSubmit={handleEditApt}>
            <div className='beforeButtons'>
              <h3>Editar apartamento</h3>
              <p>Tem certeza de que deseja alterar o apartamento do usuário?
              </p>

              <div className="modalOptions">
                <select value={towerAptEditIndex} onChange={changeOptionTower}>
                  {allTowersList.filter((item)=>item.apartment.length >0
                  ).map((item, index)=>{
                    return(
                      <option key={item.id} value={index}>
                        Torre - {item.numberTower}
                      </option>
                    )
                  })}
                </select>

                <select value={aptEditIndex} onChange={changeOptionApt}>
                  {allAptList.filter((item)=>item.tower_id === allTowersList[towerAptEditIndex].id
                  ).map((item, index)=>{
                    return(
                      <option key={item.id} value={index}>
                        Apartamento - {item.numberApt}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className='buttonsModal'>
              <button type="submit" className='true' autoFocus={true}><span>Confirmar</span></button>
              <button onClick={closeModalEditApt} className='false'><span>Cancelar</span></button>   
            </div>
          </form>
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
                {allTowersList.filter((item)=>item.apartment.length > 0
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
              <button onClick={closeMModalFilterByTower} className='false'><span>Cancelar</span></button>   
          </div> 
        </div>
      </Modal>
    </>
    )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
      try {
        const SetupApi = SetupApiClient(ctx);
        const response = await SetupApi.get("/adm/users");
        const response2 = await SetupApi.get("/adm/filter");
        const response3 = await SetupApi.get('/towers');
        const response4 = await SetupApi.get('/apts');
        console.log(response.data)
        return {
          props: {
            newUsers: response.data,
            allUsers: response2.data,
            Alltowers:response3.data,
            AllApts:response4.data
          },
        };
      } catch (error) {
      console.error('Erro ao obter dados da api');
      return {
          props: {
            newUsers: [],
            allUsers: [],
            Alltowers:[],
            AllApts:[]
          },
      };
  }
});
