import Head from "next/head";
import Header from "../../components/header";
import style from "./styles.module.scss";
import { SetupApiClient } from "../../services/api";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Loading } from "../../components/loading";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { TbTower } from "react-icons/tb";
import { MdApartment, MdEdit } from "react-icons/md";
import Gmodal from "../../components/myModal";

import NewTowerModal from "../../components/modalsApartments/newTower";
import DeleteTowerModal from "../../components/modalsApartments/deleteTower";
import EditTowerModal from "../../components/modalsApartments/editTower";
import CreateAptModal from "../../components/modalsApartments/createApt";
import EditAptModal from "../../components/modalsApartments/editApt";
import DeleteAptModal from "../../components/modalsApartments/deleteApt";

type TowersProps = {
    id:string,
    numberTower:string 
    apartment:[]
}
interface AptProps {
    id: string;
    numberApt: string;
    tower_id: string;
    user: any[]; 
}

interface aptPropsInterface {
    Alltowers: TowersProps[];
    AllApts:AptProps[];
}

export default function Apartments({Alltowers, AllApts}:aptPropsInterface){

const [towers, setTowers] = useState(Alltowers || null);
const [apts, setApts] = useState(AllApts || null);
const [isOpenCreateTower, setIsOpenCreateTower] = useState(false);
const [tower_id, setTower_id] = useState('');
const [isOpenTowerDelete, setIsOpenTowerDelete] = useState (false);
const [numberTowerDelete, setNumberTowerDelete] = useState ('');
const [isOpenTowerEdit, setIsOpenTowerEdit] = useState (false);
const [numberTowerEdit, setNumberTowerEdit] = useState ('');
const [optionTower, setOptionTower] = useState(0);
const [isOpenCreateApt, setIsOpenCreateApt] = useState (false);
const [apartment_id, setApartment_id] = useState('');
const [isOpenDeleteApartament, setIsOpenDeleteApartment] = useState(false);
const [numberAptDelete, setNumberAptDelete] = useState('');
const [isOpenAptEdit, setIsOpenAptEdit] = useState(false);
const [numberAptEdit, setNumberAptEdit] = useState('');
const [loadingPage, setLoadingPage] = useState (true);


// ----------------------------- renderizar componentes
async function refreshDate(){
    try{
        const SetupApi = SetupApiClient();
        const response = await SetupApi.get('/apts');
        const response2 = await SetupApi.get('/towers');
        setTowers(response2.data);
        setApts(response.data);
        setLoadingPage(false)
    }catch(err){
        console.log('Erro ao obter dados do servidor');
        setTimeout(refreshDate, 500);
    }
}
useEffect(()=>{
    refreshDate();
},[closeModalCreateTower, 
    closeModalTowerDelete, 
    closeModalTowerEdit, 
    closeModalCreateApt,
    closeModalEditApt,
    closeModalDeleteApartment]);

// ----------------------------- criar torre
function openModalCreateTower(){
    setIsOpenCreateTower(true);
}

function closeModalCreateTower(){
    setIsOpenCreateTower(false);
}


// ----------------------------- Deletar torre
function openModalTowerDelete(id:string, number:string){
    setTower_id(id);
    setNumberTowerDelete(number);
    setIsOpenTowerDelete(true);
}

function closeModalTowerDelete(){
    setTower_id('');
    setNumberTowerDelete('');
    setIsOpenTowerDelete(false);
}


 // ----------------------------- editar torre
function openModalTowerEdit(id:string, number:string){
    setTower_id(id);
    setNumberTowerEdit(number);
    setIsOpenTowerEdit(true);
}

function closeModalTowerEdit(){
    setTower_id('');
    setNumberTowerEdit('');
    setIsOpenTowerEdit(false);
}

 // ----------------------------- alterar o option de ver apartamentos
function handleViewApts(e: React.ChangeEvent<HTMLSelectElement>) {
    const towerIndex = parseInt (e.target.value);
    setOptionTower(towerIndex);
};

function openModalCreateApt(){
    setIsOpenCreateApt(true);
}

function closeModalCreateApt(){
    setIsOpenCreateApt(false);
}

// ----------------------------- deletar apt
function openModalDeleteApartment(id:string, number:string){
    setApartment_id(id);
    setNumberAptDelete(number);
    setIsOpenDeleteApartment(true);
}

function closeModalDeleteApartment(){
    setApartment_id('');
    setNumberAptDelete('');
    setIsOpenDeleteApartment(false);
}

// ----------------------------- editar apt
function openModalEditApt(id:string, number:string){
    setApartment_id(id);
    setNumberAptEdit(number);
    setIsOpenAptEdit(true);
}

function closeModalEditApt(){
    setApartment_id('');
    setNumberAptEdit('');
    setIsOpenAptEdit(false);
}

// -------------------------------------------------------------------------//
    if (loadingPage){
        return <Loading/>
    }

    return(
        <>
            <Head>
                <title>SalãoCondo - Residências</title>
            </Head>
            <Header/>
            <div className={style.bodyArea}>
                <main className={style.container}>
                <h1>Residências</h1>
                    <section className={style.section1}>
                    <div className={style.btnNewItem}>
                        <h2>Torres</h2>
                        <button className={style.buttonMoreTowers}
                        onClick={openModalCreateTower}>
                            <AiOutlinePlus/>
                        </button>
                    </div>
                    <div className={style.allCards}>
                        {towers.map((item, index)=>{
                            return(
                                <div key={item.id} className={style.card}>
                                    <span className={style.itemInfos}><TbTower />{`Torre - ${item.numberTower}`}</span>
                                    <div className={style.itemTools}>

                                        <button onClick={()=>openModalTowerEdit(item.id, item.numberTower)}>
                                            <MdEdit/>
                                        </button>

                                        {item.apartment.length > 0 ?(
                                            <i><MdApartment />{item.apartment.length}</i>
                                        ):(
                                            <button onClick={()=>openModalTowerDelete(item.id, item.numberTower)}>
                                                <IoClose/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {towers.length > 0 ?(
                    <section className={style.section2}>
                        <div className={style.btnNewItem}>
                            <h2>Apartamentos</h2>
                            <button className={style.buttonMoreApts}
                                onClick={(()=>openModalCreateApt())}>
                                    <AiOutlinePlus/>
                            </button>
                        </div>

                        <div className={style.selectTower}>
                            <h3>Torre</h3>
                            <select value={optionTower} onChange={handleViewApts}>
                                {towers.map((item, index)=>{
                                    return(
                                        <option value={index} key={item.id}>
                                            {item.numberTower}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className={style.allCards}>
                            {apts.filter((itemApts)=>
                                itemApts.tower_id === towers[optionTower].id
                            ).map((item)=>{
                                return(
                                    <div key={item.id} className={style.card}>
                                        <span className={style.itemInfos}><MdApartment /> Apartamento - {item.numberApt}</span>

                                        <div className={style.itemTools}>
                                            <button onClick={()=>openModalEditApt(item.id, item.numberApt)}> 
                                                <MdEdit/>
                                            </button>
                                            {item.user.length > 0 ?(
                                                <i><FaUser/>{item.user.length}</i>
                                            ):(
                                                <button onClick={()=>openModalDeleteApartment(item.id, item.numberApt)}>
                                                    <IoClose/>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                ):null}
                    
                </main>
            </div>
            
        
            <NewTowerModal
            isOpen={isOpenCreateTower}
            onClose={closeModalCreateTower}/>
            {/* ----------------- Modal criar torre ------------------- */}
            
            <DeleteTowerModal 
            isOpen={isOpenTowerDelete}
            onClose={closeModalTowerDelete} 
            numberTowerDelete={numberTowerDelete}
            tower_id={tower_id}
            />
            {/* ----------------- Modal deletar torre ------------------- */}

            <EditTowerModal
            isOpen={isOpenTowerEdit}
            onClose={closeModalTowerEdit}
            tower_id={tower_id}
            numberTowerEdit={numberTowerEdit}
            />
            {/* ----------------- Modal editar torre ------------------- */}

            <CreateAptModal
            isOpen={isOpenCreateApt}
            onClose={closeModalCreateApt}
            />
            {/* ----------------- Modal criar apartamento ------------------- */}

            <EditAptModal
            isOpen={isOpenAptEdit}
            onClose={closeModalEditApt}
            apartment_id={apartment_id}
            numberAptEdit={numberAptEdit}
            />
            {/* ----------------- Modal edit apartamento ------------------- */}

            <DeleteAptModal
            isOpen={isOpenDeleteApartament}
            onClose={closeModalDeleteApartment}
            apartment_id={apartment_id}
            numberAptDelete={numberAptDelete}
            />
            {/* ----------------- Modal deletar apartamento ------------------- */}
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const SetupApi = SetupApiClient(ctx);
        const response = await SetupApi.get('/apts');
        const response2 = await SetupApi.get('/towers');
        const AllApts = response.data
        const Alltowers = response2.data
        return {
            props: {
            Alltowers,
            AllApts
            },
        };
        }catch (error) {
            console.error('Erro ao obter dados da API');
        return {
            props: {
            Alltowers:[],
            AllApts:[]
            },
        };
    }
});