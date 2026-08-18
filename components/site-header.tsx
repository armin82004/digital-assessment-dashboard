import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export async function SiteHeader({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2" />
        {tab === "results" ? (
          <h1 className="font-bold">نتایج</h1>
        ) : tab === "reports" ? (
          <h1 className="font-bold">گزارش‌ها</h1>
        ) : tab === "settings" ? (
          <h1 className="font-bold">تنظیمات</h1>
        ) : (
          <h1 className="font-bold">لیست کاربران</h1>
        )}
      </div>
    </header>
  );
}
