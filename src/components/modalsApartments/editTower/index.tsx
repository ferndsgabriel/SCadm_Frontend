import Gmodal  from "../../myModal";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function EditTowerModal({isOpen, onClose, tower_id, numberTowerEdit}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [newTowerEdit, setNewTowerEdit] = useState ('');

    
    async function HandleEditTower(e:FormEvent){
        e.preventDefault();
        if (tower_id === '' || newTowerEdit === '')
        toast.warning('Por favor, insira a nova torre.');

        setLoadingModal(true);
        try{
            await setupApi.put('/adm/towers',{
                tower_id:tower_id,
                newTower:newTowerEdit
            })
            toast.success('Torre editada com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            console.log(error);
        }finally{
            setLoadingModal(false)
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setNewTowerEdit('');
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
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
                    <button type="submit" className='buttonSlide'
                    disabled={loadingModal}>Editar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
    </Gmodal>

    )
}