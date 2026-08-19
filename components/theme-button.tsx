"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return (
    <div>
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
          className="rounded-full py-5 hover:bg-neutral-200!  text-black "
          onClick={() => setTheme("dark")}
        >
          <Moon className="!size-5" />
        </Button>
      )}
    </div>
  );
}
