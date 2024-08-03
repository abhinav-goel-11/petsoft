"use client";
import { Pet } from "@/lib/types";
import React, { createContext, useState } from "react";
type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet:Pet | undefined;
  handleChangeSelectedPetId: (id: string) => void;
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
  //states
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  //derived states
  const selectedPet = pets.find((p) => p.id === selectedPetId);
  //event handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
