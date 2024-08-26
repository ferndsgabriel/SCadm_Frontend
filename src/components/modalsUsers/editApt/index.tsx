import Gmodal  from "../../myModal";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";


export default function EditAptUsersModal({isOpen, onClose, userId, allTowersList, allAptList}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [towerAptEditIndex, setTowerAptEditIndex] = useState(0);
    const [aptEditIndex, setAptEditIndex] = useState(0);

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
        setLoadingModal(true);
        try{
        await setupApi.put('/adm/aptuser',{
            apartment_id:idApt ,
            user_id:userId
        });
        toast.success('Apartamento alterado com sucesso.');
        onClose();
        }catch(error){
        console.log(error)
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
        setLoadingModal(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setTowerAptEditIndex(0);
            setAptEditIndex(0);
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onSubmit={handleEditApt}>
                <div className='beforeButtons'>
                    <h3>Editar apartamento</h3>
                    <p>Tem certeza de que deseja alterar o apartamento do usuário?
                    </p>

                    <div className="modalOptions">
                    <select value={towerAptEditIndex} onChange={changeOptionTower}
                    style={{marginRight:'16px'}}>
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
                    <button className='buttonSlide'
                    autoFocus={true} disabled={loadingModal}>Confirmar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
        </Gmodal>
    )
}