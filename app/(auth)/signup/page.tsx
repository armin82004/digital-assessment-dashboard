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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";
import { email } from "better-auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Login() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({
      callbackURL: "/dashboard",
      name: form.name,
      email: form.email,
      password: form.password,
    });
    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto dark:bg-neutral-800 rounded-lg sm:rounded-xl h-auto flex flex-col justify-center p-2 sm:p-4">
      {" "}
      <CardHeader className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-center">
        <Image src={"/logo.png"} width={35} height={35} alt="Logo" />
        <CardTitle className="text-base sm:text-lg lg:text-xl text-balance">
          پرسشنامه ارزیابی آمادگی دیجیتال
        </CardTitle>
      </CardHeader>
      {success && (
        <CardHeader className="justify-center">
          <h1 className="font-bold text-sm sm:text-base text-green-500">
            ایمیل خود را برای فعال سازی حساب خود چک کنید.
          </h1>
        </CardHeader>
      )}
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">ثبت نام</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          اطلاعات زیر را تکمیل کنید.
        </CardDescription>
        <CardAction>
          <Link href={"/login"}>
            {" "}
            <Button variant="link" className="dark:text-blue-300">
              ورود
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                id="name"
                type="text"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                dir="ltr"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">رمز</Label>
              </div>
              <Input
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                id="password"
                type="password"
                required
                dir="ltr"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          form="register-form"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "در حال ثبت نام..." : "ثبت نام"}
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
