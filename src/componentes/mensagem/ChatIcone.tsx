import { Link } from "react-router"
import { useAuth } from "../../contexto/auth/useAuth"
import type { Chats } from "./interface"
import { Fragment } from "react/jsx-runtime"

export const ChatIcone = ({ Chat }: {
    Chat: Chats
}) => {

    const { usuario } = useAuth()

    // const ConstrutorChat = (chats: Chats[]) =>{
    //         const map = new Map<string, Chats>()
    //         const array: unknown= []

    //         chats.forEach((chat)=>{
    //             map.set(chat.conversation_id, {...comentario, children: []})
    //         })

    //         comentarios.forEach((comentario)=>{
    //             if(comentario.pai_comentario_id){
    //                 const paiComentario = map.get(comentario.pai_comentario_id)

    //                 if(paiComentario) paiComentario.children!.push(map.get(comentario.id!)!)

    //             }else{
    //                 raizes.push(map.get(comentario.id!)!)
    //             }
    //         })

    //         return raizes
    //     }

    const ultimaMensagem = Chat.conversations.conversation_last_message
    const participantes = Chat.conversations.conversation_participants
    const participantesDados = participantes.filter((p) => p.user_id !== usuario?.id)

    return (
        <div className="mb-10 border-b-1 border-gray-800 pb-5">
            <div className="flex gap-5">
                {participantesDados.map((dados,index) =>
                    <Fragment key={index} >
                        <img src={dados.profile.avatar_url} alt="avatar" className="h-15 w-15 rounded-full object-cover border-1 border-[#232a2e]" />
                        <Link to={`/chat/${Chat.conversation_id}`} className="flex flex-col">
                            <span className="font-bol text-xl">{dados.profile.name}</span>
                            <p className="text-gray-500 italic text-lg">"Mensagem dasdasdsaadsadsdasd...."</p>
                        </Link>
                    </Fragment>)}
            </div>
        </div>
    )
}