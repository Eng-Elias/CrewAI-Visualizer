"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileCode,
  Brain,
  WrenchIcon,
  Link as LinkIcon,
  BarChart2,
  BookOpen,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Crews", href: "/crews" },
  {
    icon: FileCode,
    label: "Templates",
    href: "/templates",
    subItems: [
      { label: "Crews", href: "/templates/crews" },
      { label: "Agents", href: "/templates/agents" },
      { label: "Tasks", href: "/templates/tasks" },
    ],
  },
  { icon: Brain, label: "LLMs", href: "/llms" },
  { icon: WrenchIcon, label: "Tools Configurations", href: "/tools" },
  { icon: LinkIcon, label: "Integrations", href: "/integrations" },
  { icon: BarChart2, label: "Usage", href: "/usage" },
  { icon: BookOpen, label: "Resources", href: "/resources" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

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
              <ChevronDown
                className={cn(
                  "h-5 w-5 transition-transform",
                  isSidebarCollapsed ? "-rotate-90" : "rotate-0"
                )}
              />
            </Button>
            {!isSidebarCollapsed && (
              <span className="ml-3 text-lg font-semibold">
                CrewA-Visualizer
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-2">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    "transition-colors duration-200"
                  )}
                  onClick={(e) => {
                    if (item.subItems) {
                      e.preventDefault();
                      toggleSubmenu(item.label);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.label}</span>
                      {item.subItems && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItem === item.label ? "rotate-180" : ""
                          )}
                        />
                      )}
                    </>
                  )}
                </Link>
                {!isSidebarCollapsed &&
                  item.subItems &&
                  expandedItem === item.label && (
                    <div className="ml-9 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
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
