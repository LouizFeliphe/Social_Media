import { useState } from "react"
import { SidebarContext } from "./sideBarContext"

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandir, setExpandir] = useState(false)

  const toggle = () => setExpandir(v => !v)
 

  return (
    <SidebarContext.Provider value={{ expandir, toggle}}>
      {children}
    </SidebarContext.Provider>
  )
}

