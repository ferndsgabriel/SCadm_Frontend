import styles from "./styles.module.scss";
import Header from "../../components/header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { useEffect, useState, useRef } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdOutlineApartment } from "react-icons/md";
import { GiWhiteTower } from "react-icons/gi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
PieChart, Pie, Cell, LabelList, Label, RadialBar, RadialBarChart} from 'recharts';
import { CiCalendarDate } from "react-icons/ci";
import { FaCalendarDays } from "react-icons/fa6";
import { Loading } from "../../components/loading";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
        data:{
            name:string,
            valie: number;
        }[];
        totalVotes:number,
        averageRating:number
    }
    WithMoreReservation:{
        name:string,
        reservas:number
    }[]

};


export default function Dashboard() {
    const setupApi = SetupApiClient();
    const dateInputRef = useRef(null);
    const onDay = new Date();
    const formattedDate = `${onDay.getFullYear()}-${String(onDay.getMonth() + 1).padStart(2, '0')}-${String(onDay.getDate()).padStart(2, '0')}`;
    const dateMin = '2024-01-01';
    const [dateFilter, setDateFilter] = useState(dateMin);

    const [dashboardList, setDashboardList] = useState<DashboardType>();
    const [loading, setLoading] = useState(true);
    const COLORS = ['rgb(19, 95, 19)', 'var(--Sucess)', 'var(--Primary-normal)', 'var(--Error)'];
    const COLORS2 = ['var(--Light)', 'var(--Primary-normal)'];
    const COLORS3 = ['rgb(19, 95, 19)', 'var(--Sucess)', 'var(--Primary-normal)'];
    const [calendarSection, setCalendarSection] = useState(0);

    const getColor = () => {
        const roundedValue = Math.floor(dashboardList.Avaliation.averageRating);
        
        if (roundedValue === 1) return 'var(--Error)';      
        if (roundedValue === 2) return '#ffa31d';   
        if (roundedValue === 3) return '#cdca79'; 
        if (roundedValue === 4) return 'var(--Sucess)';
        if (roundedValue === 5) return 'rgb(19, 95, 19)'; 
        
        return 'var(--Primary-normal)';
    };

    function openDate() {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    function formatDateToBr(date:string){
        const year = date.substring(0, 4);
        const month = date.substring(5,7);
        const day = date.substring(8, 10);
        return `${day}/${month}/${year}`
    }

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
        const dateToDate = value !== '' ? new Date(value) : new Date('2024-01-01')
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


    const CustomLabel = ({ x, y, value, width }) => {
        if (value === 0) return null;
        return (
            <text
                x={x + width / 2} // Centraliza horizontalmente
                y={y + 10} // Ajuste vertical para ficar dentro da barra
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle" // Centraliza verticalmente
                style={{ fontSize: '12px' }}
            >
                {value}
            </text>
        );
    };

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <Header />
            <div className={styles.bodyArea}>
                <main className={styles.container}>
                    <article className={styles.legends}>
                        <h1>Dashboard</h1>
                        <label className={styles.labelDate}>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                max={formattedDate}
                                min={dateMin}
                                ref={dateInputRef}
                                className={styles.inputContainer}

                            />
                            <div onClick={openDate} className={styles.newStyle}>
                                <p>{formatDateToBr(dateFilter)}</p>
                                < FaCalendarDays  />
                            </div>
                        </label>
                    </article>

                    <article className={styles.dashboardOptions}>
                        <button onClick={()=>setCalendarSection(0)}
                        className={calendarSection === 0 ? styles.buttonStyle : ''}>Seção 1</button>
                        <button onClick={()=>setCalendarSection(1)}
                        className={calendarSection === 1 ? styles.buttonStyle : ''}>Seção 2</button>
                    </article>

                    
                    <section className={styles.allCalendar}>

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
                                        <LabelList content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} />
                                    </Bar>
                                    <Bar dataKey="Taxadas" stackId="a" fill="var(--Error)">
                                    <LabelList content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} />
                                    </Bar>
                                    <Bar dataKey="Limpeza" stackId="a" fill="var(--Primary-normal)">
                                        <LabelList content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} />
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
                                                    {value !== 0 ? value : null}
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

                        <article className={styles.carousel}>               
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
                                        <LabelList content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} />
                                    </Bar>
                                    <Bar dataKey="Inadimplentes" fill="var(--Error)">
                                        <LabelList content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </article>
               
                        <article className={styles.barChart}>
                        <h3>Avaliação de reservas</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardList.Avaliation.data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={150}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {dashboardList.Avaliation.data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.name === "Média" ? getColor() : 'var(--Primary-normal)'}
                                            />
                                        ))}
                                        <Label
                                            value={`Média\n${dashboardList.Avaliation.averageRating}`}
                                            position="center"
                                            style={{ fontSize: '24px', color: 'var(--Text)' }}
                                        />
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [`${value}`, `${name}`]}
                                        labelFormatter={(label) => `Total de Avaliações: ${dashboardList.Avaliation.totalVotes}`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <h3>Total de avaliações - {dashboardList.Avaliation.totalVotes}</h3>
                        </article>

                        <article className={styles.barChart}>
                            <h3>Apartamentos com mais reservas</h3>
                            <ResponsiveContainer width="100%" height="100%"style={{marginRight:'24px'}}>
                                <BarChart 
                                data={dashboardList.WithMoreReservation} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" tick={false} />
                                    <Tooltip />
                                    <Bar dataKey="reservas" fill="#8884d8">
                                        {dashboardList.WithMoreReservation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS3[index % COLORS3.length]} />
                                        ))}
                                        <LabelList dataKey="name" position="center" style={{ fill: 'white',  fontSize:'12px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </article>

                    </section>
                           
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
