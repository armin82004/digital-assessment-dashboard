"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ChartColumnBig, FileChartColumn, LayoutDashboard, Settings, StickyNotePlus, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const searchparams = useSearchParams();
  const tab = searchparams.get("tab") ?? "results";

  const activeClass = ({ isActive }: { isActive: boolean }): string =>
    `${
      isActive
        ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground cursor-pointer"
        : "cursor-pointer"
    }   transition-all `;
  return (
    <Sidebar collapsible="offcanvas" {...props} side="right">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <span className="text-base font-semibold">
                  داشبورد ارزیابی آمادگی دیجیتال
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Users"
                  className={activeClass({
                    isActive: tab === "results",
                  })}
                  render={
                    <Link
                      href="/dashboard?tab=results
"
                    />
                  }
                >
                  <ChartColumnBig />
                  <span>نتایج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={activeClass({
                    isActive: tab === "reports",
                  })}
                  tooltip="Posts"
                  render={<Link href="/dashboard?tab=reports" />}
                >
                  <FileChartColumn />
                  <span>گزارش‌ها</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu> */}
{/* 
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={activeClass({
                    isActive: tab === "settings",
                  })}
                  tooltip="Posts"
                  render={<Link href="/dashboard?tab=settings" />}
                >
                  <Settings />
                  <span>تنظیمات</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
