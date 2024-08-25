import Gmodal  from "../../myModal";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function DeleteAptModal({isOpen, onClose, apartment_id, numberAptDelete}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function handleDeleteApt(e:FormEvent){
        e.preventDefault();
        
        if (apartment_id === ""){
            toast.warning('Por favor, insira o número do apartamento.');
            return;
        }
        
        setLoadingModal(true);
        try{
            await setupApi.delete("/adm/apt",{
                data:{
                    apartment_id:apartment_id
                }
                
            })
            toast.success('Apartamento excluído com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            console.log(error);
        }finally{
            setLoadingModal(false);
        }
    }

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onClick={handleDeleteApt}>
                <div className='beforeButtons'>
                    <h3>Deletar apartamento</h3>
                    <p>Tem certeza de que deseja excluir permanentemente o Apartamento {numberAptDelete}?</p>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='buttonSlide' autoFocus={true}
                    disabled={loadingModal}>Deletar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
    </Gmodal>

    )
}