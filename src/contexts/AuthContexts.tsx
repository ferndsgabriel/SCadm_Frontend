import {createContext, ReactNode, useState, useEffect} from "react";
import {destroyCookie, setCookie} from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";
import { Loading } from "../components/loading";



type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: CredentialProps) =>Promise<void>;
    signOut:()=>void
    signUp:(Credentials: SignUpProps ) =>Promise<void>;
}

type UserProps = {
    id:string;
    name: string;
    lastname: string;
    email: string;
    phone_number:string
}

type CredentialProps = {
    email: string;
    pass: string;
}
type SignUpProps = {
    email:string;
    cod:string;
    name: string;
    lastname: string;
    pass: string;
    phone_number:string;
}
type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext ({} as AuthContextData);

export function AuthProvider ({children}:AuthProviderProps){
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;
    const [isLoading, setIsLoading] = useState(true);

    function signOut(){
        try{
            destroyCookie(undefined, "@SalaoCondoAdm.token");
            Router.push('/')
        }catch{
            console.log('Error ao deslogar');
        }
    }

    useEffect(()=>{
        async function getItens() {
            try {
                const response = await api('adm/me');
                setUser(response.data);

                const sessionToken = response.data.sessionToken;

                const sessionStorage = localStorage.getItem('@SalaoCondoAdm.sessionToken');
                const sessionParse = sessionStorage ? JSON.parse(sessionStorage ) : '';
                
                if ( sessionParse !== sessionToken){
                    signOut();
                }
            } catch (error) {
                signOut();
            }finally{
                setIsLoading(false);
            }
        }
        getItens();
    },[]);
    async function signIn({email, pass}:CredentialProps) {
        try{
            const response = await api.post("/adm/session",{
                pass:pass,
                email:email,
            });

            const {data} = response.data;
            const {token} = response.data;
            const sessionToken = data.sessionToken

            const sessionParse = JSON.stringify(sessionToken);
            localStorage.setItem('@SalaoCondoAdm.sessionToken', sessionParse);

            setCookie (undefined, "@SalaoCondoAdm.token", token,{
                maxAge:60*60*24*30,
                path:"/"
            });
            
            setUser(data);

            api.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push("/reservation");
        }
        catch(error){
            toast.warning(error.response || error.response.data.error || 'Erro desconhecido');
        }
    }

    async function signUp ({name, lastname, cod, email, pass, phone_number}:SignUpProps){
        try{
            const response = await api.post('/adm',{
                name:name,
                lastname:lastname,
                cod:cod,
                email:email,
                pass:pass,
                phone_number:phone_number
            })
            Router.push("/");  
            return response.data.id
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            return;
        }
    }

    if (isLoading){
        return <Loading/>
    }

    return(
        <AuthContext.Provider 
        value={{user, isAuthenticated, signIn,signOut,signUp}}>
            {children}
        </AuthContext.Provider>
    );
}

