"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

type AuthFormBtnProps = {
  type: "login" | "signup";
};
export default function AuthFormBtn({ type }: AuthFormBtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {type === "signup" ? "Sign Up" : "Log In"}
    </Button>
  );
}
