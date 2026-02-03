import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { pegarMensagensChat } from "../backend/Get";
import { Carregamento } from "../Carregamento";
import { useAuth } from "../../contexto/auth/useAuth";
import { Svgs } from "../../assets/assets";
import { Mensagens } from "./mensagens";
import { Fragment } from "react/jsx-runtime";
import type { Perfil_Mensagem } from "./interface";
import { useEffect} from "react";
import { supabase } from "../../supabase";

export const Chat = () => {
    const { usuario } = useAuth()
    const { chatId } = useParams<{ chatId: string }>();


    const { data: initialChats, error, isLoading } = useQuery<Perfil_Mensagem>({
        enabled: !!chatId,
        queryKey: ["messages", chatId],
        queryFn: ({ queryKey }) => {
            const [, chatID] = queryKey
            return pegarMensagensChat(chatID! as string)
        },
    })


    useEffect(() => {
        if (!usuario?.id) return

        const channel = supabase.channel("online-users", {
            config: {
                presence: { key: usuario.id },
            },
        })

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState()
                setUsuariosOnline(Object.keys(state))
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({ online: true })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [usuario?.id])


    useEffect(() => {
        if (!chatId) return

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
                    const novaMensagem = payload.new

                    setChats(prev => {
                        if (!prev) return prev

                        return {
                            ...prev,
                            mensagens: [...prev.mensagens, novaMensagem],
                        }
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [chatId])


    if (isLoading) return <div className="mt-10">
        <Carregamento tamanho="10" texto="" />
    </div>

    if (error) {
        return <div className="text-red-600 w-full text-center mt-10">Erro ao carregar as mensagens</div>
    }


    return (
        <div className=" sm:mr-10 sm:border-r-1 sm:border-gray-700" >

            {/* {data?.perfils.map((perfil, index) => {
                if (perfil.profile.user_id === usuario?.id) return
                return (
                    <Fragment key={index}>
                        <div key={index} className="fixed bg-black w-[90%] flex items-center gap-4 p-2 max-sm:hidden" >
                            <img src={Svgs.xFechar} alt="fechar" className="h-10 invert" />
                            <img src={perfil.profile.avatar_url}
                                className="h-13 w-13 object-cover rounded-full 
                        border-1 border-[#232a2e]" alt="ola" />
                            <span className="text-xl font-bold">{perfil.profile.name}</span>
                        </div>
                        <div className=" w-full flex flex-col
                    items-center justify-center h-100 gap-1">
                            <img src={perfil.profile.avatar_url}
                                className="h-20 w-20 object-cover rounded-full 
                        border-1 border-[#232a2e]" alt="ola" />
                            <span className="text-xl font-bold">{perfil.profile.name}</span>
                            <span className="text-xl text-gray-500">{perfil.profile.email}</span>
                            <button onClick={() => {
                                navegar(`/perfil/${perfil.profile.user_id}`)
                            }} className="bg-[#f0f0f0] text-black font-semibold py-2 px-5 rounded-xl cursor-pointer mt-10 text-lg hover:bg-[#e0e0e0]">Ver Perfil</button>
                        </div>
                    </Fragment>)
            })} */}
            {/* {data?.mensagens && chatId && <Mensagens mensagens={data?.mensagens} chatID={chatId} />} */}
        </div>
    )
}