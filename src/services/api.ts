import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL ;
import {destroyCookie} from "nookies";
import Router from "next/router";

function signOut(){
    try{
        destroyCookie(undefined, "@SalaoCondoAdm.token");
        Router.push('/')
    }catch{
        console.log('Error ao deslogar');
    }
}
export const SetupApiClient = (ctx = undefined) =>{
    let cookies = parseCookies(ctx);
    const api = axios.create ({
        baseURL:baseURL,
        headers:{
            Authorization: `Bearer ${cookies["@SalaoCondoAdm.token"]}`,
        },
    });

    api.interceptors.response.use(
        response =>{
            return response;
        },
        (error: AxiosError)=>{
            if (error.response.status === 401){
                if (typeof window !== 'undefined'){
                    signOut();
                }
            } else{
                return Promise.reject(error)
                
                } 
                return Promise.reject(error)
            }
        
    );
        return api;
}

