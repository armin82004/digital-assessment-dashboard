import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getQuestionnaireResultById,
  getDimensionScores,
  getIndexScores,
  getCompanyDisplayName,
  getMaturityLevel,
  formatScore,
  toPersianDigits,
} from "@/lib/db/results";
import { DimensionChart } from "./dimension-chart";

export default async function ResultsDetails({ id }: { id: string }) {
  const result = await getQuestionnaireResultById(id);

  if (!result) {
    return (
      <div className="px-4 lg:px-6">
        <div className="rounded-md border border-dashed py-16 text-center text-sm text-muted-foreground">
          پاسخی با این شناسه پیدا نشد
        </div>
        <a href="?tab=results" className="mt-4 inline-block text-sm underline">
          بازگشت به لیست نتایج
        </a>
      </div>
    );
  }

  const [dimensionScores, indexScores] = await Promise.all([
    getDimensionScores(id),
    getIndexScores(id),
  ]);

  const maturity = getMaturityLevel(result.overall_score);

  return (
    <div className="flex flex-col gap-6 px-4 py-4 lg:px-6 md:py-6">
      <a
        href="?tab=results"
        className="text-sm text-muted-foreground underline w-fit"
      >
        ← بازگشت به لیست نتایج
      </a>

      <Card>
        <CardHeader>
          <CardDescription>مشخصات پاسخ‌دهنده</CardDescription>
          <CardTitle className="text-xl">{result.full_name}</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs text-muted-foreground">شرکت</div>
            <div className="text-sm font-medium">
              {getCompanyDisplayName(result)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">صنعت</div>
            <div className="text-sm font-medium">{result.industry_name}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">سمت</div>
            <div className="text-sm font-medium">{result.position ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">استان</div>
            <div className="text-sm font-medium">{result.province ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">وزن کل</div>
            <div className="text-sm font-medium tabular-nums">
              {formatScore(result.overall_score)} / {toPersianDigits(5)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              سطح آمادگی دیجیتال
            </div>
            <div className="text-sm font-medium">
              {maturity ? (
                <Badge variant="outline">
                  سطح {toPersianDigits(maturity.level)} - {maturity.title}
                </Badge>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نمودار امتیاز ابعاد</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          {dimensionScores.length > 0 ? (
            <DimensionChart data={dimensionScores} />
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              داده‌ای برای نمایش نمودار موجود نیست
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>امتیاز شاخص‌ها</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto px-6 pb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>مؤلفه</TableHead>
                <TableHead>شاخص</TableHead>
                <TableHead className="text-left">امتیاز مؤلفه</TableHead>
                <TableHead className="text-left">امتیاز شاخص</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indexScores.map((row) => (
                <TableRow key={row.index_id}>
                  <TableCell className="text-muted-foreground">
                    {row.component_title}
                  </TableCell>
                  <TableCell className="font-medium">
                    {row.index_title}
                  </TableCell>
                  <TableCell className="text-left tabular-nums text-muted-foreground">
                    {formatScore(row.component_score)}
                  </TableCell>
                  <TableCell className="text-left tabular-nums">
                    {formatScore(row.index_score)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
