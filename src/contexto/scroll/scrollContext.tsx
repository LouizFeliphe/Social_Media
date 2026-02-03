import { createContext } from "react"

export const ScrollContext = createContext<{
  scrollRef: React.RefObject<HTMLDivElement | null> | null
}>({ scrollRef: null })


