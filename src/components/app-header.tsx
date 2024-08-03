"use client";
import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
  },
  {
    label: "Account",
    path: "/app/account",
  },
];
export default function AppHeader() {
  const activePathName = usePathname();
  return (
    <header className="flex items-center justify-between border-b border-white/10 py-2">
      <Logo />

      <nav>
        <ul className="flex gap-2 text-xs">
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className={cn(
                  "text-white/70 px-2 py-1 rounded-sm hover:text-white focus:text-white transition",
                  {
                    "bg-black/10 text-white": route.path === activePathName,
                  }
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
