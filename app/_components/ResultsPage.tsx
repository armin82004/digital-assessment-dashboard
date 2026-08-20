import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, ClipboardListIcon } from "lucide-react";
import {
  getQuestionnaireResults,
  getCompanyProvinceLabel,
  formatScore,
  toPersianDigits,
} from "@/lib/db/results";
import { ResultsTable } from "./results-table";
import ResultsDetails from "./results-details";

export default async function ResultsPage({ id }: { id?: string }) {
  if (id) {
    return <ResultsDetails id={id} />;
  }

  const results = await getQuestionnaireResults();

  const highest = results[0] ?? null; // چون کوئری DESC مرتب شده
  const lowest = results.length ? results[results.length - 1] : null;

  return (
    <div className="flex flex-col gap-6 px-4 py-4 lg:px-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>کل پرسشنامه‌های پر شده</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {toPersianDigits(results.length)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <ClipboardListIcon className="size-3.5" />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card
          className={
            highest
              ? "cursor-pointer transition-colors hover:bg-muted/50"
              : undefined
          }
        >
          {highest ? (
            <a href={`?tab=results&id=${highest.id}`} className="contents">
              <CardHeader>
                <CardDescription>بالاترین نمره</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                  {formatScore(highest.overall_score)}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / 5
                  </span>
                </CardTitle>
                <CardAction>
                  <Badge
                    variant="outline"
                    className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                  >
                    <ArrowUpIcon className="size-3.5" />
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="font-medium">
                  {getCompanyProvinceLabel(highest)}
                </div>
                <div className="text-muted-foreground">{highest.full_name}</div>
              </CardFooter>
            </a>
          ) : (
            <CardHeader>
              <CardDescription>بالاترین نمره</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                —
              </CardTitle>
            </CardHeader>
          )}
        </Card>

        <Card
          className={
            lowest
              ? "cursor-pointer transition-colors hover:bg-muted/50"
              : undefined
          }
        >
          {lowest ? (
            <a href={`?tab=results&id=${lowest.id}`} className="contents">
              <CardHeader>
                <CardDescription>کمترین نمره</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                  {formatScore(lowest.overall_score)}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / 5
                  </span>
                </CardTitle>
                <CardAction>
                  <Badge
                    variant="outline"
                    className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
                  >
                    <ArrowDownIcon className="size-3.5" />
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="font-medium">
                  {getCompanyProvinceLabel(lowest)}
                </div>
                <div className="text-muted-foreground">{lowest.full_name}</div>
              </CardFooter>
            </a>
          ) : (
            <CardHeader>
              <CardDescription>کمترین نمره</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">
                —
              </CardTitle>
            </CardHeader>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>همه پرسشنامه‌های پر شده</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <ResultsTable results={results} />
        </div>
      </Card>
    </div>
  );
}
