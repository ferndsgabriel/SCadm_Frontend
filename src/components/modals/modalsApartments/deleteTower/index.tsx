import Gmodal from "../../default";
import { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";

export default function DeleteTowerModal({isOpen, onClose, numberTowerDelete, tower_id}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function DeleteTower(e:FormEvent){
        e.preventDefault();
        
        if (tower_id === ''){
            toast.warning('Por favor, insira a torre desejada.');
            return;
        }
        setLoadingModal(true);
        try{
            await setupApi.delete('/adm/towers',{
                data:{
                    tower_id:tower_id
                }
            });
            toast.success('Torre excluída com sucesso.');
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
            <form className='modalContainer' onSubmit={DeleteTower}>     
                <div className='beforeButtons'>
                    <h3>Deletar torre</h3>
                    <p>Tem certeza de que deseja excluir permanentemente a Torre {numberTowerDelete}?</p>
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