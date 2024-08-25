import Gmodal  from "../../myModal";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";

export default function SetReservationModal({isOpen, onClose, reservation_id, reservationStatus}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();

    async function handleSetReservation(e:FormEvent) {
        e.preventDefault();
        if (!reservation_id || reservationStatus === null){
            toast.warning('Informe os dados!');
        }
        setLoadingModal(true);
        try {
            await setupApi.put('/adm/setreservations', {
            reservation_id: reservation_id,
            status:reservationStatus,
            });
            reservationStatus ?(
            toast.success("Reserva aprovada.")
            ):(
            toast.success("Reserva recusada.")
            );
        } 
        catch (error) {
            console.log(error);
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            onClose();
            setLoadingModal(false);
        }
    }

    return(
        <Gmodal isOpen={isOpen} onClose={onClose} className='modal'>
            <form className='modalContainer' onSubmit={handleSetReservation}>
                <div className='beforeButtons'>
                    <h3>Validar reserva</h3>
                    {reservationStatus?(
                    <p>Você tem certeza de que deseja confirmar esta reserva?</p>
                    ):(
                    <p>Você tem certeza de que deseja recusar esta reserva?</p>
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