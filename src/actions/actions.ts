"use server";

import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(pet: unknown) {
  await sleep(1000);
  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid Pet data",
    };
  }
  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (err) {
    return {
      message: "Could not add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPet: unknown) {
  await sleep(1000);

  const validPetId = petIdSchema.safeParse(petId);
  const validPetData = petFormSchema.safeParse(newPet);

  if (!validPetData.success || !validPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validPetId.data,
      },
      data: validPetData.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validPetId = petIdSchema.safeParse(petId);

  if (!validPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("/app", "layout");
}
