import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../contexto/auth/useAuth"
import { pegarChatsUsuario } from "../componentes/backend/Get"
import { Svgs } from "../assets/assets"
import type { Chats } from "../componentes/mensagem/interface"
import { ChatIcone } from "../componentes/mensagem/ChatIcone"
import { Carregamento } from "../componentes/Carregamento"
import { useNavigate } from "react-router"
import { useEffect } from "react"


export const BoxMessage = () => {
    
    const {usuario} = useAuth()
    const navegar = useNavigate()

    const {data:Chats,error,isLoading} = useQuery<Chats[]>({enabled: !!usuario?.id,queryKey:["chats",usuario?.id], queryFn: ({queryKey})=>{
        const [,usuarioId] = queryKey
        return pegarChatsUsuario(usuarioId! as string)
    }})

    useEffect(()=>{
        if(!usuario?.user_metadata) navegar("/signin")
    },[navegar,usuario])

    // useEffect(() => {
    //     const channel = supabase
    //         .channel("messages-realtime")
    //         .on(
    //             "postgres_changes",
    //             {
    //                 event: "INSERT",
    //                 schema: "public",
    //                 table: "messages",
    //                 filter: `conversation_id=eq.${conversationId}`
    //             },
    //             (payload) => {
    //                 console.log("Nova mensagem:", payload.new);
    //                 setMessages((prev) => [...prev, payload.new]);
    //             }
    //         )
    //         .subscribe();

    //     return () => {
    //         supabase.removeChannel(channel);
    //     };
    // }, [conversationId]);

    if (isLoading) return <div className="mt-10">
                <Carregamento tamanho="10" texto=""/>
        </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar os Chats</div>
    }

   

    return (
    <div className="flex flex-col justify-center p-5 mb-18">
        <div className="flex justify-between items-center mb-10 border-b-1 pb-5 border-gray-600">
            <span className="font-bold text-3xl">Chat</span>
            <img src={Svgs.email} alt="mensagens" className="h-10 invert"/>
        </div>
        <div>
            {Chats?.map((chat,index)=> <ChatIcone Chat={chat} key={index}/>)}
        </div>
    </div>)
}