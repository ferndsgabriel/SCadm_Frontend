import Gmodal  from "../../myModal";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function ChangeStatesModal({isOpen, onClose, apartament_id}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function handlePayment(e:FormEvent){
        e.preventDefault();

        setLoadingModal(true);

        try{
            await setupApi.put("/adm/setpayment",{
                apartment_id:apartament_id
            })
            toast.success("Pagamento alterado com êxito.");
            onClose();
            }catch(error){
            console.log(error)
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{}
            setLoadingModal(false);
    }   

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onSubmit={handlePayment}> 
                <div className='beforeButtons'>
                    <h3>Alterar Pagamento</h3>
                    <p>Tem certeza de que deseja modificar o pagamento deste usuário?</p>
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