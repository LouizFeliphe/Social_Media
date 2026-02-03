import { useRef } from "react"
import { ScrollContext } from "./scrollContext"

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  return (
    <ScrollContext.Provider value={{ scrollRef }}>
      {children}
    </ScrollContext.Provider>
  )
}
