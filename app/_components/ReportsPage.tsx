import {
  ArrowDownToLineIcon,
  BarChart3Icon,
  Building2Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  DownloadIcon,
  FileBarChartIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  {
    title: "گزارش جامع آمادگی دیجیتال",
    description:
      "گزارش کامل وضعیت آمادگی دیجیتال شامل امتیاز کلی و هفت بُعد ارزیابی",
    type: "گزارش ارزیابی",
    count: "1,126 ارزیابی",
    date: "1405/05/27",
  },
  {
    title: "گزارش وضعیت شرکت‌ها",
    description: "مقایسه وضعیت آمادگی دیجیتال شرکت‌ها و سازمان‌های ارزیابی‌شده",
    type: "گزارش سازمانی",
    count: "248 شرکت",
    date: "1405/05/26",
  },
  {
    title: "گزارش مقایسه صنایع",
    description: "مقایسه میانگین امتیاز آمادگی دیجیتال در صنایع مختلف",
    type: "گزارش تحلیلی",
    count: "2 صنعت",
    date: "1405/05/25",
  },
  {
    title: "گزارش عملکرد ابعاد",
    description: "تحلیل میانگین امتیاز هفت بُعد و شناسایی نقاط قوت و ضعف",
    type: "گزارش تحلیلی",
    count: "7 بُعد",
    date: "1405/05/24",
  },
];

const industryReports = [
  {
    name: "انرژی",
    assessments: 684,
    average: 75.8,
    highest: 94,
  },
  {
    name: "کشاورزی",
    assessments: 442,
    average: 67.2,
    highest: 88,
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">گزارش‌ها</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              مشاهده، تحلیل و دریافت گزارش‌های مربوط به ارزیابی آمادگی دیجیتال
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>کل گزارش‌ها</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  48
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <FileBarChartIcon />
                    گزارش
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  گزارش‌های تولیدشده
                  <FileTextIcon className="size-4" />
                </div>

                <div className="text-muted-foreground">
                  شامل گزارش‌های فردی و تجمیعی
                </div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>گزارش‌های این ماه</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  12
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <CalendarDaysIcon />
                    این ماه
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="font-medium">افزایش فعالیت گزارش‌گیری</div>

                <div className="text-muted-foreground">نسبت به ماه گذشته</div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>گزارش شرکت‌ها</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  248
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <Building2Icon />
                    شرکت
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="font-medium">شرکت‌های دارای ارزیابی</div>

                <div className="text-muted-foreground">
                  دارای حداقل یک ارزیابی تکمیل‌شده
                </div>
              </CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>ارزیابی‌های گزارش‌شده</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  1,126
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <ClipboardListIcon />
                    ارزیابی
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="font-medium">ارزیابی‌های تکمیل‌شده</div>

                <div className="text-muted-foreground">
                  مبنای تولید گزارش‌ها
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Available Reports */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>گزارش‌های موجود</CardTitle>

                <CardDescription>
                  گزارش‌های آماده برای مشاهده و دریافت
                </CardDescription>
              </CardHeader>

              <div className="grid grid-cols-1 gap-4 px-6 pb-6 lg:grid-cols-2">
                {reports.map((report) => (
                  <Card key={report.title} className="border bg-muted/20">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileBarChartIcon className="size-5 text-primary" />
                          </div>

                          <div>
                            <CardTitle className="text-base">
                              {report.title}
                            </CardTitle>

                            <CardDescription className="mt-1">
                              {report.description}
                            </CardDescription>
                          </div>
                        </div>

                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                    </CardHeader>

                    <CardFooter className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{report.count}</span>
                        <span>{report.date}</span>
                      </div>

                      <Button size="sm">
                        <DownloadIcon />
                        دریافت گزارش
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Industry Reports */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>گزارش صنایع</CardTitle>

                <CardDescription>
                  خلاصه وضعیت ارزیابی‌ها به تفکیک صنعت
                </CardDescription>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-right">
                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        صنعت
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        تعداد ارزیابی
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        میانگین امتیاز
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        بالاترین امتیاز
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        گزارش
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {industryReports.map((report) => (
                      <tr
                        key={report.name}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4 font-medium">{report.name}</td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {report.assessments}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold tabular-nums">
                            {report.average}
                          </span>
                          <span className="text-muted-foreground"> / 100</span>
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant="outline">
                            {report.highest} / 100
                          </Badge>
                        </td>

                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">
                            <ArrowDownToLineIcon />
                            دریافت
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Report Types */}
          <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader>
                <CardAction>
                  <UsersIcon className="size-5 text-muted-foreground" />
                </CardAction>

                <CardDescription>گزارش فردی</CardDescription>

                <CardTitle className="text-xl">گزارش هر کاربر</CardTitle>
              </CardHeader>

              <CardFooter className="text-sm text-muted-foreground">
                شامل امتیاز کلی، امتیاز ابعاد و جزئیات ارزیابی هر کاربر
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardAction>
                  <Building2Icon className="size-5 text-muted-foreground" />
                </CardAction>

                <CardDescription>گزارش سازمانی</CardDescription>

                <CardTitle className="text-xl">گزارش شرکت‌ها</CardTitle>
              </CardHeader>

              <CardFooter className="text-sm text-muted-foreground">
                تحلیل وضعیت آمادگی دیجیتال یک شرکت یا سازمان
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardAction>
                  <BarChart3Icon className="size-5 text-muted-foreground" />
                </CardAction>

                <CardDescription>گزارش تحلیلی</CardDescription>

                <CardTitle className="text-xl">گزارش تجمیعی</CardTitle>
              </CardHeader>

              <CardFooter className="text-sm text-muted-foreground">
                تحلیل آماری و مقایسه‌ای نتایج تمام ارزیابی‌ها
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
