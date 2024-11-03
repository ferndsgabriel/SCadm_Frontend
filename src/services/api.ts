import axios, { AxiosError } from "axios";
import { parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

// Obtém a URL base da API do ambiente
//export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
export const baseURL = 'http://192.168.15.63:3333';

function signOut() {
    try {
        // Remove os tokens de ambos os tipos de usuários
        destroyCookie(undefined, "@SalaoCondoAdm.token");
        destroyCookie(undefined, "@SalaoCondoPort.token");
        Router.push('/');
    } catch {
        console.log('Erro ao deslogar');
    }
}

// Função para configurar o cliente API
export const SetupApiClient = (ctx = undefined) => {
    // Pega os cookies do contexto (pode ser no servidor ou no cliente)
    let cookies = parseCookies(ctx);

    // Verifica se há token de administrador ou de porteiro
    const adminToken = cookies["@SalaoCondoAdm.token"];
    const porterToken = cookies["@SalaoCondoPort.token"];
    
    // Usa o token correto, baseado na existência do token do usuário
    const token = adminToken || porterToken;

    // Cria a instância do Axios com o cabeçalho de autorização
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    api.interceptors.response.use(
        response => {
            return response;
        },
        (error: AxiosError) => {
            if (error.response && error.response.status === 401) {
                // Se o status for 401 (não autorizado), realiza o logout
                if (typeof window !== 'undefined') {
                    signOut();
                }
            } else {
                return Promise.reject(error);
            }
        }
    );

    return api;
};
