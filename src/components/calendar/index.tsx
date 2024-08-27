import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function Calendar({ trueReservations, newReservations }) {
    const [reservationTrueCalendar, SetReservationTrueCalendar] = useState([]);
    const [reservationNewCalendar, setReservationNewCalendar] = useState([]);

    const [daysBefore, setDaysBefore] = useState([]);
    const monthNow = new Date().getMonth();
    const yearNow = new Date().getFullYear();
    const [monthCalendar, setMonthCalendar] = useState(monthNow);
    const [yearCalendar, setYearCalendar] = useState(yearNow);
    const [nextMonthBoolean, setNextMonthBoolean] = useState(false);
    const [calendar, setCalendar] = useState([]);

    const monthString = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function formatInDate(date) {
        if (date !== null) {
            const dateString = date.toString();
            const year = dateString.substring(0, 4);
            const month = dateString.substring(4, 6);
            const day = dateString.substring(6, 8);
            const monthInt = parseInt(month);
            const inDate = new Date();
            inDate.setDate(parseInt(day));
            inDate.setFullYear(parseInt(year));
            inDate.setMonth(monthInt - 1);
            return inDate;
        }
    }

    useEffect(() => {
        const formatByTrue = trueReservations.map((item) => formatInDate(item.date));
        SetReservationTrueCalendar(formatByTrue);
    
        const formatByNew = newReservations.map((item) => formatInDate(item.date));
        setReservationNewCalendar(formatByNew);
    
        const onDay = new Date();
        const lastDay = onDay.getDate();
    
        for (var x = 1; x <= lastDay; x++) {
            const days = new Date();
            days.setDate(x);
            setDaysBefore((prevDays) => [...prevDays, new Date(days)]);
        }
    }, [newReservations, trueReservations]);

    useEffect(() => {
        const currentDate = new Date();
        currentDate.setMonth(monthCalendar);
        currentDate.setFullYear(yearCalendar);
    
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();
    
        const newCalendar = [];
        let dayOfMonth = 1;
    
        for (let i = 0; i < 6; i++) {
        const row = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek) {
            row.push(null);
            } 
        else if (dayOfMonth <= daysInMonth) {
    
            const isNew = reservationNewCalendar.some(
                (reservation) =>
                new Date(reservation).getDate() === dayOfMonth &&
                new Date(reservation).getMonth() === monthCalendar &&
                new Date(reservation).getFullYear() === yearCalendar
            );
    
            const isTrue = reservationTrueCalendar.some(
                (reservation) =>
                new Date(reservation).getDate() === dayOfMonth &&
                new Date(reservation).getMonth() === monthCalendar &&
                new Date(reservation).getFullYear() === yearCalendar
            );
    
            const daysPast = daysBefore.some(
                (reservation) =>
                new Date(reservation).getDate() === dayOfMonth &&
                new Date(reservation).getMonth() === monthCalendar &&
                new Date(reservation).getFullYear() === yearCalendar
            );
    
            row.push({ day: dayOfMonth, isTrue, isNew, daysPast });
            dayOfMonth++;
            } else {
            row.push(null);
            }
        }
        newCalendar.push(row);
        }
        setCalendar(newCalendar);
    }, [monthCalendar, reservationTrueCalendar, reservationNewCalendar, yearCalendar]);

    function changeMonth(number) {
        setNextMonthBoolean(!nextMonthBoolean);
        const newMonth = monthCalendar + number;
        if (newMonth > 11) {
            setMonthCalendar(0);
            setYearCalendar(yearCalendar + 1);
        } else {
            setMonthCalendar(newMonth);
        }
        if (newMonth < 0) {
            setMonthCalendar(11);
            setYearCalendar(yearCalendar - 1);
        }
    }

    return (
        <section className={styles.calendarArea}>

            <article className={styles.dateInfo}>
                <button onClick={() => changeMonth(-1)} disabled={!nextMonthBoolean}><AiOutlineLeft /></button>
                <p>{monthString[monthCalendar]} - {yearCalendar}</p>
                <button onClick={() => changeMonth(+1)} disabled={nextMonthBoolean}><AiOutlineRight /></button>
            </article>

            <table className={styles.calendar}>
            <thead>
                <tr>
                <th>Dom</th>
                <th>Seg</th>
                <th>Ter</th>
                <th>Qua</th>
                <th>Qui</th>
                <th>Sex</th>
                <th>Sáb</th>
                </tr>
            </thead>
            <tbody>
                {calendar.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>
                        {cell ? (
                        <span
                            style={{
                            backgroundColor: cell.isTrue ? '#51AB7B' : (cell.isNew ? '#405971' : ''),
                            color: cell.isTrue ? 'white' : (cell.isNew ? 'white' : (cell.daysPast ? 'gray' : '')),
                            pointerEvents: cell.isTrue || cell.isNew || cell.daysPast ? 'none' : 'auto',
                            }}
                        >
                            {cell.day}
                        </span>
                        ) : null}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>

            <article className={styles.legends}>
                <p style={{ color: "#51AB7B", fontSize: '1.2rem' }}>Aprovadas</p>
                <p style={{ color: '#405971', fontSize: '1.2rem' }}>Aguardando resposta</p>
            </article>
        </section>
    )
}
