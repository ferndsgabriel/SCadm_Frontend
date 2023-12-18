import Link from "next/link"
import styles from "./styles.module.scss"
import {AiOutlineClose, AiOutlineSchedule, AiOutlineMenu } from "react-icons/ai"
import {IoPeopleOutline} from "react-icons/io5";
import { MdApartment } from "react-icons/md";
import {FiSettings} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter} from 'next/router';

export default function Header(){
    const [openNav, setOpenNav] = useState(false);
    const routerActual = useRouter().pathname;
    
    useEffect(()=>{
        function closeNavWithEsc(e:KeyboardEvent){
            if (openNav){
                if (e.key === 'Escape'){
                    setOpenNav(false);
                }   
            }else{
                return;
            }
        }
        document.addEventListener('keydown', closeNavWithEsc);

        return ()=> document.removeEventListener('keydown', closeNavWithEsc);
    },[openNav]);

    return (
        <>
        {openNav?(
            <span className={styles.bgNav} onClick={()=>setOpenNav(false)}/>
        ):null}

        <header className={styles.header}>
            <div className={styles.container}>
                <Link href={'/reservation'}>
                    <img src="SalãoCondoHeader.svg" alt={'Logo Svg'}/>
                </Link>

                {openNav?(
                    <button onClick={()=>setOpenNav(false)} className={styles.buttonMenu}>
                        <AiOutlineClose/>
                    </button>
                ):(
                    <button onClick={()=>setOpenNav(true)} className={styles.buttonMenu}>
                        <AiOutlineMenu/>
                    </button>
                )}

                <nav style={openNav?{display:'block'}:{display:''}}>
                    <ul>
                        <li>
                            <Link href={'/reservation'}
                            className={routerActual === '/reservation'?styles.activeNav:''}>
                                <span>Reservas</span>
                                <AiOutlineSchedule/>        
                            </Link>
                        </li>  

                        <li>
                            <Link href={'/start'}
                            className={routerActual === '/start'?styles.activeNav:''}>
                                <span>Moradores</span>
                                <IoPeopleOutline/>
                            </Link>
                        </li>

                        <li>
                            <Link href={'/apartments'}
                            className={routerActual === '/apartments'?styles.activeNav:''}>
                                <span>Residências</span>
                                < MdApartment/>
                            </Link>
                        </li>

                        <li>
                            <Link href={'/settings'}
                            className={routerActual === '/settings'?styles.activeNav:''}>
                                <span>Configurações</span>
                                <FiSettings/>
                            </Link>
                        </li>  
                    </ul>
                </nav>
            </div>
        </header>

        <div className={styles.breakline}>
        </div> 
        </>
    )
}