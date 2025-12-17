import { useContext } from "react"
import { SidebarContext, type SidebarContextType } from "./sideBarContext"

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider")
  }
  return context
}
