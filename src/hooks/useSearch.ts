import { useProducts } from "./useProducts";

export function useSearch(query: string) {
  return useProducts({ query });
}
