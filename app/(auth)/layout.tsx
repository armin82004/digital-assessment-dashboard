import { Toaster } from "@/components/ui/toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-t from-blue-800 to-blue-500 dark:bg-linear-to-t dark:from-neutral-950 dark:to-neutral-800">
      {children}
      <Toaster />
    </div>
  );
}
