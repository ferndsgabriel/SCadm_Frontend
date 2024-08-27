import Gmodal from "../../default";
import { useState, FormEvent, useEffect} from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";

export default function CreateAptModal({isOpen, onClose, towers}){
    
    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [createAptInput, setCreateAptInput] = useState ('');
    const [changeTowerCreateApt, setChangeTowerCreateApt] = useState(0);
    

    function handleTowerCreateApt(e: React.ChangeEvent<HTMLSelectElement>) {
        const towerIndex = parseInt (e.target.value);
        setChangeTowerCreateApt(towerIndex);
        console.log(towerIndex);
    }

    async function handleCreateApt(e:FormEvent){
        e.preventDefault();
        
        if (createAptInput === '' ){
            toast.warning('Por favor, insira o número do apartamento.');
            return;
        }

        setLoadingModal(true);
        try{
            await setupApi.post("/adm/apt",{
                numberApt:createAptInput,
                tower:towers[changeTowerCreateApt].id
            });
            toast.success('Apartamento criado com sucesso!');
            onClose();
        }
        catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            console.log(error);
        }finally{
            setLoadingModal(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setCreateAptInput('');
        }
    },[onClose]);

    return(
        <>
            <Gmodal isOpen={isOpen}
                onClose={onClose}
                className='modal'>   
                    <form className='modalContainer' onSubmit={handleCreateApt}>
                        <div className='beforeButtons'>
                            <h3>Criar apartamento</h3>
                            <p>Selecione a torre:</p>
                            <select value={changeTowerCreateApt} onChange={handleTowerCreateApt}>
                                {towers.map((item, index)=>{
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.numberTower}
                                        </option>
                                    )
                                })}
                            </select>
                            <input placeholder="Digite o novo apartamento:" 
                            className='inputModal' autoFocus={true}
                            value={createAptInput}
                            onChange={(e)=> setCreateAptInput(e.target.value)}/>
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
        </>


    )
}