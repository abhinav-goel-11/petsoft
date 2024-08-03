"use client";
import { Pet } from "@/lib/types";
import React, { createContext, useState } from "react";
type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
};
export const PetContext = createContext<TPetContext | null>(null);
type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};
export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState(null);
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
