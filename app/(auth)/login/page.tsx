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
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [verified, setVerified] = useState("");
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [invalidUser, setInvalidUser] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const verifyParam = new URLSearchParams(window.location.search).get(
      "verified",
    );
    setToken(params.get("reset") ?? "");
    if (verifyParam) {
      setVerified(verifyParam);
    }
  }, []);

  useEffect(() => {
    if (token === "success") {
      toast.add({ type: "success", description: "پسورد شما ریست شد! 🎉" });
    }
  }, [token]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });

    if (error) {
      if ((error.code = "INVALID_EMAIL_OR_PASSWORD")) {
        setInvalidUser(true);
      } else {
        alert(error.message);
      }
      setLoading(false);
      return;
    }
    router.push("/");
  };
  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto dark:bg-neutral-800 rounded-lg sm:rounded-xl h-auto flex flex-col justify-center p-2 sm:p-4">
      <CardHeader className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-center">
        <Image src={"/logo.png"} width={35} height={35} alt="Logo" />
        <CardTitle className="text-base sm:text-lg lg:text-xl text-balance">
          پرسشنامه ارزیابی آمادگی دیجیتال
        </CardTitle>
      </CardHeader>
      {verified && (
        <CardHeader className="justify-center">
          <h1 className="font-bold text-sm sm:text-base text-green-500">
            ایمیل شما تایید شد!
          </h1>
          <p className="text-sm sm:text-base leading-relaxed">
            حالا میتونید وارد بشید.
          </p>
        </CardHeader>
      )}

      {invalidUser && (
        <CardHeader className="justify-center">
          <h1 className="font-bold text-sm sm:text-base dark:text-red-400 text-red-600 text-pretty">
            نام کاربری یا رمز عبور نادرست است!
          </h1>
        </CardHeader>
      )}
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">ورود</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          ایمیل خود را وارد نمایید.
        </CardDescription>
        <CardAction>
          <Link href={"/signup"}>
            {" "}
            <Button variant="link" className="dark:text-blue-300">
              ثبت نام
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:gap-6">
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
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <Label htmlFor="password">رمز</Label>
                <Link
                  href="/reset-password"
                  className="inline-block text-xs sm:text-sm underline-offset-4 hover:underline"
                >
                  رمز خود را فراموش کرده اید؟
                </Link>
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
          form="login-form"
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "در حال ورود..." : "ورود"}
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
