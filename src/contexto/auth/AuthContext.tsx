import type { User } from "@supabase/supabase-js";
import { createContext } from "react";


export interface AuthContextType {
    usuario: User | null,
    signInWithGoogle: () => void,
    singOut: () => void,

}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
