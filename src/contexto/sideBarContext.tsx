import { createContext } from "react";


export const sideBarContext = createContext<{ expandir: boolean } | null>(null)