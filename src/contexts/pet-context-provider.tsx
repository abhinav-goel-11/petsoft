"use client";
import { Pet } from "@/lib/types";
import React, { createContext, useState } from "react";
type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
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
  const numberOfPets = pets.length;
  //event handlers
  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        selectedPet,
        numberOfPets,
        handleChangeSelectedPetId,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
