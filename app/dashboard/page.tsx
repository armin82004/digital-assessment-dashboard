import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import ResultsPage from "../_components/ResultsPage";
import SettingsPage from "../_components/SettingsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab: string; id?: string }>;
}) {
  const { tab, id } = await searchParams;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader searchParams={searchParams} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {tab === "results" ? (
                <ResultsPage id={id} />
              )  : tab === "settings" ? (
                <SettingsPage />
              ) : (
                <ResultsPage id={id} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
