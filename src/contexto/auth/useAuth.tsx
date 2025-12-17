import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";

export const useAuth = (): AuthContextType =>{

    const context = useContext(AuthContext)

    if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
    }

    return context
}