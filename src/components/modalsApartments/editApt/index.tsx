import Gmodal  from "../../myModal";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function EditAptModal({isOpen, onClose, apartment_id, numberAptEdit}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [inputNewApt, setInputNewApt] = useState ('');

    
    async function handleEditApt(e:FormEvent){
        e.preventDefault();
        if (inputNewApt === ""){
            toast.warning('Por favor, insira o número do apartamento.');
            return;
        }
        setLoadingModal(true);
        try{
            await setupApi.put("/adm/apt",{
                apartment_id:apartment_id,
                newApt:inputNewApt
            })
            toast.success('Apartamento editado com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setLoadingModal(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setInputNewApt('');
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
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