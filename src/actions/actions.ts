"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

//--------- user actions ------------
export async function logIn(prevState: unknown, formData: unknown) {
  await sleep(1000);
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  // const formDataObject = Object.fromEntries(formData.entries());

  // const validatedFormDataObject = authSchema.safeParse(formDataObject);

  // if (!validatedFormDataObject.success) {
  //   return {
  //     message: "Invalid form data",
  //   };
  // }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "Could not sign in",
          };
      }
    }
    throw error; //nextjs redirect throws error , so we need to rethrow it
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  // checking the type of formData
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }
  // converting the formData in object for zod validation
  const formDataObject = Object.fromEntries(formData.entries());

  //validation
  const validatedFormDataObject = authSchema.safeParse(formDataObject);

  if (!validatedFormDataObject.success) {
    return {
      message: "Invalid form data",
    };
  }

  //extract values
  const { email, password } = validatedFormDataObject.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email: email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    }
    return {
      message: "Could not create user",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await sleep(1000);

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
