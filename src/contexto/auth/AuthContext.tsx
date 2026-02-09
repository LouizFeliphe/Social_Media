import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthContextType {
    usuario: User | null,
    signInWithGoogle: () => void,
    usuariosOnline: string[]
    singOut: () => void,
    usuariosDigitando: {chatId: string, userId: string}[],
    rastrearDigitacao: (chatId: string, digitando: boolean) => Promise<void>,
    signUp: (email: string, password: string, name: string, avatar?: File) => Promise<{
    user: User | null;
    session: Session | null;
}>,
    temMensagemNova: boolean,
    setTemMensagemNova: (tem: boolean) => void,
    signInWithEmail: (email: string, password: string) => void, 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
