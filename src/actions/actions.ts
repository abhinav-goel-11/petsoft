"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth, getPetById } from "@/lib/server-utils";

//--------- user actions ------------
export async function logIn(formData: FormData) {
  // const authData = Object.fromEntries(formData.entries());

  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function signUp(formData: FormData) {
  // const authData = Object.fromEntries(formData.entries());

  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// --------pet actions ----------
export async function addPet(pet: unknown) {
  await sleep(1000);
  const session = await checkAuth();
  const validatedPet = petFormSchema.safeParse(pet);

  if (!validatedPet.success) {
    return {
      message: "Invalid Pet data",
    };
  }
  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
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

  //authentication
  const session = await checkAuth();

  const validPetId = petIdSchema.safeParse(petId);
  const validPetData = petFormSchema.safeParse(newPet);

  if (!validPetData.success || !validPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  //authorization
  const pet = await getPetById(validPetId.data);

  if (!pet) {
    return {
      message: "No pet found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized",
    };
  }
  //database mutation
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

  //authentication
  const session = await checkAuth();

  //validation
  const validPetId = petIdSchema.safeParse(petId);

  if (!validPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  //authorization
  const pet = await getPetById(validPetId.data);

  if (!pet) {
    return {
      message: "No pet found",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized",
    };
  }

  //database mutaion
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
