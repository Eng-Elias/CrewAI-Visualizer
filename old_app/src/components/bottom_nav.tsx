"use client";

import Link from "next/link";
import useNavigation from "@/hook/use_navigation";
import { Icon } from "@iconify/react";

const BottomNav = () => {
  const { isMissionsActive, isAgentsActive } = useNavigation();

  return (
    <div
      className={`fixed bottom-0 w-full py-4 z-10 bg-zinc-100 dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden`}
    >
      <div className="flex flex-row justify-around items-center bg-transparent w-full">
        <Link
          href="/missions"
          className={`flex items-center relative ${isMissionsActive ? "opacity-100" : "opacity-25"}`}
        >
          <Icon icon="flat-color-icons:parallel-tasks" width="32" height="32" />
        </Link>

        <Link
          href="/agents"
          className={`flex items-center relative ${isAgentsActive ? "opacity-100" : "opacity-25"}`}
        >
          <Icon icon="streamline-emojis:robot-face-1" width="32" height="32" />
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
