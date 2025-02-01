"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import useNavigation from "@/hook/use_navigation";

const SideNav = () => {
  const { isMissionsActive, isAgentsActive } = useNavigation();

  return (
    <div className="flex-col space-y-4 items-center py-8 hidden sm:flex border-r border-zinc-700 h-full  w-[120px] md:w-[225px] md:items-start fixed">
      <Link
        href="/"
        className="flex flex-row space-x-1 items-center hover:bg-white/10 p-4 rounded-full duration-200"
      >
        <Image
          src={"/crewai_logo.png"}
          alt="CrewAI Logo"
          width="100"
          height="100"
        />
      </Link>

      <Link
        href="/missions"
        className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10 relative"
      >
        <Icon icon="flat-color-icons:parallel-tasks" width="35" height="35" />
        <span
          className={`text-2xl pt-2 hidden md:flex ${
            isMissionsActive ? "font-bold" : ""
          }`}
        >
          Missions
        </span>
      </Link>

      <Link
        href="/agents"
        className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
      >
        <Icon icon="streamline-emojis:robot-face-1" width="35" height="35" />
        <span
          className={`text-2xl pt-2 hidden md:flex ${
            isAgentsActive ? "font-bold" : ""
          }`}
        >
          Crew
        </span>
      </Link>
    </div>
  );
};

export default SideNav;
