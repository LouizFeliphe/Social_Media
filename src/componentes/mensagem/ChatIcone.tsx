import { Link } from "react-router"
import { useAuth } from "../../contexto/auth/useAuth"
import type { Chats } from "./interface"
import { Fragment } from "react/jsx-runtime"
import { supabase } from "../../supabase"
import { useEffect, useState } from "react"


export const ChatIcone = ({ Chat }: {
    Chat: Chats
}) => {
    const { usuario } = useAuth()

 

    const ultimaMensagem = Chat.conversations.conversation_last_message
    const participantes = Chat.conversations.conversation_participants
    const participantesDados = participantes.filter((p) => p.user_id !== usuario?.id)



    return (
        <div className="mb-10 border-b-1 border-gray-800 pb-5">
            <div className="flex gap-5">
                {participantesDados.map((dados) => {
                    const isOnline = usuariosOnline.includes(dados.user_id)
                    return (
                        <Fragment key={dados.user_id} >
                            <img src={dados.profile.avatar_url} alt="avatar" className="h-15 w-15 rounded-full object-cover border-1 border-[#232a2e]" />
                            <Link to={`/chat/${Chat.conversation_id}`} className="flex flex-col">
                                <div className="flex items-center gap-7">
                                    <span className="font-bol text-xl">{dados.profile.name}</span>
                                    {isOnline ? <span className="text-lg italic text-green-600">Online</span> : <span className="text-lg italic text-red-600">Offline</span>}
                                </div>
                                <p className="text-gray-500 italic text-lg line-clamp-1">{ultimaMensagem ? ultimaMensagem[0]?.content : ""}</p>
                            </Link>
                        </Fragment>)
                })}
            </div>
        </div>
    )
}