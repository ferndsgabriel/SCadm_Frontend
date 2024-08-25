import React, { ReactNode, useRef } from 'react';
import styles from "./styles.module.scss";
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?:string
}

export default function Gmodal ({ isOpen, onClose, children, className }:ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const {dark} = useContext (ThemeContext);


    function clickClose(e: React.MouseEvent<HTMLDivElement>): void {
        if (e.target === overlayRef.current) {
            onClose();
        }
    }

    function escClose (e:KeyboardEvent){
        if (e.key === 'Escape'){
            onClose();
        }
        return  window.removeEventListener('keydown', escClose);
    }

    window.addEventListener('keydown', escClose);

    return (
        <>
            {isOpen ? (
                <div
                    className={styles.overlay}
                    onClick={clickClose}
                    ref={overlayRef}
                    style={{
                    backgroundColor: dark ? 'rgba(22,31,40,0.7)' : 'rgba(255,255,255,0.5)', 
                    }}>
                    <div className={className} ref={mainRef}>
                        {children}
                    </div>
                </div>
            ):null}
        </>
        
    )
}
