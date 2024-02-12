"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

const useNavigation = () => {
  const pathname = usePathname();
  const [isMissionsActive, setisMissionsActive] = useState(false);
  const [isAgentsActive, setIsAgentsActive] = useState(false);

  useEffect(() => {
    setisMissionsActive(false);
    setIsAgentsActive(false);

    switch (pathname) {
      case "/missions":
        setisMissionsActive(true);
        break;
      case "/agents":
        setIsAgentsActive(true);
        break;
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isMissionsActive,
    isAgentsActive,
  };
};

export default useNavigation;
