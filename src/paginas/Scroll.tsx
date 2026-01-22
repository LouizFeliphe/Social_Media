import { useEffect } from "react";
import { useLocation } from "react-router";


interface Props {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export function ScrollToTop({ scrollRef }: Props) {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname,scrollRef]);

  return null;
}
