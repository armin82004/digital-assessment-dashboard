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
  const [accountType, setAccountType] = useState("individual");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    licenseNumber: "",
    uniqueId: "",
    province: "",
    account_type: "",
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
      name: form.name,
      email: form.email,
      password: form.password,
      uniqueId: form.uniqueId,
      licenseNumber: form.licenseNumber,
      province: form.province,
      account_type: form.account_type,
    });
    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  function setAccountListener(value: string) {
    setAccountType(value);
    if (value === "individual") {
      setForm({ ...form, account_type: value });
    } else if (value === "legal") {
      setForm({ ...form, account_type: value });
    }
  }
  return (
    <Card className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto dark:bg-neutral-800 rounded-lg sm:rounded-xl h-auto flex flex-col justify-center p-2 sm:p-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium">نوع شخص</Label>

              <RadioGroup
                className="flex flex-wrap gap-4 sm:gap-6"
                value={accountType}
                onValueChange={setAccountListener}
                defaultValue={"individual"}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual">شخص حقیقی</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="legal" id="legal" />
                  <Label htmlFor="legal">شخص حقوقی</Label>
                </div>
              </RadioGroup>
            </div>
            {accountType === "legal" ? (
              <>
                {" "}
                <div className="grid gap-2">
                  <Label htmlFor="name">نام شرکت</Label>
                  <Input
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    id="name"
                    type="text"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="grid gap-2">
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    id="name"
                    type="text"
                    required
                  />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label htmlFor="licenseNumber">شماره پروانه بهره برداری</Label>
              <Input
                onChange={(e) =>
                  setForm({
                    ...form,
                    licenseNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                value={form.licenseNumber}
                id="licenseNumber"
                type="text"
                pattern="[0-9]*"
                required
                maxLength={12}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="uniqueId">شناسه یکتا</Label>
              <Input
                onChange={(e) =>
                  setForm({
                    ...form,
                    uniqueId: e.target.value.replace(/\D/g, ""),
                  })
                }
                id="uniqueId"
                type="text"
                pattern="[0-9]*"
                required
                maxLength={12}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="province">استان</Label>
              <Input
                onChange={(e) =>
                  setForm({
                    ...form,
                    province: e.target.value,
                  })
                }
                id="province"
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
