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
import { Suspense, useEffect, useState } from "react";

export default function ResetPasswoed() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [invalidUser, setInvalidUser] = useState<string | undefined>("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    password: "",
    passwordverify: "",
  });
  const [token, setToken] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") ?? "");
  }, []);
  console.log(token);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    if (form.password !== form.passwordverify) {
      setInvalidUser(
        "رمز عبور و تکرار آن با هم مطابقت ندارند. لطفاً دوباره بررسی کنید.",
      );
      setLoading(false);
      return;
    }
    if (token) {
      const { error } = await authClient.resetPassword({
        newPassword: form.password,
        token: token,
      });
      if (error) {
        setInvalidUser(error.message);
        setLoading(false);
        return;
      }
      router.push("/login?reset=success");
    }
  };

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, password: e.target.value });
    console.log(form.password);
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Card className="w-[calc(100%-2rem)] max-w-sm sm:w-full sm:max-w-md mx-auto dark:bg-neutral-800 rounded-lg sm:rounded-xl h-auto flex flex-col justify-center p-2 sm:p-4">
        <CardHeader className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-center">
          <Image src={"/logo.png"} width={35} height={35} alt="Logo" />
          <CardTitle className="text-base sm:text-lg lg:text-xl text-balance">
            پرسشنامه ارزیابی آمادگی دیجیتال
          </CardTitle>
        </CardHeader>

        {invalidUser && (
          <CardHeader className="justify-center">
            <h1 className="font-bold text-sm text-center dark:text-red-400 text-red-600">
              {invalidUser}
            </h1>
          </CardHeader>
        )}
        <CardHeader>
          <CardTitle>بازنشانی رمزعبور</CardTitle>
          <CardDescription>رمز عبور جدید خود را وارد کنید:</CardDescription>
          <CardAction>
            <Link href={"/signup"}>
              <Button className="dark:text-blue-300" variant="link">
                ثبت نام
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">رمز عبور جدید</Label>
              </div>
              <Input onChange={handlePasswordChange} id="password" dir="ltr" />
              <div className="flex items-center justify-between">
                <Label htmlFor="passwordverify">تکرار رمز عبور</Label>
              </div>
              <Input
                onChange={(e) =>
                  setForm({ ...form, passwordverify: e.target.value })
                }
                id="passwordverify"
                type="password"
                required
                dir="ltr"
              />
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
    </Suspense>
  );
}
