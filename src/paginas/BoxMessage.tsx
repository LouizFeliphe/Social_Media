import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexto/auth/useAuth"
import { pegarChatsUsuario } from "../componentes/backend/Get"
import { Svgs } from "../assets/assets"
import type { Chat } from "../componentes/mensagem/interface"
import { ChatIcone } from "../componentes/mensagem/ChatIcone"
import { Carregamento } from "../componentes/Carregamento"
import { useNavigate } from "react-router"
import { useEffect } from "react"



export const BoxMessage = () => {

    const { usuario, setTemMensagemNova} = useAuth()
    const navegar = useNavigate()

    const { data: Chats, error, isLoading } = useQuery<Chat[]>({
        enabled: !!usuario?.id, queryKey: ["chats", usuario?.id], queryFn: ({ queryKey }) => {
            const [, usuarioId] = queryKey
            return pegarChatsUsuario(usuarioId! as string)
        }
    })

    useEffect(() => {
        setTemMensagemNova(false)
    }, [setTemMensagemNova])

    useEffect(() => {
        if (!usuario?.user_metadata) navegar("/signin")
    }, [navegar, usuario])

    if (isLoading) return <div className="mt-10">
        <Carregamento tamanho="10" texto="" />
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar os Chats</div>
    }
 
    return (
        <div className="flex flex-col justify-center p-5 mb-18">
            <div className="flex justify-between items-center mb-10 border-b-1 pb-5 border-gray-600">
                <span className="font-bold text-3xl">Chat</span>
                <img src={Svgs.email} alt="mensagens" className="h-10 invert" />
            </div>
            <div>
                {Chats?.map((chat) => <ChatIcone Chat={chat} key={chat.conversation_id}/>)}
            </div>
        </div>)
}