import React, { useEffect, useState, useRef, useContext, FormEvent } from "react";
import styles from "./styles.module.scss";
import { FaChevronDown, FaChevronLeft, FaPlus } from "react-icons/fa";
import { IoSend, IoChatbubbleEllipsesOutline, IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { IoConnection } from "../../utils/ioConnection";
import DateConverter from "../../utils/dateConverter";
import { SetupApiClient } from "../../services/api";


interface messageProps {
  content: string;
  conversation_id?: string;
  date?: Date;
  from: string;
  id?: string;
  to?: string;
  waiting?:boolean
  delivered:boolean
}

interface conversationProps{
  apartment_id: string;
  createDate: Date;
  id: string;
  undeliveredCount:number,
  lastMessage:{
    content: string;
    conversation_id: string;
    date: Date;
    from: string;
    id: string;
    to: string;
    waiting:boolean
    delivered:boolean
  }
    apartment:{
      numberApt:string;
      tower:{
          numberTower:string;
      }
      user:{
          photo:string | null;
          name:string;
      }[]
  };

}

interface apartamentProps{
  apartment_id: string;
  numberApt: string;
  numberTower: string;
  conversation_id:string;
}

interface listNewApartementProps{
  id:string;
  numberApt:  string;
  user:{
    photo:string;
    name:string;
  }[];
  tower:{
    numberTower: string;
  };
  tower_id:string
}

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const io = IoConnection;
  const [conversationList, setConversationList] = useState<conversationProps[]>([]);
  const [apartmentId, setApartmentId] = useState<apartamentProps | null>(null);
  const [messages, setMessages] = useState<messageProps[]>([]);
  const [text, setText] = useState('');
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [inputSearch, setInputSearch] = useState('');
  const bodyRef = useRef<HTMLUListElement>(null);
  const isOpenRef = useRef(isOpen);
  const apartmentIdRef = useRef<apartamentProps | null>(null);
  const [alerts, setAlerts] = useState(0);

  const [apts, setApts] = useState<listNewApartementProps[]>([]);
  const [filteredApts, setFilteredApts] = useState<listNewApartementProps[]>([]);

  useEffect(()=>{
    const api = SetupApiClient();

    async function  getApts() {
      try {
        const response = await api.get('/apts');
        setApts(response.data);
        setFilteredApts(response.data);
      } catch (error) {
        console.log(error);
      }   
    }
    getApts();

  },[])


  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    apartmentIdRef.current = apartmentId;
  }, [apartmentId]);

  useEffect(() => {
    io.connect();

    io.emit("admConnected", {ok:true});

    io.on("listConversation", (data:conversationProps[]) => {
      setConversationList(data);
    })


    io.on('newMessage', (data) => {

      io.on("listConversation", (data:conversationProps[]) => {
        setConversationList(data);
      });

      const currentApartmentId = apartmentIdRef.current;
    
      if (isOpenRef.current && currentApartmentId !== null) {
        if (data.conversation_id === currentApartmentId.conversation_id) {
          io.emit('deliverMessageAdm', { id: currentApartmentId.apartment_id });
        }
      }
    
      setMessages((prev) => {
        const messageExists = prev.some((msg) =>
          msg.waiting && msg.date.getTime() === new Date(data.date).getTime()
        );
    
        if (messageExists) {
          return prev.map((msg) =>
            msg.waiting && msg.date.getTime() === new Date(data.date).getTime()
              ? { ...msg, ...data, waiting: false }
              : msg
          );
        } else {
          console.log(data)

          if (Notification.permission === 'granted') {
            
            new Notification("Um morador te enviou uma mensagem:", {
              body:data.content,
              icon: './Icon.svg'
            });
          }else{
            alert("tste vc é gay")
          }
          return data.conversation_id === currentApartmentId?.conversation_id
            ? [...prev, data]
            : prev;
            
        }
      });
    });
    
    io.on('messageDeliveredAdm', (data) => {
      if (Array.isArray(data)) { 
        setMessages((prev) =>
          prev.map((msg) =>
            data.some(deliveredMsg => deliveredMsg.id === msg.id) ? { ...msg, delivered: true } : msg
          )
        );
      } else {
        console.error('errror');
      }
    });

    return () => {
      io.off('newMessage');
      io.off('listConversation'); 
      io.off('admConnected');
      io.off('messageDeliveredAdm');
      io.disconnect(); 
    };
  }, []);

  useEffect(() => {
    if (isOpen && apartmentId !== null) {
      io.emit('deliverMessageAdm', { id: apartmentId.apartment_id });
    }
    if (isOpen) {
      if (bodyRef.current) {
        const element = bodyRef.current;
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isOpen, apartmentId]);

  useEffect(() => {
    if (bodyRef.current) {
      const element = bodyRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]); 

  useEffect(() => {
    if (inputSearch.trim() === "") {
      setFilteredApts(apts);
    } else {
      const searchTerm = inputSearch.toLowerCase();
      const filtered = apts.filter((apt) => {
        const searchString = `torre ${apt.tower.numberTower} - apartamento ${apt.numberApt}`.toLowerCase();
        return searchString.includes(searchTerm);
      });
      setFilteredApts(filtered);
    }
  }, [inputSearch, apts]);
  

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permissão de notificação concedida.');
        }
      });
    }
  }, []);
  
  function joinConversation({apartment_id, numberApt, numberTower, conversation_id}:apartamentProps) {
    const data = {
      apartment_id: apartment_id,
      numberApt: numberApt,
      numberTower: numberTower,
      conversation_id: conversation_id
    };
    
    setApartmentId(data);
    setIsNewConversation(false);
    io.emit('apartmentId', { id: apartment_id });
  }
  

  useEffect(() => {
    if (setApartmentId) {
      io.on('oldMessages', (data) => {
        if (data && data.messages){
          setMessages(data.messages);
        }  
      });
    }

  },[setApartmentId])

  function sendMessage(e: FormEvent) {
    e.preventDefault();

    if (text && apartmentId) {

      const date = new Date();

      const pushList = {
        content: text,
        from:'admin',
        waiting:true,
        date: date,
        delivered:false
      }

      setMessages((prev)=>[...prev, pushList]);
      io.emit('sendMessageAdm', { id:apartmentId.apartment_id, content: text, date:date });
    }
    setText('');
  }


  useEffect(  () => {

    if (conversationList.length > 0 ){
      const getMessages = conversationList.filter((item)=>{
        return item.undeliveredCount > 0;
      });
      setAlerts(getMessages.length);
    }


  },[conversationList, messages])

  return (
    <>
      {isOpen?(
        <article className={styles.container}>
          {apartmentId !== null ? (
            <>
              <header className={styles.headerConversations }>
                <div className={styles.userAndBack}>
                  <button onClick={() => setApartmentId(null)} ><FaChevronLeft/></button>
                  <p> Torre {apartmentId.numberTower} - Apartamento {apartmentId.numberApt}</p>
                </div>

                <button className={styles.closeArrow}
                onClick={() =>setIsOpen(false)}>
                  <FaChevronDown />
                </button>
              </header>

              <ul className={styles.body} ref={bodyRef}>
                {messages.length > 0 && messages.map((item) => (
                  <li key={item.id} className={`${item.waiting ? ` ${styles.fromAdmin} ${styles.waiting}`: '' } 
                    ${item.from === 'admin' ? styles.fromAdmin : styles.fromUser}`}>
                  <p className={styles.content}>{item.content}</p>
                    <div className={styles.dateAndMark}>
                      <p className={styles.date}>{DateConverter(item.date)}</p>
                      {item.from === 'admin' && (
                        item.delivered?(
                          < IoCheckmarkDoneSharp/>
                        ):(
                          <IoCheckmarkSharp/>
                        )
                      )}

                    </div>
                  </li>
                ))}
              </ul>

              <form className={styles.send} onSubmit={sendMessage}>
                <input
                  placeholder="Digite sua mensagem aqui..."
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" disabled={!text}>
                  <IoSend />
                </button>  
              </form>
            </>
          ):(
            <>
              <header className={styles.headerConversations }>
                {isNewConversation ? (
                  <button onClick={() => setIsNewConversation(false)}><IoChatbubbleEllipsesOutline/></button>
                ):(
                  <button onClick={() => setIsNewConversation(true)}><FaPlus/></button>
                )}
                
                <button className={styles.closeArrow}
                onClick={() =>setIsOpen(false)}>
                  <FaChevronDown />
                </button>
              </header>
              {isNewConversation ? (
                <>
                  <div className={styles.search}>
                    <span>Nova conversa</span>
                    <input
                      type="text"
                      placeholder="Digite o apartamento"
                      value={inputSearch}
                      onChange={(e) => setInputSearch(e.target.value)} 
                    />
                  </div>
                  
                  <ul className={styles.bodyConversation} ref={bodyRef}>
                    {filteredApts.map((item) => (
                      <>
                        {item.user && item.user.length > 0 && (
                          <li key={item.id} onClick={() => joinConversation({
                            apartment_id: item.id,
                            numberTower: item.tower.numberTower,
                            numberApt: item.numberApt,
                            conversation_id: ''
                          })} className={styles.liConversation}>
                            <div className={styles.leftSide}>
                              {item.user[0] && item.user[0].photo ? (
                                <img src={item.user[0].photo} alt={item.user[0].name} />
                              ) : (
                                <img src='./noAvatar.jpg' alt='sem foto' />
                              )}

                              <div className={styles.coversationInfo}>
                                <span>Torre {item.tower.numberTower} - Apartamento {item.numberApt}</span>
                              </div>
                            </div>
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </>
              ):(
                <ul className={styles.bodyConversation} ref={bodyRef}>
                  {conversationList && conversationList.length > 0 ?(
                    <>
                      <div className={styles.listContainer}>
                        {conversationList.map((item, index)=>{
                            return(
                              <li className={styles.liConversation}
                                onClick={()=>joinConversation({
                                  apartment_id: item.apartment_id,
                                  conversation_id:  item.id,
                                  numberApt: item.apartment.numberApt,
                                  numberTower: item.apartment.tower.numberTower
                                })}>

                                <div className={styles.leftSide}>
                                    {item.apartment.user[0] && item.apartment.user[0].photo ?(
                                    <img src={item.apartment.user[0].photo} alt={item.apartment.user[0].name} />
                                    ):(
                                    <img src='./noAvatar.jpg' alt='sem foto' />
                                    )}

                                  <div className={styles.coversationInfo}>
                                    <span>Torre {item.apartment.tower.numberTower} - Apartamento   {item.apartment.numberApt}</span>
                                    <p>
                                      {item.lastMessage.content}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className={styles.rightSide}>
                                  <span>{DateConverter(item.lastMessage.date)}</span>
                                  {item.undeliveredCount > 0 && (
                                    <div>
                                      <span>{item.undeliveredCount}</span>
                                    </div>
                                  )}

                                </div>
                                
                              </li>
                            )
                        })}
                      </div>
                    </>
                  ):(
                    <div className={styles.noCovnersation}>
                      <button onClick={() => setIsNewConversation(true)}>
                        <FaPlus/>
                      </button>
                      <p>
                        Parece que você ainda não recebeu nenhuma mensagem ou ainda não enviou nenhuma. Clique no ícone de + para iniciar uma nova conversa e começar a interagir.
                      </p>
                    </div>
                  )}
                </ul>
              )}
              <div className={styles.bottom}/>
            </>
          )}
        </article>
      ):(
        <button className={styles.buttonOpen} onClick={() => setIsOpen(true)}>
          <IoChatbubbleEllipsesOutline />
          {alerts > 0 && (
            <div className={styles.alerts}>
              <span>{alerts}</span>
            </div>
          )}
        </button>
      )}
    </>
  );
}

export default React.memo(Chat);
