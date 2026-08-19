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
  getCompanyDisplayName,
  getSectorLabel,
  formatScore,
} from "@/lib/db/results";
import { ResultsTable } from "./results-table";

export default async function ResultsPage() {
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
              {results.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <ClipboardListIcon className="size-3.5" />
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>بالاترین نمره</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {formatScore(highest?.overall_score ?? null)}
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
          {highest && (
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="font-medium">
                {getCompanyDisplayName(highest)}
              </div>
              <div className="text-muted-foreground">
                {highest.industry_name} · {getSectorLabel(highest.sector_code)}
              </div>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>کمترین نمره</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {formatScore(lowest?.overall_score ?? null)}
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
          {lowest && (
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="font-medium">{getCompanyDisplayName(lowest)}</div>
              <div className="text-muted-foreground">
                {lowest.industry_name} · {getSectorLabel(lowest.sector_code)}
              </div>
            </CardFooter>
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
