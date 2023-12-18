import style from "./styles.module.scss";
import {AiOutlineClose} from "react-icons/ai";                                                                                  

interface TermosProps {
    buttonAction: () => void;
}
export default function Termos({buttonAction}:TermosProps){
    return(
        <>
            <div className={style.container}>
                <button onClick={buttonAction}><AiOutlineClose/></button>
                <div className={style.textoArea}>
                <h1>Termos de Uso do SalãoCondo - Administradores</h1>

<p>Estes Termos de Uso ("Termos") regem o uso do software "SalãoCondo" na capacidade de administrador. Ao utilizar este software, você concorda em cumprir estes Termos. Se você não concordar com esses Termos, não use o software.</p>

<h2>1. Cadastro e Acesso</h2>

<p>1.1. Para se cadastrar como administrador, você deve fornecer as seguintes informações: email, senha, sobrenome, telefone e um código de administrador (uma variável de ambiente controlada pelos desenvolvedores).</p>

<p>1.2. Ao fornecer essas informações e o código de administrador correto, você terá acesso ao sistema como administrador.</p>

<h2>2. Painel do Administrador</h2>

<p>2.1. O painel do administrador inclui quatro abas: Moradores, Apartamentos, Agendamentos e Configurações.</p>

<h2>3. Moradores</h2>

<p>3.1. A aba "Moradores" exibe uma lista de todos os moradores, incluindo novos registros pendentes de aprovação.</p>

<p>3.2. Os novos registros pendentes aparecerão no topo da lista, solicitando que você aprove ou recuse a conta. Os detalhes incluem nome, sobrenome, email e apartamento.</p>

<p>3.3. Você deve verificar se o morador é um residente válido antes de aprovar sua conta.</p>

<p>3.4. Após a aprovação, os moradores aparecerão na lista geral de moradores, onde você pode gerenciar o status de pagamento dos usuários.</p>

<p>3.5. Há um botão chamado "Atualizar Pagamento Automático" que verifica se o pagamento dos usuários está ativo há mais de 30 dias e, em caso afirmativo, define o status para inativo.</p>

<h2>4. Apartamentos</h2>

<p>4.1. A aba "Apartamentos" permite que você crie e edite apartamentos.</p>

<p>4.2. Ao cadastrar um morador, o usuário deve selecionar o apartamento a partir de uma lista de opções que puxa da tabela de apartamentos.</p>

<h2>5. Agendamentos</h2>

<p>5.1. A aba "Agendamentos" mostra todas as solicitações de reserva, incluindo informações sobre o solicitante, data e serviço de limpeza.</p>

<p>5.2. Você pode aprovar ou recusar as reservas nesta seção.</p>

<p>5.3. Reservas aprovadas serão listadas como "Reservas Aceitas", onde você pode acessar a lista de convidados e imprimi-la.</p>

<h2>6. Configurações do Administrador</h2>

<p>6.1. A aba "Configurações" permite que você atualize seu nome, email e telefone.</p>

<p>6.2. Você pode excluir sua conta ou alterar a senha nesta seção.</p>

<h2>7. Recuperação de Senha</h2>

<p>7.1. O processo de recuperação de senha para administradores é semelhante ao dos usuários, permitindo que você receba um código de recuperação via SMS vinculado ao número de telefone da sua conta e no endereço de email.</p>
                </div>
            </div>
        </>
    )
}