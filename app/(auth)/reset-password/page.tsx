"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Client } from "pg";
import { useEffect, useState } from "react";

export default function ResetPasswoed() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [invalidUser, setInvalidUser] = useState<string | undefined>("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    email: "",
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data: { exists: boolean } = await response.json();
    console.log(data);

    if (!data.exists) {
      setInvalidUser("کاربری با این ایمیل وجود ندارد!");
    } else {
      const { error } = await authClient.requestPasswordReset({
        email: form.email,
        redirectTo: "/reset-password/reset-form",
      });
      if (error) {
        setInvalidUser(error.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setSuccess(true);
    }
  };
  return (
    <Card className="w-[calc(100%-2rem)] max-w-sm sm:w-full sm:max-w-md mx-auto dark:bg-neutral-800 rounded-lg sm:rounded-xl h-auto flex flex-col justify-center p-2 sm:p-4">
      <CardHeader className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-center">
        <Image src={"/logo.png"} width={35} height={35} alt="Logo" />
        <CardTitle className="text-base sm:text-lg lg:text-xl text-balance">
          پرسشنامه ارزیابی آمادگی دیجیتال
        </CardTitle>
      </CardHeader>

      {invalidUser && (
        <CardHeader className="justify-center">
          <h1 className="font-bold text-base dark:text-red-400 text-red-600">
            {invalidUser}
          </h1>
        </CardHeader>
      )}
      {success && (
        <CardHeader className="justify-center">
          <h1 className="font-bold text-sm dark:text-green-400 text-green-600">
            ایمیل خود را چک کنید.
          </h1>
        </CardHeader>
      )}
      <CardHeader>
        <CardTitle>بازنشانی رمز عبور</CardTitle>
        <CardDescription>ایمیل خود را وارد کنید</CardDescription>
        <CardAction>
          <Link href={"/signup"}>
            <Button variant="link" className="dark:text-blue-300">
              ثبت نام
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="email"
                type="email"
                placeholder="m@example.com"
                dir="ltr"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          form="login-form"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "..." : "تایید"}
        </Button>
        <Link className="w-full" href={"/"}>
          <Button variant="outline" className="w-full">
            بازگشت به صفحه اصلی
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
