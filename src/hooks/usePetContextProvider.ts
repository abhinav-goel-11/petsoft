import { PetContext } from "@/contexts/pet-context-provider";
import { useContext } from "react";

export default function usePetContextProvider() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error(
      "Can't use usePetContextProvider outside PetContextProvider"
    );
  }
  return context;
}
