import Gmodal from "../../default";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";

export default function NewUsersModal({isOpen, onClose, accountStatus, idNewUsers}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function handleNewUser(e:FormEvent){
        e.preventDefault();
        
        setLoadingModal(true);
        try{
            await setupApi.put("/adm/useron",{
                id:idNewUsers,
                accountStatus:accountStatus
            });  
            accountStatus?(
            toast.success('Usuário aprovado com sucesso.')
            ):(
            toast.success('Usuário reprovado com sucesso.')
            );
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setLoadingModal(false);
        }
    }

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onSubmit={handleNewUser}>     
                <div className='beforeButtons'>
                    <h3>Validação</h3>
                    {accountStatus?(
                    <p>Você tem certeza de que deseja aprovar este usuário?</p>
                    ):(
                    <p>Você tem certeza de que deseja recusar este usuário? </p>
                    )}
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='buttonSlide'
                    autoFocus={true} disabled={loadingModal}>Confirmar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
    </Gmodal>

    )
}