import { useState } from "react";

export function useClipboard() {
  const [hasCopied, setHasCopied] = useState(false);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
    window.setTimeout(() => setHasCopied(false), 1600);
  }

  return { copy, hasCopied };
}
