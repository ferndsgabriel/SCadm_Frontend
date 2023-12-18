import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
      <Html lang="pt-br">
        <Head>
          <title>SalãoCondo</title>
          <meta name="description" content="Sistema de agendamento de salão de festa"/>
          <meta name="keywords" content="festa, condominio, salao, agendamento, fatec"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <link rel="icon" href="Icon.svg"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
  
