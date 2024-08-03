import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext } from "react";

export function usePetContextProvider() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error(
      "Can't use usePetContextProvider outside PetContextProvider"
    );
  }
  return context;
}
export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("Can't use useSearchContext outside SearchContextProvider");
  }
  return context;
}
