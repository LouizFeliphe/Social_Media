import { createContext } from "react";

export type SidebarContextType = {
  expandir: boolean
  toggle: () => void
}

export const SidebarContext = createContext<SidebarContextType | null>(null)