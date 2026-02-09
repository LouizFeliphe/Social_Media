import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";
import type { Mensagem } from "../../componentes/mensagem/interface";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [usuario, setUsuario] = useState<User | null>(null);
    const [usuariosOnline, setUsuariosOnline] = useState<string[]>([])
    const [usuariosDigitando, setUsuariosDigitando] = useState<{ chatId: string, userId: string }[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channelRef = useRef<null | any>(null)
    const [temMensagemNova, setTemMensagemNova] = useState(false)



    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: "google", options: {
                redirectTo: window.location.origin
            }
        })
    }

    const signUp = async (email: string, password: string, name: string): Promise<{
        user: User | null;
        session: Session | null;
    }> => {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    name,
                    avatar_url: null,
                },
            }
        })

        if (error) throw new Error(error.message)

        return data

    }

    const signInWithEmail = async (email: string, password: string) => {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw new Error(error.message)


    }


    const singOut = () => {
        supabase.auth.signOut();
    }

    useEffect(() => {
        const PegarUsuario = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.log("Erro em pegarUsuario: " + error);
            }
            setUsuario(session?.user ?? null)

        }

        PegarUsuario()

        const { data: authListener } =
            supabase.auth.onAuthStateChange((_, session) => {
                setUsuario(session?.user ?? null)
            })


        return () => {
            authListener.subscription.unsubscribe()
        }

    }, [])

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
                const onlineKeys = Object.keys(state)
                setUsuariosOnline(onlineKeys)
                const typing = Object.entries(state)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .filter(([, metas]) => Array.isArray(metas) && metas.some((obj: any) => obj.isDigitando))
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map(([key, metas]: any[]) => { return { userId: key, chatId: metas[0].chatId } as { userId: string, chatId: string } })

                setUsuariosDigitando(typing)
            })
            .subscribe(async status => {
                if (status === "SUBSCRIBED") {
                    await channel.track({ online: true, isDigitando: false, chatId: null })
                }
            })

        channelRef.current = channel

        return () => {
            channelRef.current?.unsubscribe()
            channelRef.current = null
        }
    }, [usuario?.id])

    useEffect(() => {
        if (!usuario?.id) return

        const channel = supabase
            .channel("messages-global")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                payload => {
                    const nova = payload.new as Mensagem
                    if (nova.sender_id !== usuario.id) {
                        setTemMensagemNova(true)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [usuario?.id])

    


    const rastrearDigitacao = async (chatId: string, digitando: boolean) => {
        if (!channelRef.current) return

        await channelRef.current.track({
            online: true,
            isDigitando: digitando,
            chatId,
        })
    }

    return (
        <AuthContext.Provider value={{
            usuario, signInWithGoogle, singOut, signUp, signInWithEmail, usuariosOnline, usuariosDigitando, rastrearDigitacao, temMensagemNova,
            setTemMensagemNova,
        }}>
            {children}
        </AuthContext.Provider>
    )

}

