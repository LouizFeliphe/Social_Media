import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface AuthContextType {
    usuario: User | null,
    signInWithGoogle: () => void,
    singOut: () => void,
    signUp: (email: string, password: string, name: string, avatar?: File) => Promise<{
    user: User | null;
    session: Session | null;
}>, 
    signInWithEmail: (email: string, password: string) => void, 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
