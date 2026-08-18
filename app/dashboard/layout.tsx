import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "داشبورد ارزیابی آمادگی دیجیتال",
  description: "بررسی و تحلیل آمادگی تحول دیجیتال شرکت ها",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TooltipProvider>{children}</TooltipProvider>
    </div>
  );
}
