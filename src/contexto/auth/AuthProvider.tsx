import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import type { User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContext";


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [usuario, setUsuario] = useState<User | null>(null);

    console.log("ola: " + window.location.origin);
    

    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({ provider: "google",options: {
      redirectTo: window.location.origin
    }})
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
        <AuthContext.Provider value={{ usuario, signInWithGoogle, singOut }}>
            {children}
        </AuthContext.Provider>
    )

}

