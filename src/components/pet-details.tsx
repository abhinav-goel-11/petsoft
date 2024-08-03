"use client";

import { usePetContextProvider } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";
import React from "react";
import PetButton from "./pet-button";

export default function PetDetails() {
  const { selectedPet } = usePetContextProvider();
  return (
    <section className="flex flex-col w-full h-full">
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfo pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

type Props = {
  pet: Pet;
};

function EmptyView() {
  return (
    <p className="h-full place-content-center text-center text-2xl font-semibold text-zinc-400">
      No pet elected
    </p>
  );
}
function TopBar({ pet }: Props) {
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={pet?.imageUrl}
        alt="selected pet image"
        height={75}
        width={75}
        className="rounded-full h-[75px] w-[75px] object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">{pet?.name}</h2>
      <div className="ml-auto">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton actionType="checkout">Checkout</PetButton>
      </div>
    </div>
  );
}

function OtherInfo({ pet }: Props) {
  return (
    <div className="flex justify-around text-center py-10 px-5 ">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner Name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Props) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {pet?.notes}
    </section>
  );
}
