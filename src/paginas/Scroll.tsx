import { useEffect } from "react";
import { useLocation } from "react-router";
import { useScroll } from "../contexto/scroll/useScroll";


export function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollRef } = useScroll()

  useEffect(() => {
    if(scrollRef) scrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname,scrollRef]);

  return null;
}
