import Gmodal from "../../default";

export default function FilterUserModal({isOpen, onClose, setTowerFilter, 
    towerFilter, allTowersList, setIsOpenFilterByTower}){

    function changeTowerFilter(e:React.ChangeEvent<HTMLSelectElement>){
        const indexOption = parseInt(e.target.value);
        setTowerFilter(indexOption);
    }

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <div className='modalContainer'> 
                <div className='beforeButtons'>
                    <h3>Filtrar por torre</h3>
                    <p>Selecione a torre</p>

                    <select value={towerFilter} onChange={changeTowerFilter}autoFocus={true}>
                        {allTowersList.filter((item)=>item.apartment.length > 0
                        ).map((item, index)=>{
                        return(
                            <option key={item.id} value={index}>
                            {item.numberTower}
                            </option>
                        )
                        })}
                    </select>
                </div>
                
                <div className='buttonsModal'>
                    <button onClick={()=>setIsOpenFilterByTower(false)} className='buttonSlide' autoFocus={true}>Filtrar</button>
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>   
                </div> 
            </div>
        </Gmodal>
    )
}