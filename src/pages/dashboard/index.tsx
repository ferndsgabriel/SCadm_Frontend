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
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
PieChart, Pie, Cell, LabelList, Line, LineChart} from 'recharts';
import { CiCalendarDate } from "react-icons/ci";
import { FaCalendarDays } from "react-icons/fa6";
import { Loading } from "../../components/loading";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ImEnlarge } from "react-icons/im";
import { MdCloseFullscreen } from "react-icons/md";
import Head from "next/head";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        occupied: number;
        limit: number;
        attended:number
    };
    Payers:{
        name:string,
        Inadimplentes:number,
        Adimplentes:number
    }[];
    Avaliation: {
        data:{
            name:string,
            media: number;
        }[];
        qtd:number
        averageRating:number
    }
    WithMoreReservation:{
        name:string,
        reservas:number | string
    }[];
    ReservationsPerMonth:{
        month: number;
        reservations: number;
    }[];
    AverageTimeToAccept:string;
};


export default function Dashboard() {
    const setupApi = SetupApiClient();
    const onDay = new Date();
    const min = new Date(2024, 0, 1);
    const [dateFilter, setDateFilter] = useState(onDay);

    const [dashboardList, setDashboardList] = useState<DashboardType>();
    const [loading, setLoading] = useState(true);
    const [large, setLarge] = useState(false);
    const [calendarSection, setCalendarSection] = useState(0);

    const COLORS = ['var(--Sucess)', 'var(--Primary-normal)', 'var(--Blue)', 'var(--Error)'];
    const COLORS3 = ['var(--Sucess)', 'var(--Primary-normal)', 'var(--Blue)'];


    const responsive = {
        desktop2: {
            breakpoint: {max: 99999, min:  1366 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 1366, min:  1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 640, min: 1 },
            items: 1
        }
    };


    useEffect(() => {
        
        async function refreshData(value:Date) {
            const dateToDate =  value || new Date();
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

        refreshData(dateFilter);
    }, [dateFilter]);


    const CustomLabel = ({ x, y, value, width }) => {
        if (value === 0) return null;
        return (
            <text
                x={x + width / 2} 
                y={y + 10} 
                fill="white"
                textAnchor="middle"
                dominantBaseline="middle" 
                style={{ fontSize: '12px' }}
            >
                {value}
            </text>
        );
    };

    const getColorForRating = (rating:number) => {
        const roundedRating = Math.floor(rating);
        const colors = {
            5: 'var(--Sucess)',    
            4: 'var(--Blue)',      
            3: '#9C975E',            
            2: '#7B593B',           
            1: 'var(--Error)'        
        };
        return colors[roundedRating] || 'rgba(0, 0, 0, 0.1)';
    };

    if (loading) {
        return <Loading />;
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////
    const data = [
        { name: 'Limpeza', media: 4.5 },
        { name: 'Espaço', media: 4.0 },
        { name: 'Rapidez', media: 4.2 },
        { name: 'Facilidade', media: 4.8 },
    ];
    //////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>  
            <Head>
                <title>SalãoCondo - Dashboard</title>
            </Head>
            {!large && <Header /> }
            <div className={`${styles.bodyArea} ${large? styles.large : ''} `}>
                <main className={styles.container}>
                    <article className={styles.legends}>
                        <h1>Dashboard</h1>
                        <div className={styles.dateAndLarge}>
                            <DatePicker
                                selected={dateFilter || undefined} 
                                onChange={(date: Date | null) => setDateFilter(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dia/mês/ano"
                                maxDate={onDay}
                                minDate={min}
                                className={styles.inputDate}
                                calendarClassName={styles.calendar}
                                />
                            {large ? (
                                <button onClick={()=>setLarge(false)}><MdCloseFullscreen/></button>
                            ):(
                                <button onClick={()=>setLarge(true)}><ImEnlarge/></button>
                            )}           
                        </div>
                    </article>

                    
                    <article className={styles.dashboardOptions}>
                        <button onClick={()=>setCalendarSection(0)}
                        className={calendarSection === 0 ? styles.buttonStyle : ''}>Seção 1</button>
                        <button onClick={()=>setCalendarSection(1)}
                        className={calendarSection === 1 ? styles.buttonStyle : ''}>Seção 2</button>
                    </article>
                    

                    
                    <section className={styles.allCalendar}>
                        {calendarSection === 0 ?(
                            <>
                                <article className={styles.carouselContainer}>               
                                    <Carousel responsive={responsive} className={styles.carousel}>
                                        <article className={styles.totalValues}>
                                            <span>
                                                <h3>Total arrecadado com taxas</h3>
                                                <MdOutlineAttachMoney />
                                            </span>
                                            <h4>R$ {dashboardList.TotalCollection}</h4>
                                                                            </article>
                                        
                                        <article className={styles.totalValues}>
                                            <span>
                                                <h3>Quantidade de reservas</h3>
                                                <CiCalendarDate />
                                            </span>
                                            <h4>{dashboardList.AllReservationMade}</h4>
                                                                            </article>

                                        <article className={styles.totalValues}>
                                            <span>
                                                <h3>Moradores cadastrados</h3>
                                                <FaUsers />
                                            </span>
                                            <h4>{dashboardList.Users}</h4>
                                                                            </article>

                                        <article className={styles.totalValues}>
                                            <span>
                                                <h3>Administradores cadastrados</h3>
                                                <RiAdminFill />
                                            </span>
                                            <h4>{dashboardList.Adms}</h4>
                                                                            </article>

                                        <article className={styles.totalValues}>
                                            <span>
                                                <h3>Apartamentos cadastrados</h3>
                                                <MdOutlineApartment />
                                            </span>
                                            <h4>{dashboardList.Apartaments}</h4>
                                                                            </article>

                                        <article className={styles.totalValues} >
                                            <span>
                                                <h3>Torres cadastradas</h3>
                                                <GiWhiteTower />
                                            </span>
                                            <h4>{dashboardList.Towers}</h4>
                                                                            </article>
                                    </Carousel>
                                </article>

                                <article className={styles.barChart}>
                                    <h3>Quantidade de reservas por mês</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={dashboardList.ReservationsPerMonth}
                                            margin={{
                                            top: 20, right: 30, left: 20, bottom: 5,
                                            }}
                                        >
                                            <XAxis dataKey="month" 
                                            tick={{ fontSize: '12px', fill: 'var(--Text)' }} 
                                            tickMargin={0}
                                            />
                                            <YAxis tick={{ fontSize: '12px', fill: 'var(--Text)'}}  
                                            width={30}/>
                                            <Tooltip cursor={{ fill: 'var(--Transparente)' }}/>
                                            <Line type="monotone" dataKey="reservations" stroke="var(--Primary-normal)" activeDot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </article>

                                <article className={styles.barChart}> 
                                    <h3>Quantidade de reservas feitas</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dashboardList.ReservationMadeDetails} 
                                        > 
                                            <XAxis 
                                                dataKey="name" 
                                                tick={{ fontSize: '12px', fill: 'var(--Text)' }} 
                                                tickMargin={0}
                                            />
                                            <YAxis 
                                                tick={{ fontSize: '12px', fill: 'var(--Text)'}} 
                                                width={30}
                                            />
                                            <Tooltip cursor={{ fill: 'var(--Transparente)' }} />
                                            <Bar dataKey="value" fill="#8884d8" style={{backgroundColor:'red'}}>
                                                {dashboardList.ReservationMadeDetails.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                                <LabelList  style={{backgroundColor:'red'}}
                                                    content={({ x, y, value, width }) => <CustomLabel x={x} y={y} value={value} width={width} />} 
                                                    dataKey="value" 
                                                    fontSize="14px" 
                                                    position="insideTop" 
                                                    fill="var(--White)"
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </article>
                            
                                <article className={styles.barChart}>
                                    <h3>Valores arrecadados com taxas</h3>
                                    <ResponsiveContainer width="100%" height="100%">                           
                                        <PieChart>
                                            <Pie 
                                                data={dashboardList.TotalCollectionDetails}
                                                dataKey="value"
                                                nameKey="category"
                                                outerRadius={'100%'}
                                                fill="var(--Primary-normal)"
                                    
                                                labelLine={false}
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                                                    const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                                    return (
                                                        <text x={x} y={y} fill="var(--White)" 
                                                        textAnchor="middle" 
                                                        dominantBaseline="central"
                                                        style={{ fontSize: '12px'}}>
                                                            {value !== 0 ? value : null}
                                                        </text>
                                                    );
                                                }}
                                            >
                                            
                                                <Cell key="Confirmadas" fill="var(--Sucess)" />
                                                <Cell key="Taxadas" fill="var(--Error)" />
                                                <Cell key="Limpeza" fill="var(--Primary-normal)" />
                                            </Pie>
                                            <Tooltip cursor={{ fill: 'var(--Transparente)' }} />
                                            <Legend 
                                                layout="horizontal" 
                                                verticalAlign="top" 
                                                align="left" 
                                                wrapperStyle={{ fontSize: '12px' }}
                                                content={() => (
                                                    <div>
                                                        <div style={{ color: 'var(--Sucess)',fontWeight:'bold' }}>● Confirmadas</div>
                                                        <div style={{ color: 'var(--Error)',fontWeight:'bold' }}>● Canceladas</div>
                                                        <div style={{ color: 'var(--Primary-normal)',fontWeight:'bold' }}>● Limpezas</div>
                                                    </div>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </article>

                                <article className={styles.barChart}>
                                    <h3>Adimplentes e Inadimplentes</h3>
                                    <ResponsiveContainer width="100%" height="100%">                           
                                        <PieChart>
                                            <Pie 
                                                data={dashboardList.Payers}
                                                dataKey="value"
                                                nameKey="category"
                                                outerRadius={'100%'}
                                                fill="var(--Primary-normal)"
                                    
                                                labelLine={false}
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                                                    const radius = innerRadius + (outerRadius - innerRadius) / 2;
                                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                                    return (
                                                        <text x={x} y={y} fill="var(--White)" 
                                                        textAnchor="middle" 
                                                        dominantBaseline="central"
                                                        style={{ fontSize: '12px'}}>
                                                            {value !== 0 ? value : null}
                                                        </text>
                                                    );
                                                }}
                                            >
                                            
                                                <Cell key="Confirmadas" fill="var(--Sucess)" />
                                                <Cell key="Taxadas" fill="var(--Error)" />
                                            </Pie>
                                            <Tooltip cursor={{ fill: 'var(--Transparente)' }} />
                                            <Legend 
                                                layout="horizontal" 
                                                verticalAlign="top" 
                                                align="left" 
                                                wrapperStyle={{ fontSize: '12px' }}
                                                content={() => (
                                                    <div>
                                                        <div style={{ color: 'var(--Sucess)',fontWeight:'bold' }}>● Adimplentes</div>
                                                        <div style={{ color: 'var(--Error)',fontWeight:'bold' }}>● Inadimplentes</div>
                                                    </div>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </article>


                            </>
                        ):(
                            <>
                                <article className={styles.media}>
                                    <div>
                                        <h3>Tempo para aprovar uma reserva</h3>
                                        <h4>{dashboardList.AverageTimeToAccept}</h4>
                                    </div>
                                    <p>Tempo médio para uma reserva ser aprovada</p>
                                </article>

                                <article className={styles.media}>
                                    <div>
                                        <h3>Média de convidados por reserva</h3>
                                        <h4>{dashboardList.OccupancyRate.occupied}/{dashboardList.OccupancyRate.limit}</h4>
                                    </div>
                                    <p>Média de convidados por reserva em comparação com o limite de {dashboardList.OccupancyRate.limit}</p>
                                </article>

                                <article className={styles.media}>
                                    <div>
                                        <h3>Presença Média</h3>
                                        <h4>{dashboardList.OccupancyRate.occupied}/{dashboardList.OccupancyRate.attended}</h4>
                                    </div>
                                    <p>Média de convidados presentes por reserva em comparação a média de convidados</p>
                                </article>
                                
                                <article 
                                className={`${styles.media} ${styles.barChart}`}>
                                    <h3 style={{fontWeight:'bold'}}>Avaliações de reservas - {dashboardList.Avaliation.qtd}</h3>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                layout="vertical"
                                                data={dashboardList.Avaliation.data}
                                                margin={{
                                                    top: 20, right: 20, left: 20, bottom: 20,
                                                }}
                                                barSize={20}
                                            >
                                                <XAxis
                                                    type="number"
                                                    domain={[0, 5]}
                                                    ticks={[0, 1, 2, 3, 4, 5]}
                                                    tick={{ fontSize: 12, fill: 'var(--Text)' }}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fontSize: 12, fill: 'var(--Text)' }}
                                                    width={46}
                                                />
                                                <Tooltip cursor={{ fill: 'var(--Transparente)' }} />
                                                <Bar dataKey="media">
                                                    {dashboardList.Avaliation.data.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={getColorForRating(entry.media)}
                                                        />
                                                    ))}
                                                    <LabelList
                                                        dataKey="media"
                                                        position="insideRight"
                                                        fill="#fff"
                                                        fontWeight='bold'
                                                        fontSize={12}
                                                        formatter={(value:any) => value == 0 ? '' : value} 
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                </article>

                                <article className={`${styles.media} ${styles.barChart}`}>
                                    <h3>Apartamentos com mais reservas</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                        data={dashboardList.WithMoreReservation} layout="vertical">
                                            <XAxis type="number" tick={{ fontSize: '12px', fill: 'var(--Text)'}} 
                                                width={12}/>
                                            <YAxis 
                                                tick={{ fontSize: '12px', fill: 'var(--Text)'}} 
                                                width={20} 
                                                type="category" 
                                                tickFormatter={(value, index: number) => (index + 1).toString()} 
                                            />
                                            <Tooltip cursor={{ fill: 'var(--Transparente)' }} />
                                            <Bar dataKey="reservas" fill="#8884d8">
                                                {dashboardList.WithMoreReservation.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS3[index % COLORS3.length]} />
                                                ))}
                                                <LabelList dataKey="name" position="center" style={{ fill: 'white',  fontSize:'12px'}} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </article>
                            </>
                        )}
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
}, ["admin"]);
