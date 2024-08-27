import Head from "next/head";
import Header from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import style from "./styles.module.scss";
import { SetupApiClient } from "../../services/api";
import { useState, useEffect, useCallback, useMemo} from "react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import {AiOutlineSearch} from "react-icons/ai";
import {BiEdit} from "react-icons/bi";
import {FaXmark,FaCheck } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";
import { Loading } from "../../components/loading";
import NewUsersModal from "../../components/modals/modalsUsers/newUsers";
import ChangeStatesModal from "../../components/modals/modalsUsers/changeStates";
import EditAptUsersModal from "../../components/modals/modalsUsers/editApt";
import FilterUserModal from "../../components/modals/modalsUsers/filterUsersByTower";

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
}[];

type AptProps = {
  id: string;
  numberApt: string;
  tower_id: string;
  user: any[]; 
}[]
type TowersProps = {
  id:string,
  numberTower:string 
  apartment:[]
}[]


export default function start() {
const [allUsersRequest, SetAllUserRequest] = useState <UserProps>([]);
const [allResidents, SetAllResidents] = useState <UserProps>([]);
const [allTowersList, setAllTowersList] = useState <TowersProps>([]);
const [allAptList, setAllAptList] = useState <AptProps>([]);
const [accountStatus, setAccountStatus] = useState(null);
const [isOpenNewUsers, setIsOpenNewUsers] = useState (false);
const [idNewUsers, setIdNewUsers] = useState ('');
const [searchResident, setSearchResident] = useState('');
const [isOpenPayment, setIsOpenPayment] = useState(false);
const [apartament_id, setapartament_id] = useState ('');
const [isOpenEditApt, setIsOpenEditApt] = useState (false);
const [user_id, setUserId] = useState('');
const [loadingPage, setLoadingPage] = useState (true);
const [indexFilter, setIndexFilter] = useState(0);
const [towerFilter, setTowerFilter] = useState(0);
const [loadingExcel, setLoadingExcel] = useState(false);
const [isOpenFilterByTower, setIsOpenFilterByTower] = useState(false);
const SetupApi = SetupApiClient();



useEffect(() => {
  async function refreshData() {
    if (loadingPage || !(isOpenNewUsers || isOpenPayment || loadingExcel || isOpenEditApt)) {
      try {
        const [users, residents, towers, apartments] = await Promise.all([
          SetupApi.get("/adm/users"),
          SetupApi.get("/adm/filter"),
          SetupApi.get('/towers'),
          SetupApi.get('/apts')
        ]);

        SetAllUserRequest(users.data);
        SetAllResidents(residents.data);
        setAllTowersList(towers.data);
        setAllAptList(apartments.data);
      } catch (err) {
        console.log('Erro ao obter dados do servidor');
      } finally {
        setLoadingPage(false);
      }
    }
  }

  refreshData();
}, [isOpenNewUsers, isOpenPayment, loadingPage, loadingExcel, isOpenEditApt]);


//------------------- -Aprovar ou recusar novos moradores ------------------------//
const openModalNewUsers = useCallback((id:string, setAccount:boolean)=>{
  setAccountStatus(setAccount);
  setIsOpenNewUsers(true);
  setIdNewUsers(id);
},[isOpenNewUsers]);

const closeModalNewUsers = useCallback(()=>{
  setIsOpenNewUsers(false);
  setAccountStatus(null);
  setIdNewUsers('');
},[isOpenNewUsers]);


//--------------------Alterar pagamento -------------------------//
const openModalPayment = useCallback((id:string)=>{
  setIsOpenPayment(true);
  setapartament_id(id);
},[isOpenPayment]);

const closeModalPayment = useCallback(()=>{
  setapartament_id('');
  setIsOpenPayment(false);
},[isOpenPayment]);


//-------------------- Pagamento automatico excel -------------------------//
async function HandleExcel(excel){
  setLoadingExcel(true);
  try{  
      const excelFile = excel;
      const data = new FormData();
      data.append('excel', excelFile);
      await SetupApi.post('/adm/excel', data);
      toast.success('Tabela importada com sucesso.')
  }catch(error){
    toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
  }finally{
    setLoadingExcel(false);
  }
}

//-------------------- editar apartamento -------------------------//

function openModalEditApt(id:string){
  setUserId(id);
  setIsOpenEditApt(true);
}
function closeModalEditApt(){
  setUserId('');
  setIsOpenEditApt(false);
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

const filteredUsers = useMemo(() => {
  return [filterByName, filterByTower, filterPayment, filterNoPayment];
}, [allResidents, searchResident, towerFilter]);


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
function closeModalFilterByTower(){
  setIsOpenFilterByTower(false);
  setIndexFilter(0);
  setTowerFilter(0);
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
      <div className={style.bodyArea}>
        <main className={style.container}>
          <h1>Moradores</h1>
          {allUsersRequest.length > 0 ? (
            <section className={style.section1}>
              <h2>Novos moradores</h2>
              <div className={style.cards}>
              {allUsersRequest.map((item)=>{
                return(
                  <article key={item.id} className={style.card}> 
                    <div className={style.UserInfos} >
                      <p><b>{item.name} {item.lastname}</b></p>
                      <p>CPF: {item.cpf} </p>
                      <p>Torre {item.apartment.tower.numberTower} - apartamento {item.apartment.numberApt} </p>
                      <p>Telefone: {item.phone_number} </p>
                      <p>{item.email}</p>
                    </div>
                    <div className={style.buttonSet}>
                      <button onClick={() => { openModalNewUsers(item.id, true); }} className={style.true}>
                        <span>Aceitar</span><FaCheck/>
                      </button>
                      <button onClick={() => { openModalNewUsers(item.id, false);}} className={style.false}>
                        <span>Recusar</span><FaXmark/>
                      </button>
                    </div>
                </article>
                )
              })}
              </div> 
          </section>
        ):null}

          <section className={style.section2}>
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

            <label className={`${style.LabelExcel} buttonSlide`} tabIndex={1}>
                <input type="file"  accept=".xlsx" onChange={(e) => HandleExcel(e.target.files[0])} className={style.inputFile}/>
                {!loadingExcel?(
                  <span className={style.span}>Importar planilha<SiMicrosoftexcel/></span>
                ):(
                  <span className={style.spanSpinner}><FaSpinner/></span>
                )}
            </label>


            {allResidents.length > 0 ? (
              <div className={style.allcards}>
                {filteredUsers[indexFilter].map((item) => {
                    return (
                        <div  className={style.card} key={item.id}>
                          <div className={style.cardInfos}>
                              <div className={style.imgAndName}>
                                  {item.photo? (
                                    <img src={item.photo} />
                                  ) : null}
                                  <b> {item.name} {item.lastname}</b>
                              </div>

                              <div className={style.userData}>
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
                                <p>Contato: {item.phone_number}</p>
                                <p> {item.email}</p>
                              </div>         
                          </div>
                            <button onClick={()=>openModalPayment(item.apartment_id)} className='buttonSlide'
                            style={{border:'solid 2px var(--Primary-dark)'}}>
                              Alterar status de pagamento
                            </button> 
                        </div >        
                      );
                    })}
                </div>
                
              ) : (
                <p>Não há nenhum morador cadastrado</p>
              )}
            </section>
        </main>
      </div>
      

    {isOpenNewUsers && (
      <NewUsersModal
        isOpen={isOpenNewUsers}
        onClose={closeModalNewUsers}
        accountStatus={accountStatus}
        idNewUsers={idNewUsers}
      />
    )}

    {/*------------------------------------Modal novos usuarios*/}
    <ChangeStatesModal
      isOpen={isOpenPayment}
      onClose={closeModalPayment}
      apartament_id={apartament_id}
    />
    {/*------------------------------------Modal pagamento apt */}

    <EditAptUsersModal
      isOpen={isOpenEditApt} 
      onClose={closeModalEditApt} 
      userId={user_id} 
      allTowersList={allTowersList} 
      allAptList={allAptList}
    />
    {/*------------------------------------Modal editar apt */}
      <FilterUserModal
      isOpen={isOpenFilterByTower} 
      onClose={closeModalFilterByTower} 
      setTowerFilter={setTowerFilter} 
      towerFilter={towerFilter} 
      allTowersList={allTowersList} 
      setIsOpenFilterByTower={setIsOpenFilterByTower}
      />
      {/*----------------------Filtrar por torre------------------------------*/}

    </>
  )
}


export const getServerSideProps = canSSRAuth (async ()=>{
  return{
    props:{}
  }
})
