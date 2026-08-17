'use client'
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-b-neutral-300 dark:border-b-neutral-600 bg-blue-500 p-3 flex justify-between items-center">
      <h1 className="text-white font-bold ">پرسشنامه ارزیابی آمادگی دیجیتال</h1>
      {!mounted ? (
        <Sun className="!size-5 opacity-0" />
      ) : theme === "dark" ? (
        <Button
          variant="ghost"
          onClick={() => setTheme("light")}
          className="rounded-full py-5"
        >
          <Sun className="!size-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="rounded-full py-5 hover:bg-blue-400 dark:hover:bg-red-500 text-white hover:text-white"
          onClick={() => setTheme("dark")}
        >
          <Moon className="!size-5" />
        </Button>
      )}
    </header>
  );
}
