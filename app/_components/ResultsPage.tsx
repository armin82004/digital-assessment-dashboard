import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

const dimensions = [
  {
    name: "استراتژی و رهبری دیجیتال",
    score: 78,
  },
  {
    name: "فرهنگ و منابع انسانی",
    score: 65,
  },
  {
    name: "فرآیندها و عملیات",
    score: 82,
  },
  {
    name: "فناوری و زیرساخت",
    score: 74,
  },
  {
    name: "داده و تحلیل",
    score: 61,
  },
  {
    name: "خدمات و مشتریان",
    score: 86,
  },
  {
    name: "نوآوری دیجیتال",
    score: 69,
  },
];

const recentResults = [
  {
    name: "شرکت توانیر",
    industry: "انرژی",
    companyType: "توانیر",
    score: 82,
    level: "پیشرفته",
    date: "1405/05/27",
  },
  {
    name: "شرکت برق منطقه‌ای تهران",
    industry: "انرژی",
    companyType: "برق منطقه‌ای",
    score: 74,
    level: "متوسط",
    date: "1405/05/26",
  },
  {
    name: "گلخانه سبز آریا",
    industry: "کشاورزی",
    companyType: "گلخانه",
    score: 68,
    level: "متوسط",
    date: "1405/05/25",
  },
  {
    name: "مرغداری نوین البرز",
    industry: "کشاورزی",
    companyType: "مرغداری",
    score: 57,
    level: "در حال توسعه",
    date: "1405/05/24",
  },
  {
    name: "شرکت توزیع نیروی برق فارس",
    industry: "انرژی",
    companyType: "توزیع",
    score: 89,
    level: "پیشرفته",
    date: "1405/05/23",
  },
];

function getScoreBadgeClass(score: number) {
  if (score >= 80) {
    return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400";
  }

  if (score >= 60) {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  }

  return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";
}

export default function ResultsPage() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              نتایج ارزیابی‌ها
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              خلاصه‌ای از وضعیت و نتایج ارزیابی آمادگی دیجیتال کاربران
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
            {/* Total Assessments */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>کل ارزیابی‌ها</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  1,248
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <TrendingUpIcon />
                    +12.5%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  افزایش تعداد ارزیابی‌ها
                  <ArrowUpIcon className="size-4" />
                </div>

                <div className="text-muted-foreground">نسبت به ماه گذشته</div>
              </CardFooter>
            </Card>

            {/* Average Score */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>میانگین امتیاز آمادگی دیجیتال</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  72.4
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / 100
                  </span>
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <TrendingUpIcon />
                    +4.8%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  بهبود میانگین امتیاز
                  <ArrowUpIcon className="size-4" />
                </div>

                <div className="text-muted-foreground">نسبت به دوره قبلی</div>
              </CardFooter>
            </Card>

            {/* Highest Score */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>بالاترین امتیاز</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  94
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / 100
                  </span>
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <ArrowUpIcon />
                    عالی
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  بهترین عملکرد ثبت‌شده
                  <BarChart3Icon className="size-4" />
                </div>

                <div className="text-muted-foreground">
                  در بین تمام ارزیابی‌ها
                </div>
              </CardFooter>
            </Card>

            {/* Completed Assessments */}
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>ارزیابی‌های تکمیل‌شده</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  1,126
                </CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <CheckCircle2Icon />
                    90.2%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  نرخ تکمیل ارزیابی
                  <CheckCircle2Icon className="size-4" />
                </div>

                <div className="text-muted-foreground">
                  از مجموع ارزیابی‌های شروع‌شده
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Dimensions */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>میانگین امتیاز ابعاد</CardTitle>

                <CardDescription>
                  مقایسه میانگین امتیاز کاربران در هفت بُعد ارزیابی
                </CardDescription>
              </CardHeader>

              <div className="grid grid-cols-1 gap-5 px-6 pb-6 md:grid-cols-2 lg:grid-cols-3">
                {dimensions.map((dimension) => (
                  <div key={dimension.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium">
                        {dimension.name}
                      </span>

                      <span className="text-sm font-semibold tabular-nums">
                        {dimension.score}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${dimension.score}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Results */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>آخرین نتایج</CardTitle>

                <CardDescription>
                  آخرین ارزیابی‌های تکمیل‌شده توسط کاربران
                </CardDescription>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-right">
                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        شرکت / کاربر
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        صنعت
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        نوع شرکت
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        امتیاز
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        سطح آمادگی
                      </th>

                      <th className="px-6 py-3 font-medium text-muted-foreground">
                        تاریخ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentResults.map((result) => (
                      <tr
                        key={`${result.name}-${result.date}`}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-4 font-medium">{result.name}</td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {result.industry}
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {result.companyType}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold tabular-nums">
                            {result.score}
                          </span>
                          <span className="text-muted-foreground"> / 100</span>
                        </td>

                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={getScoreBadgeClass(result.score)}
                          >
                            {result.level}
                          </Badge>
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {result.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Bottom Summary */}
          <div className="grid grid-cols-1 gap-4 px-4 @xl/main:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardDescription>وضعیت کاربران</CardDescription>

                <CardTitle className="text-xl">وضعیت کلی ارزیابی‌ها</CardTitle>
              </CardHeader>

              <CardFooter className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <UsersIcon className="mx-auto mb-2 size-5 text-muted-foreground" />

                  <div className="text-xl font-semibold">1,248</div>

                  <div className="text-xs text-muted-foreground">
                    کل کاربران
                  </div>
                </div>

                <div className="text-center">
                  <CheckCircle2Icon className="mx-auto mb-2 size-5 text-muted-foreground" />

                  <div className="text-xl font-semibold">1,126</div>

                  <div className="text-xs text-muted-foreground">تکمیل‌شده</div>
                </div>

                <div className="text-center">
                  <TrendingUpIcon className="mx-auto mb-2 size-5 text-muted-foreground" />

                  <div className="text-xl font-semibold">90.2%</div>

                  <div className="text-xs text-muted-foreground">نرخ تکمیل</div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>کمترین امتیاز</CardDescription>

                <CardTitle className="text-xl">داده و تحلیل</CardTitle>

                <CardAction>
                  <Badge variant="outline">
                    <ArrowDownIcon />
                    61%
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="font-medium">
                  این بُعد پایین‌ترین میانگین امتیاز را دارد.
                </div>

                <div className="text-muted-foreground">
                  تمرکز بیشتر روی مدیریت داده و تحلیل اطلاعات می‌تواند بیشترین
                  تأثیر را در بهبود آمادگی دیجیتال داشته باشد.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
