"use client";

import Link from "next/link";
import Image from "next/image";

const TopNav = () => {
  return (
    <div
      className={`fixed top-0 w-full py-1 z-10 bg-zinc-100 dark:bg-zinc-950 border-b dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        <Link href="/" className={`flex items-center`}>
          <Image
            src="/crewai_logo.png"
            alt="CrewAI Logo"
            width="50"
            height="50"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopNav;
