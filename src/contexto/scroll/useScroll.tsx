import { useContext } from "react"
import { ScrollContext } from "./scrollContext"

export const useScroll = (): {
  scrollRef: React.RefObject<HTMLDivElement | null> | null
} =>{

    const context = useContext(ScrollContext)

    if (!context) {
    throw new Error("useScroll deve ser usado dentro de ScrollProvider")
    }

    return context
}