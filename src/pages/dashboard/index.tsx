import styles from "./styles.module.scss";
import Header from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineApartment } from "react-icons/md";
import { GiWhiteTower } from "react-icons/gi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
PieChart, Pie, Cell, LabelList} from 'recharts';
import { CiCalendarDate } from "react-icons/ci";
import { Loading } from "../../components/loading";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MdOutlineSentimentVeryDissatisfied, MdSentimentVeryDissatisfied, MdSentimentNeutral,  MdOutlineSentimentSatisfiedAlt, MdOutlineSentimentVerySatisfied } from "react-icons/md";

type DashboardType = {
    TotalCollection:number;
    Users:number;
    Adms:number;
    Apartaments:number;
    Towers:number;
    TotalCollectionDetails:{
        category: number; 
        tax: number; 
        confirmed: number; 
        cleaning: number
    }[];
    AllReservationMade:number;
    ReservationMadeDetails:{
        name: string, 
        value:number 
    }[];
    OccupancyRate:{
        name: string,
        convidados: string, 
        limite: number
    }[];
    Payers:{
        name:string,
        Inadimplentes:number,
        Adimplentes:number
    }[];
    Avaliation: {
        qtd: number;
        average: number;
    };
};



export default function Dashboard() {
    const setupApi = SetupApiClient();

    const onDay = new Date();
    const formattedDate = `${onDay.getFullYear()}-${String(onDay.getMonth() + 1).padStart(2, '0')}-${String(onDay.getDate()).padStart(2, '0')}`;
    const dateMin = '2024-01-01';
    const [dateFilter, setDateFilter] = useState(dateMin);
    const COLORS = ['rgb(19, 95, 19)', 'var(--Sucess)', 'var(--Primary-normal)', 'var(--Error)'];
    const [dashboardList, setDashboardList] = useState<DashboardType>();
    const [loading, setLoading] = useState(true);
    const COLORS2 = ['var(--Light)', 'var(--Primary-normal)'];
    const COLORS3 = ['rgb(19, 95, 19)', 'var(--Sucess)', 'var(--Primary-normal)'];

    
    const rawData = [
        { name: 'Morador 1', reservas: 30 },
        { name: 'Morador 2', reservas: 50 },
        { name: 'Morador 3', reservas: 40 },
      ];
      
      const data = rawData.sort((a, b) => b.reservas - a.reservas);

      const customGraphics = ({ x, y, payload }) => (
        <text x={x} y={y} dy={16} textAnchor="end" fill="#666" fontSize={12}>
          {payload.value}
        </text>
      );


    const responsiveSection = {
        mobile: {
            breakpoint: { max:999999999999, min: 1 },
            items: 1
        }
    };

    const responsive = {
        tablet: {
            breakpoint: { max: 99999999999, min: 768 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 768, min: 1 },
            items: 1
        }
    };

    function daysBetween(date1:string, date2:string) {
        const startDate = new Date(date1) as any;
        const endDate = new Date(date2) as any;
        const diffTime = Math.abs(endDate- startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }

    const getDaysBetween = daysBetween(formattedDate, dateFilter)


    async function refreshData(value:string) {
        const dateToDate = new Date(value)
        setLoading(true);
        try {
            const response = await setupApi.post('/adm/dashboard',{
                period:dateToDate
            });
            setDashboardList(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Erro ao obter dados da API.');
            setTimeout(refreshData, 500);
        }
    }

    useEffect(() => {
        refreshData(dateFilter);
    }, [dateFilter]);


    if (loading) {
        return <Loading />;
    }

    console.log(dashboardList)
    return (
        <>
            <Header />
            <div className={styles.bodyArea}>
                <main className={styles.container}>
                    <article className={styles.legends}>
                        <h1>Dashboard</h1>
                        <input type="date" value={dateFilter}
                        onChange={(e)=>setDateFilter(e.target.value)}
                        max={formattedDate}
                        min={dateMin}
                        />
                    </article>

                    <Carousel responsive={responsiveSection}>
                        <section className={styles.allCalendar1}>
                            <article className={styles.totalValues}
                            style={{border:'solid 2px var(--Sucess)'}}>
                                <span>
                                    <h3>Total arrecadado</h3>
                                    <MdOutlineAttachMoney />
                                </span>
                                <h4>$ {dashboardList.TotalCollection.toFixed(0)}</h4>
                                <p>Últimos {getDaysBetween} dias</p>
                            </article>
                        
                            <article className={styles.barChart}>
                                <h3>Valores arrecadados</h3>
                                <ResponsiveContainer width={'100%'}>
                                    <BarChart data={dashboardList.TotalCollectionDetails}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Confirmadas" stackId="a" fill="var(--Sucess)">
                                            <LabelList dataKey="Confirmadas" position="inside" fill="white" />
                                        </Bar>
                                        <Bar dataKey="Taxadas" stackId="a" fill="var(--Error)">
                                            <LabelList dataKey="Taxadas" position="inside" fill="white"/>
                                        </Bar>
                                        <Bar dataKey="Limpeza" stackId="a" fill="var(--Primary-normal)">
                                            <LabelList dataKey="Limpeza" position="inside" fill="white"/>
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </article>

                            <article className={styles.totalValues}
                            style={{border:'solid 2px #f88b37'}}>
                                <span>
                                    <h3>Quantidade de reservas</h3>
                                    <CiCalendarDate />
                                </span>
                                <h4>{dashboardList.AllReservationMade}</h4>
                                <p>Últimos {getDaysBetween} dias</p>
                            </article>

                            <article className={styles.barChart}> 
                                <h3>Quantidade de reservas</h3>
                                <ResponsiveContainer width={'100%'} height={'100%'}>
                                    <PieChart>
                                        <Pie
                                            data={dashboardList.ReservationMadeDetails}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={150}
                                            fill="#8884d8"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                                                return (
                                                    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central">
                                                        {value}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {dashboardList.ReservationMadeDetails.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </article>

                            <div className={styles.carousel}>               
                                <Carousel responsive={responsive}>
                                    <article className={styles.totalValues}
                                    style={{border:'solid 2px var(--Primary-normal)', width:'96%'}}>
                                        <span>
                                            <h3>Moradores cadastrados</h3>
                                            <FaUsers />
                                        </span>
                                        <h4>{dashboardList.Users}</h4>
                                        <p>Últimos {getDaysBetween} dias</p>
                                    </article>

                                    <article className={styles.totalValues}
                                    style={{border:'solid 2px var(--Primary-normal)', width:'96%'}}>
                                        <span>
                                            <h3>Administradores cadastrados</h3>
                                            <RiAdminFill />
                                        </span>
                                        <h4>{dashboardList.Adms}</h4>
                                        <p>Últimos {getDaysBetween} dias</p>
                                    </article>
                                </Carousel>
                            </div>
                            
                        </section>
                        
                        <section className={styles.allCalendar2}>
                            <article className={styles.carousel}>               
                                <Carousel responsive={responsive}>
                                    <article className={styles.totalValues}
                                    style={{border:'solid 2px var(--Primary-normal)',width:'96%'}}>
                                        <span>
                                            <h3>Apartamentos cadastrados</h3>
                                            <MdOutlineApartment />
                                        </span>
                                        <h4>{dashboardList.Apartaments}</h4>
                                        <p>Últimos {getDaysBetween} dias</p>
                                    </article>

                                    <article className={styles.totalValues}
                                    style={{border:'solid 2px var(--Primary-normal)',width:'96%'}}>
                                        <span>
                                            <h3>Torres cadastradas</h3>
                                            <GiWhiteTower />
                                        </span>
                                        <h4>{dashboardList.Towers}</h4>
                                        <p>Últimos {getDaysBetween} dias</p>
                                    </article>
                                </Carousel>
                            </article>

                            <article className={styles.barChart}>
                                <h3>Adimplentes e Inadimplentes</h3>

                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dashboardList.Payers}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Adimplentes" fill="var(--Sucess)">
                                            <LabelList dataKey="Adimplentes" position="insideTop" fill={'white'} />
                                        </Bar>
                                        <Bar dataKey="Inadimplentes" fill="var(--Error)">
                                            <LabelList dataKey="Inadimplentes" position="insideTop" fill={'white'} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>

                            </article>

                            <article className={styles.barChart}>
                                <h3>Média de ocupação do salão</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardList.OccupancyRate}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={150}
                                            fill="#8884d8"
                                            labelLine={false} 
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                                                return (
                                                    <text x={x} y={y} fill={'white'} textAnchor="middle" dominantBaseline="central">
                                                        {value}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {dashboardList.OccupancyRate.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </article>

                            <article className={styles.rating}>
                                <h3>Avaliações de reservas</h3>
                                <div className={styles.rateAndEmoji}>
                                    <h3>4.5</h3>
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
                                <p>Total - {dashboardList.Avaliation.qtd}</p>
                            </article>

                            <article>
                            <BarChart width={600} height={300} data={data} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" tick={customGraphics} />
                                <Tooltip />
                                <Bar dataKey="reservas">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS3[index % COLORS3.length]} />
                                ))}
                                <LabelList dataKey="reservas" position="insideRight" />
                                </Bar>
                            </BarChart>
                            </article>
                        </section>
                    </Carousel>
                    

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
