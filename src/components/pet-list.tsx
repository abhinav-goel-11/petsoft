import Image from "next/image";
import React from "react";

export default function PetList() {
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      <li>
        <button className="flex items-center gap-3 h-[70px] w-full cursor-pointer px-5 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
          <Image
            src={
              "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            }
            alt="Pet Image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
    </ul>
  );
}
