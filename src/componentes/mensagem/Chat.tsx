import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { pegarMensagensChat } from "../backend/Get";
import { Carregamento } from "../Carregamento";
import type { Perfil_Mensagem } from "./interface";
import { ChatMessage } from "./ChatMessage";
import { useEffect } from "react";
import { useAuth } from "../../contexto/auth/useAuth";

export const Chat = () => {
    const { chatId } = useParams<{ chatId: string }>();
    const { usuario } = useAuth()
    const navegar = useNavigate()

    useEffect(() => {
            if (!usuario?.user_metadata) navegar("/signin")
        }, [navegar, usuario])
    
    const { data: ChatData, error, isLoading } = useQuery<Perfil_Mensagem>({
        enabled: !!chatId,
        queryKey: ["messages", chatId],
        queryFn: ({ queryKey }) => {
            const [, chatID] = queryKey
            return pegarMensagensChat(chatID! as string)
        },
    })

    if (isLoading) return <div className="mt-10">
        <Carregamento tamanho="10" texto="" />
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar as mensagens</div>
    }

   

    
    return (
        chatId && ChatData ? <ChatMessage data={ChatData} chatId={chatId}/> : null
    )
}