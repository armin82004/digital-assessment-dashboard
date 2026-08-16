import { Toaster } from "@/components/ui/toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-t from-blue-800 to-blue-500 dark:from-blue-950 dark:to-blue-600">
      {children}
      <Toaster />
    </div>
  );
}
