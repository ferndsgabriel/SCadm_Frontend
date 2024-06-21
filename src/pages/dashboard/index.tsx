import styles from "./styles.module.scss";
import Header from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../../components/loading";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { MdOutlineSentimentVeryDissatisfied, MdSentimentVeryDissatisfied, MdSentimentNeutral,  MdOutlineSentimentSatisfiedAlt, MdOutlineSentimentVerySatisfied } from "react-icons/md";


type DashboardType = {
    Collection: {
        qtd: number;
        name: string;
        money: number;
        percentage: string;
    }[];
    TotalCollection: number;
    Users: {
        qtd: number;
        name: string;
    }[];
    Residences: {
        qtd: number;
        name: string;
    }[];
    StatusApartment: {
        name: string;
        qtd: number;
        Percentage: number;
    }[];
    OccupancyRate: string;
    Avaliation: {
        qtd: number;
        average: number;
    };
    UsersRating: boolean;
    Reservations: {
        qtd: number;
        percentage: string;
        name: string;
    }[];
    TopApartments:{
        id:string,
        numberApt:string,
        tower:{
            numberTower:string
        },
        _count:{
            Reservations:number
        },
        percentage:string
    }[];
    TotalReservation: number;
    AverageStartReservation: string;
    AverageFinishReservation: string;
    AverageDurationReservation: string;
    TotalCollectionTaxed: number;
    TimeApproveReservation: string;
};


