import Head from "next/head";
import Header from "../../components/header";
import style from "./styles.module.scss";
import { SetupApiClient } from "../../services/api";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import Modal from "react-modal";
import { Loading } from "../../components/loading";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { TbTower } from "react-icons/tb";
import { MdApartment, MdEdit } from "react-icons/md";


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
Modal.setAppElement('#__next');

const SetupApi = SetupApiClient();
const [towers, setTowers] = useState(Alltowers || null);
const [apts, setApts] = useState(AllApts || null);
const [isOpenCreateTower, setIsOpenCreateTower] = useState(false);
const [createTowerInput, setCreateTowerInput] = useState ('');
const [tower_id, setTower_id] = useState('');
const [isOpenTowerDelete, setIsOpenTowerDelete] = useState (false);
const [numberTowerDelete, setNumberTowerDelete] = useState ('');
const [newTowerEdit, setNewTowerEdit] = useState ('');
const [isOpenTowerEdit, setIsOpenTowerEdit] = useState (false);
const [numberTowerEdit, setNumberTowerEdit] = useState ('');
const [optionTower, setOptionTower] = useState(0);
const [changeTowerCreateApt, setChangeTowerCreateApt] = useState(0);
const [isOpenCreateApt, setIsOpenCreateApt] = useState (false);
const [createAptInput, setCreateAptInput] = useState ('');
const [apartment_id, setApartment_id] = useState('');
const [isOpenDeleteApartament, setIsOpenDeleteApartment] = useState(false);
const [numberAptDelete, setNumberAptDelete] = useState('');
const [isOpenAptEdit, setIsOpenAptEdit] = useState(false);
const [numberAptEdit, setNumberAptEdit] = useState('');
const [inputNewApt, setInputNewApt] = useState ('');
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
},[]);

// ----------------------------- criar torre
function openModalCreateTower(){
    setIsOpenCreateTower(true);
}

function closeModalCreateTower(){
    setIsOpenCreateTower(false);
    setCreateTowerInput('');
}

