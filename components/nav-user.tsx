"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/dist/client/components/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const user = session?.user;

  if (isPending || !user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />

              <AvatarFallback className="rounded-lg">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-right text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <IconDotsVertical className="mr-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "left"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-right text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />

                    <AvatarFallback className="rounded-lg">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-right text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>

                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                پروفایل
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
            >
              <IconLogout />
              خروج از حساب کاربری
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
