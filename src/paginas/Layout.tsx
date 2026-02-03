import { useScroll } from "../contexto/scroll/useScroll"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { scrollRef } = useScroll()

  return (
    <main
      ref={scrollRef}
      className="flex-1 overflow-y-auto overscroll-y-contain"
    >
      {children}
    </main>
  )
}
