import { ReactNode } from "react";

export default function MaxWidthWrapper({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full md:pl-2.5">{children}</div>;
}