export default function Dashboard() {
    const setupApi = SetupApiClient();

    const [dashboardList, setDashboardList] = useState<DashboardType>();
    const [loading, setLoading] = useState(true);
    const [userIndex, setUserIndex] = useState(0);
    const [residencesIndex, setResidencesIndex] = useState(0);
    const [timeIndex, setTimeIndex] = useState(0);
    const selectRef = useRef(null);


    const handleSelectTimes = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const index = selectRef.current?.value;
        setTimeIndex(index);
        refreshData(index);
    }

    async function refreshData(value:number) {
        setLoading(true);
        try {
            const response = await setupApi.post('/adm/dashboard',{
                period:value || 0
            });
            setDashboardList(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Erro ao obter dados da API.');
            setTimeout(refreshData, 500);
        }
    }

    useEffect(() => {
        refreshData(timeIndex);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            <div className={styles.bodyArea}>
                <main className={styles.container}>
                    <div className={styles.h1WithSelect}>
                        <h1>DashBoard</h1>
                        <select value={timeIndex} onChange={handleSelectTimes} ref={selectRef}>
                            <option value={0}>Todo o período</option>
                            <option value={1}>Últimos 6 meses</option>
                            <option value={2}>Últimos 30 dias</option>
                        </select>
                    </div>

                    <div className={styles.allSections}>
                        <section className={styles.section1}>
                            <div className={styles.card1item1}>
                                <h2>R$ {dashboardList.TotalCollection},00</h2>
                                <div className={styles.card1item1Infos}>
                                    {dashboardList.Collection.map((item) => (
                                        <span key={item.name}>R$ {item.money},00 - {item.name}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.card1item2}>
                                {dashboardList.Collection.map((item) => (
                                    <span key={item.name} className={styles.barContainer}>
                                        <span className={styles.legend}>{item.name}s</span>
                                        <span className={styles.progress} style={{ height: `${item.percentage}%` }}></span>
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className={styles.section2}>
                                <div className={styles.card2item1}>
                                    <span className={styles.text}>{dashboardList.Users[userIndex]?.name}</span>
                                    <span className={styles.number}>{dashboardList.Users[userIndex]?.qtd}</span>
                                    <div className={styles.controlCardContainer}>
                                        {dashboardList.Users.map((item, index) => (
                                            <span
                                                key={item.name}
                                                className={index === userIndex ? styles.chosen : ''}
                                            ></span>
                                        ))}
                                    </div>
                                    {userIndex !== 0 ? (
                                        <button
                                            className={styles.left}
                                            onClick={() => setUserIndex(userIndex - 1)}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                    ) : null}
                                    {userIndex < dashboardList.Users.length - 1 ? (
                                        <button
                                            className={styles.right}
                                            onClick={() => setUserIndex(userIndex + 1)}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    ) : null}
                                </div>

                                <div className={styles.card2item2}>
                                    <span className={styles.text}>{dashboardList.Residences[residencesIndex]?.name}</span>
                                    <span className={styles.number}>{dashboardList.Residences[residencesIndex]?.qtd}</span>
                                    <div className={styles.controlCardContainer}>
                                        {dashboardList.Residences.map((item, index) => (
                                            <span
                                                key={item.name}
                                                className={index === residencesIndex ? styles.chosen : ''}
                                            ></span>
                                        ))}
                                    </div>
                                    {residencesIndex !== 0 ? (
                                        <button
                                            className={styles.left}
                                            onClick={() => setResidencesIndex(residencesIndex - 1)}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                    ) : null}
                                    {residencesIndex < dashboardList.Residences.length - 1 ? (
                                        <button
                                            className={styles.right}
                                            onClick={() => setResidencesIndex(residencesIndex + 1)}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    ) : null}
                                </div>
                        </section>
                        
                        <section className={styles.section3}>
                                <div className={styles.card1item1}>
                                    <span>
                                        {dashboardList.StatusApartment[0]?.qtd} - {dashboardList.StatusApartment[0]?.name}
                                    </span>
                                    <div className={styles.circuloContainer}>
                                        <div
                                            className={styles.circuloContainerRadius}
                                            style={{ height: `${dashboardList.StatusApartment[0]?.Percentage ?? 0}%` }}
                                        >
                                            <div className={styles.percentage}>
                                                <span>{dashboardList.StatusApartment[0]?.Percentage ?? 0}%</span>
                                                <span>{dashboardList.StatusApartment[1]?.Percentage ?? 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span>
                                        {dashboardList.StatusApartment[1]?.qtd} - {dashboardList.StatusApartment[1]?.name}
                                    </span>
                                </div>
                                <div className={styles.card1item2}>
                                    <span>Média de ocupação do salão</span>
                                    <div
                                        className={styles.imgArea}
                                        style={{ height: `${dashboardList.OccupancyRate}%` }}>
                                        <span>{dashboardList.OccupancyRate}%</span>
                                    </div>
                                </div>
                        </section>
                        
                        <section className={styles.section4}>
                                <div className={styles.card2item1}>
                                    <span>Avaliações</span>
                                    <div className={styles.avaliation}>
                                        <div className={styles.info}>
                                            <span className={styles.number}>
                                                {dashboardList.Avaliation.average.toFixed(1)}
                                            </span>
                                            <span>Todas - {dashboardList.Avaliation.qtd}</span>
                                        </div>
                                        {dashboardList.Avaliation.average >= 1 &&
                                        dashboardList.Avaliation.average < 2 ?
                                        (<MdOutlineSentimentVeryDissatisfied style={{color:'red'}}/>):null}

                                        {dashboardList.Avaliation.average >= 2 &&
                                        dashboardList.Avaliation.average < 3 ?
                                        (<MdSentimentVeryDissatisfied style={{color:'orange'}}/>):null}

                                        {dashboardList.Avaliation.average >= 3 &&
                                        dashboardList.Avaliation.average < 4 ?
                                        (< MdSentimentNeutral style={{color:'#FFD700'}}/>):null}
                                        
                                        {dashboardList.Avaliation.average >= 4 &&
                                        dashboardList.Avaliation.average < 5 ?
                                        (< MdOutlineSentimentSatisfiedAlt style={{color:'#32CD32'}}/>):null}

                                        {dashboardList.Avaliation.average >= 5 ?
                                        (< MdOutlineSentimentVerySatisfied style={{color:'#2E8B57'}}/>):null}
                                    </div>
                                </div>
                                
                                <div className={styles.card2item2}>
                                    <span>Apartamentos com mais reservas</span>
                                    <div className={styles.containerList}>
                                        {dashboardList.TopApartments.map((item)=>{
                                            return(
                                                <>
                                                    {item._count.Reservations > 0 ?(
                                                        <span key={item.id} className={styles.list}>
                                                            <span className={styles.text}>Torre - {item.tower.numberTower} Apt - {item.numberApt}</span>
                                                            <div className={styles.containerBar}>
                                                                <span className={styles.bar}>
                                                                    <span className={styles.progress} 
                                                                    style={{width:`${item.percentage}%`}}></span>
                                                                </span>
                                                                <span>
                                                                    {item._count.Reservations}
                                                                </span>
                                                            </div>
                                                        </span>
                                                    ):null}
                                                </>

                                            )
                                        })}
                                    </div>
                                </div>
                        </section>

                        <section className={styles.section5}>
                                <span className={styles.text}>Reservas</span>
                                <div className={styles.card1item2}>
                                    {dashboardList.Reservations.map((item) => (
                                        <span key={item.name} className={styles.barArea}>
                                            <span className={styles.legends}>
                                                <span>{item.qtd}</span>
                                                <span>{item.name}</span>
                                            </span>
                                            <span
                                                style={{ height: `${item.percentage}%` }}
                                                className={styles.bar}> 
                                            </span>
                                        </span>
                                    ))}
                                </div>
                        </section>

                        <section className={styles.section6}>
                                <div className={styles.card2item1}>
                                    <span className={styles.legend}>Média de Início das Reservas</span>
                                    <span>{dashboardList.AverageStartReservation}</span>
                                </div>
                                <div className={styles.card2item2}>
                                    <span className={styles.legend}>Média de término das Reservas</span>
                                    <span>{dashboardList.AverageFinishReservation}</span>
                                </div>
                                <div className={styles.card2item2}>
                                    <span className={styles.legend}>Média de duração</span>
                                    <span>{dashboardList.AverageDurationReservation}</span>
                                </div>
                                <div className={styles.card2item2}>
                                    <span className={styles.legend}>
                                        Média para aprovação das reservas
                                    </span>
                                    <span>{dashboardList.TimeApproveReservation}</span>
                                </div>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    };
})
