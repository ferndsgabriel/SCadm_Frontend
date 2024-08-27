import Gmodal from "../../default";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";

export default function NewTowerModal({isOpen, onClose}){

    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [createTowerInput, setCreateTowerInput] = useState ('');

    async function handleCreateTower(e:FormEvent){
        e.preventDefault();
        if (createTowerInput === ""){
            toast.warning('Por favor, insira a torre desejada.');
            return;
        }
        setLoadingModal(true);
        try{
            await setupApi.post('/adm/towers',{          
                numberTower:createTowerInput
            });
            toast.success('Torre criada com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setLoadingModal(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setCreateTowerInput('');
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onSubmit={handleCreateTower}>
                <div className='beforeButtons'>
                    <h3>Criar torre</h3>
                    <p>Insira o valor para a nova torre:</p>
                    <input placeholder="Digite aqui a torre:" 
                    className='inputModal' autoFocus={true}
                    value={createTowerInput}
                    onChange={(e)=> setCreateTowerInput(e.target.value)}/>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='buttonSlide'
                    disabled={loadingModal}>Criar</button>
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
    </Gmodal>

    )
}