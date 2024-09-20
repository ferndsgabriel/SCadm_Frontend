import HeaderConcierge from "../../components/headerConcierge";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { SetupApiClient } from "../../services/api";
import styles from './styles.module.scss';
import { formatDate, formatHours } from "../../utils/formatted";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { Loading } from "../../components/loading";

interface ReservationProps{
    reservation:{
        GuestList:{
            attended:boolean,
            id:string,
            name:string,
            rg:string
        }[];
        apartment:{
            numberApt:string,
            tower:{
                numberTower:string;
            },
        },
        cleaningService:true,
        date:number,
        finish:number,
        start:number,
        id:string,
        name:string,
        phone_number:string,
    }
    isEditable:boolean;
}

export default function Guest() {
    const router = useRouter();
    const { id } = router.query;
    const api = SetupApiClient();
    const [reservation, setReservation] = useState<ReservationProps | null>(null);
    const [inProgress, setInProgress] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');  
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getReservation(){

            try {
                const response = await api.get("/concierge/reservation",{
                    params:{
                        id:id
                    }
                });

                setReservation(response.data);

            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false);
            }
        }

        getReservation();
    },[id]);

    async function handleEdit(id: string, e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked;

        if (!id || value === undefined) {
            toast.warning('Preencha todos os campos.');
            return;
        }
        setInProgress(true);
        try {

            await api.put("/concierge/presence", {
                id: id,
                value: value
            });


            if (reservation) {
                const updatedGuestList = reservation.reservation.GuestList.map(guest => 
                    guest.id === id ? { ...guest, attended: value } : guest
                );

                setReservation({
                    ...reservation,
                    reservation: {
                        ...reservation.reservation,
                        GuestList: updatedGuestList
                    }
                });
            }

        } catch (error) {
            toast.error('Erro ao editar presença.');
        } finally {
            setInProgress(false);
        }
    }


    const filteredGuestList = reservation?.reservation.GuestList.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        guest.rg.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <Loading/>
    }

    return(
        <>
            <HeaderConcierge/>
            <main className={styles.container}>
                {reservation ? (
                    <>
                        <section className={styles.section1}>
                            <h1>{reservation.reservation.name} - {formatDate(reservation.reservation.date)}</h1>
                            <h2>{reservation.reservation.phone_number}</h2>
                            <div className={styles.reservationDetails}>
                                <h3>Torre {reservation.reservation.apartment.tower.numberTower} - Apartamento {reservation.reservation.apartment.numberApt}</h3>
                                <h3>{formatHours(reservation.reservation.start)} - {formatHours(reservation.reservation.finish)}</h3>
                            </div>
                        </section>


                        <label className={styles.labelSearch}>
                            <IoSearchOutline/>
                            <input 
                                type="text" 
                                placeholder="Digite um nome ou RG..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </label>


                        {filteredGuestList && filteredGuestList.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>RG</th>
                                        {<th>Presença</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGuestList.map((guest) => (
                                        <tr key={guest.id}>
                                            <td>{guest.name}</td>
                                            <td>{guest.rg}</td>

                                            {reservation.isEditable ?(
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        disabled={inProgress} 
                                                        checked={guest.attended} 
                                                        onChange={(e) => handleEdit(guest.id, e)}
                                                    />
                                                </td>
                                            ):(
                                                <td>
                                                    {guest.attended ? 'Presente' : 'Ausente'}
                                                </td>
                                            )

                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <article>
                                <p>Nenhum convidado encontrado.</p>
                            </article>
                        )}
                    </>
                ) : (
                    <article>
                    </article>
                )}
            </main>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    };
}, [ "porter"]);