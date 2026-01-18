import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    
    const [usuario, setUsuario] = useState<User | null>(null);

    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: "google", options: {
                redirectTo: window.location.origin
            }
        })
    }

    // async function uploadAvatar(userId: string, file: File) {
    //     const { error } = await supabase.storage
    //         .from('avatares')
    //         .upload(`${userId}.jpg`, file, { upsert: true })

    //     if (error) throw error

    //     const { data } = supabase.storage
    //         .from('avatares')
    //         .getPublicUrl(`${userId}.png`)

    //     return data.publicUrl
    // }

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

    const signInWithEmail = async (email:string, password:string) => {

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

    return (
        <AuthContext.Provider value={{ usuario, signInWithGoogle, singOut, signUp, signInWithEmail}}>
            {children}
        </AuthContext.Provider>
    )

}

