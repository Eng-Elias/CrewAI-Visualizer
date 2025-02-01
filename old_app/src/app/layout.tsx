import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import BottomNav from "@/components/bottom_nav";
import MaxWidthWrapper from "@/components/max_width_wrapper";
import SideNav from "@/components/side_nav";
import TopNav from "@/components/top_nav";
import { ApolloWrapper } from "@/utils/apollo_wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrewAI Visualizer",
  description: "Interactive user interface for CrewAI package.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <TopNav />
          <MaxWidthWrapper>
            <div className="flex">
              <SideNav />
              <main className="flex-1">
                <div
                  style={{ marginTop: 35 }}
                  className="flex flex-col pt-4 sm:ml-[120px] md:ml-[250px] sm:border-r sm:border-zinc-700 pb-20 h-full"
                >
                  {children}
                </div>
              </main>
            </div>
          </MaxWidthWrapper>
          <BottomNav />
        </ApolloWrapper>
      </body>
    </html>
  );
}
