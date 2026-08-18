"use client";

import {
  BellIcon,
  ClipboardCheckIcon,
  DatabaseIcon,
  LockKeyholeIcon,
  SaveIcon,
  Settings2Icon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">تنظیمات</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              مدیریت حساب کاربری و تنظیمات سامانه ارزیابی آمادگی دیجیتال
            </p>
          </div>

          {/* Account */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserIcon className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>اطلاعات حساب کاربری</CardTitle>

                    <CardDescription>اطلاعات حساب مدیر سامانه</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>

                    <Input id="name" defaultValue="Armin Ahmadi" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>

                    <Input
                      id="email"
                      type="email"
                      defaultValue="admin@example.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button>
                    <SaveIcon />
                    ذخیره تغییرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Settings */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardCheckIcon className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>تنظیمات ارزیابی</CardTitle>

                    <CardDescription>
                      تنظیم نحوه انجام و ثبت ارزیابی‌ها
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>ثبت خودکار نتایج</Label>

                    <p className="text-sm text-muted-foreground">
                      نتایج پس از تکمیل پرسشنامه به صورت خودکار ثبت شوند.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>امکان تکمیل مجدد ارزیابی</Label>

                    <p className="text-sm text-muted-foreground">
                      کاربران بتوانند پس از تکمیل یک ارزیابی، دوباره ارزیابی
                      انجام دهند.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>نمایش نتیجه به کاربر</Label>

                    <p className="text-sm text-muted-foreground">
                      نتیجه ارزیابی پس از تکمیل پرسشنامه به کاربر نمایش داده
                      شود.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <BellIcon className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>اعلان‌ها</CardTitle>

                    <CardDescription>
                      مدیریت اعلان‌ها و اطلاع‌رسانی‌های سامانه
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>ارزیابی جدید</Label>

                    <p className="text-sm text-muted-foreground">
                      هنگام تکمیل یک ارزیابی جدید اطلاع‌رسانی شود.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>گزارش‌های جدید</Label>

                    <p className="text-sm text-muted-foreground">
                      هنگام آماده شدن گزارش جدید اطلاع‌رسانی شود.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>اعلان ایمیلی</Label>

                    <p className="text-sm text-muted-foreground">
                      اعلان‌های مهم از طریق ایمیل ارسال شوند.
                    </p>
                  </div>

                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <LockKeyholeIcon className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>امنیت</CardTitle>

                    <CardDescription>
                      تنظیمات امنیتی حساب کاربری
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>تأیید دو مرحله‌ای</Label>

                    <p className="text-sm text-muted-foreground">
                      برای ورود به حساب از تأیید دو مرحله‌ای استفاده شود.
                    </p>
                  </div>

                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>رمز عبور</Label>

                    <p className="mt-1 text-sm text-muted-foreground">
                      آخرین تغییر رمز عبور: 30 روز پیش
                    </p>
                  </div>

                  <Button variant="outline">تغییر رمز عبور</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Settings2Icon className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle>تنظیمات سیستم</CardTitle>

                    <CardDescription>تنظیمات عمومی سامانه</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>ذخیره گزارش‌ها</Label>

                    <p className="text-sm text-muted-foreground">
                      گزارش‌های تولیدشده در سامانه ذخیره شوند.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label>پشتیبان‌گیری خودکار</Label>

                    <p className="text-sm text-muted-foreground">
                      از داده‌های سامانه به صورت دوره‌ای نسخه پشتیبان تهیه شود.
                    </p>
                  </div>

                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <DatabaseIcon className="size-4" />
                  آخرین پشتیبان‌گیری: 1405/05/27 - ساعت 03:00
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save */}
          <div className="flex justify-end px-4 lg:px-6">
            <Button size="lg">
              <SaveIcon />
              ذخیره تنظیمات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
