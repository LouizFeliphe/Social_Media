import { Fragment, useEffect, useState } from "react"
import { supabase } from "../../supabase"
import type { Mensagem, Perfil_Mensagem } from "./interface"
import { Mensagens } from "./mensagens"
import { Svgs } from "../../assets/assets"
import { useNavigate } from "react-router"
import { useAuth } from "../../contexto/auth/useAuth"

export const ChatMessage = ({ data, chatId }: {
    data: Perfil_Mensagem
    chatId: string
}) => {
    
    const { usuario } = useAuth()
    const navegar = useNavigate()
    const [mensagens, setMensagens] = useState<Mensagem[]>(() => data.mensagens)
    
    useEffect(() => {
        const channel = supabase
            .channel(`messages-${chatId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${chatId}`,
                },
                payload => {
                    const novaMensagem = payload.new as Mensagem
                    setMensagens(prev => [...prev, novaMensagem])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [chatId,usuario?.id])


    return (
        <div className="sm:mr-10 sm:border-r-1 sm:border-gray-700">

            {data.perfils.map((perfil, index) => {
                if (perfil.profile.user_id === usuario?.id) return null

                return (
                    <Fragment key={index}>
                        <div className="fixed bg-black w-[90%] flex items-center gap-4 p-2 max-sm:hidden">
                            <img src={Svgs.xFechar} alt="fechar" className="h-10 invert cursor-pointer" onClick={()=>{
                                navegar("/box_message")
                            }}/>
                            <img
                                src={perfil.profile.avatar_url}
                                className="h-13 w-13 object-cover rounded-full border-1 border-[#232a2e]"
                                alt="avatar"
                            />
                            <span className="text-xl font-bold">
                                {perfil.profile.name}
                            </span>
                        </div>

                        <div className="w-full flex flex-col items-center justify-center h-100 gap-1">
                            <img
                                src={perfil.profile.avatar_url}
                                className="h-20 w-20 object-cover rounded-full border-1 border-[#232a2e]"
                                alt="avatar"
                            />
                            <span className="text-xl font-bold">
                                {perfil.profile.name}
                            </span>
                            <span className="text-xl text-gray-500">
                                {perfil.profile.email}
                            </span>

                            <button
                                onClick={() => navegar(`/perfil/${perfil.profile.user_id}`)}
                                className="bg-[#f0f0f0] text-black font-semibold py-2 px-5 rounded-xl cursor-pointer mt-10 text-lg hover:bg-[#e0e0e0]"
                            >
                                Ver Perfil
                            </button>
                        </div>
                    </Fragment>
                )
            })}

            <Mensagens mensagens={mensagens} chatID={chatId} />
        </div>
    )
}
