import { AppProps } from "next/app";
import  "../../styles/globals.scss";
import { AuthProvider } from "../contexts/AuthContexts";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider } from "../contexts/LoadingContexts";
import Head from "next/head";
import Router from "next/router";
import NProgress from 'nprogress';

export default function App({ Component, pageProps }:AppProps) {

  NProgress.configure({
    showSpinner: true,
    trickleSpeed: 300,
  });
  Router.events.on("routeChangeStart", (url)=>{
    NProgress.start()
  })
  Router.events.on("routeChangeComplete", (url)=>{
      NProgress.done(false)
    });
  Router.events.on('routeChangeError', () => NProgress.done());
  
  
  Router.events.on('routeChangeError', () => NProgress.done());
  return (
    <>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AuthProvider>
          <LoadingProvider>
            <Component {...pageProps} />
          </LoadingProvider>
        </AuthProvider>
        </>
      );
    }