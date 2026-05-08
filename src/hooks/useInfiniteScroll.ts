import { useEffect } from "react";

export function useInfiniteScroll(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handleScroll = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (distanceToBottom < 320) callback();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback, enabled]);
}
