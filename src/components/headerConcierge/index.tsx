import styles from "./styles.module.scss";
import { IoSunny, IoMoon} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import Router from "next/router";
import { destroyCookie } from "nookies";

export default function HeaderConcierge (){
    const routerActual = useRouter().pathname;
    const {changeThemes, dark} = useContext(ThemeContext);

    function signOut(){
        try{
            destroyCookie(undefined, "@SalaoCondoPort.token");
            Router.push('/')
        }catch{
            console.log('Error ao deslogar');
        }
    }

    return(
        <>
            <header className={styles.headerAreaConcierge}>
                <Link href={'/start'}>
                    <img src="/iconDark.svg" alt="icon"/>
                </Link>
                    
                    <ul className={styles.ulCocierge}>
                        <li className={styles.liTheme}>   
                            <label className={`${styles.labelTheme} ${dark? styles.labelDark : styles.labelLight}`}>
                                {!dark ?(
                                    <IoSunny className={styles.svgSun}/>
                                ):(
                                    <IoMoon className={styles.svgMoon}/>
                                )}
                                <input type='checkbox' checked={dark} onChange={(e)=>changeThemes(e.target.checked)}/>
                            </label>
                        </li>
                        
                        <li className={styles.li}>
                            <Link href={'/guests'}
                            className={routerActual === '/guests'?styles.activeNav:''}>
                                Convidados
                            </Link>
                        </li>  

                        <li className={styles.li}>
                            <a onClick={signOut}>Sair</a>
                        </li>  
                        
                    </ul>
            </header>
            <span className={styles.breakArea}></span>
        </>
    )
}