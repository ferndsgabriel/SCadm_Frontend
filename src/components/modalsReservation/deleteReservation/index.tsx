import Gmodal  from "../../myModal";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function DeleteReservationModal({isOpen, onClose, reservation_id}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function handleDeleteReservation(e:FormEvent){
        e.preventDefault();
        setLoadingModal(true);
        try{
            await setupApi.delete('/adm/reservation',{
                data:{
                reservation_id:reservation_id
                }
            })
            toast.success('Reserva cancelada com sucesso.');
            onClose();
        }catch(error){
            console.log(error);
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setLoadingModal(false);
        }
    }

    return(
        <Gmodal isOpen={isOpen} onClose={onClose} className='modal'>
            <form className='modalContainer' onSubmit={handleDeleteReservation}>
                <div className='beforeButtons'>
                    <h3>Deletar reserva</h3>
                    <p>
                    Reserva associada a um apartamento antes adimplente,
                    agora está vinculada a um condomínio inadimplente.
                    Deseja prosseguir com a exclusão?
                    </p>
                </div>
                <div className='buttonsModal'>
                    <button className='buttonSlide' type="submit"
                    autoFocus={true} disabled={loadingModal}>Confirmar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>

        </Gmodal>
    )
}