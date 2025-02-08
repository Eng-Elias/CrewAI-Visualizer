"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, User, Home, BarChart2, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-14 items-center border-b px-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {!isSidebarCollapsed && (
              <span className="ml-3 text-lg font-semibold">CrewAI</span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-200"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!isSidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t p-2">
            <div
              className={cn(
                "flex items-center rounded-lg px-3 py-2",
                !isSidebarCollapsed && "justify-between"
              )}
            >
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                {!isSidebarCollapsed && (
                  <span className="ml-3 text-sm font-medium">John Doe</span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