async function handleCreateTower(e:FormEvent){
    e.preventDefault();
    if (createTowerInput === ""){
        toast.warning('Por favor, insira a torre desejada.');
        return;
    }
    try{
        await SetupApi.post('/adm/towers',{          
            numberTower:createTowerInput
        });
        toast.success('Torre criada com sucesso.');
        setCreateTowerInput("");
        refreshDate();
        closeModalCreateTower();
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
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

async function DeleteTower(){
    if (tower_id === ''){
        toast.warning('Por favor, insira a torre desejada.');
        return;
    }
    try{
        await SetupApi.delete('/adm/towers',{
            data:{
                tower_id:tower_id
            }
        });
        setOptionTower(0);
        refreshDate();
        toast.success('Torre excluída com sucesso.');
        closeModalTowerDelete();
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        console.log(error);
    }
}

 // ----------------------------- editar torre
async function HandleEditTower(e:FormEvent){
    e.preventDefault();
    if (tower_id === '' || newTowerEdit === '')
    toast.warning('Por favor, insira a nova torre.');
    try{
        await SetupApi.put('/adm/towers',{
            tower_id:tower_id,
            newTower:newTowerEdit
        })
        refreshDate();
        toast.success('Torre editada com sucesso.');
        closeModalTowerEdit();
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        console.log(error);
    }
}

function openModalTowerEdit(id:string, number:string){
    setTower_id(id);
    setNumberTowerEdit(number);
    setIsOpenTowerEdit(true);
}

function closeModalTowerEdit(){
    setTower_id('');
    setNumberTowerEdit('');
    setNewTowerEdit('');
    setIsOpenTowerEdit(false);
}

 // ----------------------------- alterar o option de ver apartamentos
function handleViewApts(e: React.ChangeEvent<HTMLSelectElement>) {
    const towerIndex = parseInt (e.target.value);
    setOptionTower(towerIndex);
};


// ----------------------------- criar apt
function handleTowerCreateApt(e: React.ChangeEvent<HTMLSelectElement>) {
    const towerIndex = parseInt (e.target.value);
    setChangeTowerCreateApt(towerIndex);
    console.log(towerIndex);
}

function openModalCreateApt(){
    setIsOpenCreateApt(true);
}

function closeModalCreateApt(){
    setIsOpenCreateApt(false);
    setCreateAptInput('');
}

async function handleCreateApt(e:FormEvent){
    e.preventDefault();
    if (createAptInput === '' ){
        toast.warning('Por favor, insira o número do apartamento.');
        return;
    }
    try{
        await SetupApi.post("/adm/apt",{
            numberApt:createAptInput,
            tower:towers[changeTowerCreateApt].id
        });
        toast.success('Apartamento criado com sucesso!');
        refreshDate();
        closeModalCreateApt();
    }
    catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        console.log(error);
    }
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

async function handleDeleteApt(){
    if (apartment_id === ""){
        toast.warning('Por favor, insira o número do apartamento.');
        return;
    }
    try{
        await SetupApi.delete("/adm/apt",{
            data:{
                apartment_id:apartment_id
            }
            
        })
        toast.success('Apartamento excluído com sucesso.');
        refreshDate();
        setApartment_id('');
        closeModalDeleteApartment()
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        console.log(error);
    }
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
    setInputNewApt('');
    setIsOpenAptEdit(false);
}
async function handleEditApt(e:FormEvent){
    e.preventDefault();
    if (inputNewApt === ""){
        toast.warning('Por favor, insira o número do apartamento.');
        return;
    }
    try{
        await SetupApi.put("/adm/apt",{
            apartment_id:apartment_id,
            newApt:inputNewApt
        })
        toast.success('Apartamento editado com sucesso.');
        refreshDate();
        closeModalEditApt();
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
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
            <main className={style.container}>
            <h1>Residências</h1>
                <section className={style.allTowers}>
                <h2>Torres</h2>
                <button className={style.buttonMoreTowers}
                onClick={openModalCreateTower}>
                    <AiOutlinePlus/>
                </button>
                <div className={style.allTowersCards}>
                    {towers.map((item, index)=>{
                        return(
                            <div key={item.id} className={style.towerCard}>
                                <span><TbTower />{`Torre - ${item.numberTower}`}</span>
                                <div className={style.toolsTowers}>
                                    <button className={style.editTower}
                                    onClick={()=>openModalTowerEdit(item.id, item.numberTower)}>
                                        <MdEdit/>
                                    </button>
                                    {item.apartment.length > 0 ?(
                                        <i><MdApartment />{item.apartment.length}</i>
                                    ):(
                                        <button className={style.deleteTower}
                                        onClick={()=>openModalTowerDelete(item.id, item.numberTower)}>
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
                <section className={style.apartment}>
                    <h2>Apartamentos</h2>
                    <div className={style.optionTowers}>
                        <button className={style.buttonMoreApts}
                            onClick={(()=>openModalCreateApt())}>
                                <AiOutlinePlus/>
                        </button>
                        <div className={style.selectApartment}>
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
                    </div>
                    <div className={style.allApts}>
                        {apts.filter((itemApts)=>
                            itemApts.tower_id === towers[optionTower].id
                        ).map((item)=>{
                            return(
                                <div key={item.id} className={style.cardApts}>
                                    <span><MdApartment /> Apartamento - {item.numberApt}</span>
                                    <div className={style.toolsApartment}>
                                        <button className={style.editApartment}
                                        onClick={()=>openModalEditApt(item.id, item.numberApt)}> 
                                            <MdEdit/>
                                        </button>
                                        {item.user.length > 0 ?(
                                            <i><FaUser/>{item.user.length}</i>
                                        ):(
                                            <button className={style.deleteApartment}
                                            onClick={()=>openModalDeleteApartment(item.id, item.numberApt)}>
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
        
            {/* ----------------- Modal criar torre ------------------- */}
            <Modal isOpen={isOpenCreateTower}
            onRequestClose={closeModalCreateTower}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(64, 89, 113, 0.4)'
                }}}>
            <form className='modalContainer' onSubmit={handleCreateTower}>
                <div className='beforeButtons'>
                    <h3>Criar torre</h3>
                    <p>Insira o valor para a nova torre:</p>
                    <input placeholder="Digite aqui a torre:" 
                    className='inputModal' autoFocus={true}
                    value={createTowerInput}
                    onChange={(e)=> setCreateTowerInput(e.target.value)}/>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='true'><span>Criar</span></button>
                    <button onClick={closeModalCreateTower} className='false'><span>Cancelar</span></button>
                </div>
            </form>
            </Modal>

            {/* ----------------- Modal deletar torre ------------------- */}
            <Modal isOpen={isOpenTowerDelete}
            onRequestClose={closeModalTowerDelete}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(64, 89, 113, 0.4)'
                }}}>
            <div className='modalContainer'>
                <div className='beforeButtons'>
                    <h3>Deletar torre</h3>
                    <p>Tem certeza de que deseja excluir permanentemente a Torre {numberTowerDelete}?</p>
                </div>
                <div className='buttonsModal'>
                    <button onClick={DeleteTower} className='true' autoFocus={true}><span>Deletar</span></button>
                    <button onClick={closeModalTowerDelete} className='false'><span>Cancelar</span></button>
                </div>
            </div>

            </Modal>
        
            {/* ----------------- Modal editar torre ------------------- */}
            <Modal isOpen={isOpenTowerEdit}
            onRequestClose={closeModalTowerEdit}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(64, 89, 113, 0.4)'
                }}}>
            <form className='modalContainer' onSubmit={HandleEditTower}>
                <div className='beforeButtons'>
                    <h3>Editar torre</h3>
                    <p>Altere o valor da Torre {numberTowerEdit}:</p>
                    <input placeholder="Digite aqui a torre:" 
                    className='inputModal' autoFocus={true}
                    value={newTowerEdit}
                    onChange={(e)=> setNewTowerEdit(e.target.value)}/>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='true'><span>Confirmar</span></button>
                    <button onClick={closeModalTowerEdit} className='false'><span>Cancelar</span></button>
                </div>
            </form>
            </Modal>

            {/* ----------------- Modal criar apartamento ------------------- */}
            <Modal isOpen={isOpenCreateApt}
            onRequestClose={closeModalCreateApt}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(64, 89, 113, 0.4)'
                }}}>
                <form className='modalContainer' onSubmit={handleCreateApt}>
                    <div className='beforeButtons'>
                        <h3>Criar apartamento</h3>
                        <p>Selecione a torre:</p>
                        <select value={changeTowerCreateApt} onChange={handleTowerCreateApt}>
                            {towers.map((item, index)=>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.numberTower}
                                    </option>
                                )
                            })}
                        </select>
                        <input placeholder="Digite o novo apartamento:" 
                        className='inputModal' autoFocus={true}
                        value={createAptInput}
                        onChange={(e)=> setCreateAptInput(e.target.value)}/>
                    </div>
                    <div className='buttonsModal'>
                        <button type="submit" className='true' ><span>Criar</span></button>
                        <button onClick={closeModalCreateApt} className='false'><span>Cancelar</span></button>
                    </div>
                </form>
            </Modal>

            {/* ----------------- Modal edit apartamento ------------------- */}
            <Modal isOpen={isOpenAptEdit}
            onRequestClose={closeModalEditApt}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(64, 89, 113, 0.4)'
                }}}>
                <form className='modalContainer' onSubmit={handleEditApt}>
                    <div className='beforeButtons'>
                        <h3>Editar apartamento</h3>
                        <p>Altere o apartamento {numberAptEdit}:</p>
                        <input placeholder="Digite o apartamento:" 
                        className='inputModal' autoFocus={true}
                        value={inputNewApt}
                        onChange={(e)=> setInputNewApt(e.target.value)}/>
                    </div>
                    <div className='buttonsModal'>
                        <button type="submit" className='true'><span>Confirmar</span></button>
                        <button onClick={closeModalEditApt} className='false'><span>Cancelar</span></button>
                    </div>
                </form>
            </Modal>

            {/* ----------------- Modal deletar apartamento ------------------- */}
            <Modal isOpen={isOpenDeleteApartament}
            onRequestClose={closeModalDeleteApartment}
            className='modal'
            style={{overlay:{
            backgroundColor: 'rgba(64, 89, 113, 0.4)'
            }}}>
            <div className='modalContainer'>
                <div className='beforeButtons'>
                    <h3>Deletar apartamento</h3>
                    <p>Tem certeza de que deseja excluir permanentemente o Apartamento {numberAptDelete}?</p>
                </div>
                <div className='buttonsModal'>
                    <button onClick={handleDeleteApt} className='true'autoFocus={true}><span>Deletar</span></button>
                    <button onClick={closeModalDeleteApartment}className='false'><span>Cancelar</span></button>
                </div>
            </div>
            </Modal>
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