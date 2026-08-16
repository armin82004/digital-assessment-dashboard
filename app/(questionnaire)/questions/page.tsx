"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  getQuestionnaire,
  type Sector,
  type Question,
  type Dimension,
  type SectorQuestionnaire,
} from "@/data/questions";
import { indicatorWeights } from "@/data/weights";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Answers = Record<string, 1 | 2 | 3 | 4 | 5>;

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function faNum(value: number, fractionDigits = 0): string {
  return toPersianDigits(value.toFixed(fractionDigits));
}

const WEIGHTED_SECTORS = new Set<Sector>(["greenhouse", "poultry"]);

function hasWeights(sector: Sector): sector is "greenhouse" | "poultry" {
  return WEIGHTED_SECTORS.has(sector);
}

function isValidSector(value: string): value is Sector {
  return ["greenhouse", "poultry", "tavanir"].includes(value);
}

interface DimensionScore {
  id: string;
  title: string;
  score: number;
  percent: number;
}

function computeDimensionScores(
  sector: Sector,
  questionnaire: SectorQuestionnaire,
  answers: Answers,
): DimensionScore[] {
  const sectorWeights = hasWeights(sector)
    ? indicatorWeights[sector]
    : undefined;

  return questionnaire.dimensions.map((dim: Dimension) => {
    if (sectorWeights) {
      let weightedSum = 0;
      let weightTotal = 0;

      dim.questions.forEach((q: Question) => {
        const w = sectorWeights[q.indicator];

        const relWeight = w
          ? w.mainWeight * w.indWeight
          : 1 / dim.questions.length;

        if (!w) {
          console.warn(
            `[weights] برای اندیکاتور "${q.indicator}" (سوال ${q.id}) وزنی در weights.ts پیدا نشد.`,
          );
        }

        weightedSum += (answers[q.id] ?? 0) * relWeight;
        weightTotal += relWeight;
      });

      const score = weightTotal > 0 ? weightedSum / weightTotal : 0;

      return {
        id: dim.id,
        title: dim.title,
        score,
        percent: (score / 5) * 100,
      };
    }

    const scores = dim.questions.map((q: Question) => answers[q.id] ?? 0);

    const score = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      id: dim.id,
      title: dim.title,
      score,
      percent: (score / 5) * 100,
    };
  });
}

function computeOverallScore(
  sector: Sector,
  questionnaire: SectorQuestionnaire,
  answers: Answers,
): number {
  const sectorWeights = hasWeights(sector)
    ? indicatorWeights[sector]
    : undefined;

  const allQuestions = questionnaire.dimensions.flatMap((d) => d.questions);

  if (sectorWeights) {
    let weightedSum = 0;
    let weightTotal = 0;

    allQuestions.forEach((q) => {
      const w = sectorWeights[q.indicator];
      const gw = w ? w.globalWeight : 0;

      weightedSum += (answers[q.id] ?? 0) * gw;
      weightTotal += gw;
    });

    return weightTotal > 0 ? weightedSum / weightTotal : 0;
  }

  const scores = allQuestions.map((q) => answers[q.id] ?? 0);

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const industryId = searchParams.get("industryId");
  const sectorId = searchParams.get("sectorId");

  const [codes, setCodes] = useState<{
    industry_code: string;
    sector_code: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!industryId || !sectorId) {
      router.replace("/industry");
    }
  }, [industryId, sectorId, router]);

  useEffect(() => {
    if (!industryId || !sectorId) {
      return;
    }

    async function fetchCodes() {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `/api/getcode?industryId=${industryId}&sectorId=${sectorId}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch assessment info");
        }

        const data = await res.json();

        console.log("assessment info:", data);

        setCodes(data);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [industryId, sectorId]);
  const sectorCode: Sector | null =
    codes?.sector_code && isValidSector(codes.sector_code)
      ? codes.sector_code
      : null;
  const questionnaire = useMemo(
    () => (sectorCode ? getQuestionnaire(sectorCode) : null),
    [sectorCode],
  );

  const flatItems = useMemo(
    () =>
      questionnaire
        ? questionnaire.dimensions.flatMap((dimension) =>
            dimension.questions.map((question) => ({
              dimension,
              question,
            })),
          )
        : [],
    [questionnaire],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);

  const total = flatItems.length;
  const currentItem = flatItems[currentIndex];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <Spinner className="size-8 sm:size-10" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <p className="text-center text-pretty">خطا در دریافت اطلاعات ارزیابی</p>
      </main>
    );
  }

  if (!sectorCode || !questionnaire || !currentItem) {
    return null;
  }

  const { dimension, question } = currentItem;

  const currentAnswer = answers[question.id];

  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;

  function handleAnswer(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: Number(value) as 1 | 2 | 3 | 4 | 5,
    }));
  }

  function handleBack() {
    if (!isFirst) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function handleNext() {
    if (!currentAnswer) return;

    if (isLast) {
      setFinished(true);
      return;
    }

    setCurrentIndex((i) => i + 1);
  }

  if (finished) {
    return (
      <ResultSummary
        sector={sectorCode}
        questionnaire={questionnaire}
        answers={answers}
      />
    );
  }

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 pt-24 pb-10 sm:py-12">
      <div className="p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1 justify-between text-xs sm:text-sm text-muted-foreground">
            <span>{dimension.title}</span>

            <span className="whitespace-nowrap">
              سوال {toPersianDigits(currentIndex + 1)} از{" "}
              {toPersianDigits(total)}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${(((currentIndex + 1) / total) * 100).toFixed(2)}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground text-pretty">
            {question.component} / {question.indicator}
          </span>

          {question.generalQuestion && (
            <p className="text-sm sm:text-base text-muted-foreground text-pretty">
              {question.generalQuestion}
            </p>
          )}

          <h1 className="text-lg sm:text-xl font-medium leading-relaxed text-balance">
            {question.specificQuestion}
          </h1>
        </div>

        <RadioGroup
          value={currentAnswer?.toString() ?? ""}
          onValueChange={handleAnswer}
          className="flex flex-col gap-3"
        >
          {question.scoringCriteria.map((criterion) => (
            <FieldLabel
              key={criterion.score}
              htmlFor={`${question.id}-${criterion.score}`}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldDescription className="text-pretty">
                    {criterion.description}
                  </FieldDescription>
                </FieldContent>

                <RadioGroupItem
                  value={criterion.score.toString()}
                  id={`${question.id}-${criterion.score}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleBack}
            disabled={isFirst}
          >
            قبلی
          </Button>

          <Button
            className="w-full sm:w-auto"
            onClick={handleNext}
            disabled={!currentAnswer}
          >
            {isLast ? "پایان و مشاهده نتیجه" : "بعدی"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ResultSummary({
  sector,
  questionnaire,
  answers,
}: {
  sector: Sector;
  questionnaire: SectorQuestionnaire;
  answers: Answers;
}) {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const dimensionScores = useMemo(
    () => computeDimensionScores(sector, questionnaire, answers),
    [sector, questionnaire, answers],
  );

  const overallScore = useMemo(
    () => computeOverallScore(sector, questionnaire, answers),
    [sector, questionnaire, answers],
  );

  const chartData = dimensionScores.map((d) => ({
    name: d.title.replace(/^[۰-۹0-9]+-/, ""),
    امتیاز: Number(d.score.toFixed(2)),
  }));

  return (
    <main className="min-h-screen flex items-start lg:items-center justify-center px-3 sm:px-6 py-6 sm:py-10 lg:py-12">
      <div className="w-full max-w-3xl flex flex-col gap-5 sm:gap-6 p-0 sm:p-6 md:p-10">
        <h1 className="text-lg sm:text-2xl leading-relaxed text-balance">
          نتیجه ارزیابی شما
        </h1>

        <div className="rounded-lg border p-3 sm:p-4 flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center sm:justify-between">
          <span className="text-xs sm:text-base text-muted-foreground">
            امتیاز کلی
          </span>

          <span className="text-base sm:text-xl font-semibold text-balance">
            {faNum(overallScore, 2)} از {toPersianDigits(5)} (
            {faNum((overallScore / 5) * 100, 0)}
            %)
          </span>
        </div>

        <div
          className="h-56 xs:h-64 sm:h-80 lg:h-96 w-full -mx-1 sm:mx-0"
          dir="ltr"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 8, bottom: 4, left: isSmall ? 0 : 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                domain={[0, 5]}
                tick={{ fontSize: isSmall ? 10 : 12 }}
                tickFormatter={(value: number) => toPersianDigits(value)}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={isSmall ? 64 : 90}
                tick={{ fontSize: isSmall ? 9 : 11 }}
              />

              <Tooltip
                formatter={(value) => [faNum(Number(value ?? 0), 2), "امتیاز"]}
              />

              <Bar dataKey="امتیاز" fill="var(--primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          {dimensionScores.map((d) => (
            <div
              key={d.id}
              className="flex flex-col sm:flex-row gap-0.5 sm:gap-4 sm:items-baseline sm:justify-between border-b pb-2 text-xs sm:text-base"
            >
              <span className="text-pretty min-w-0">{d.title}</span>

              <span className="text-muted-foreground sm:text-foreground whitespace-nowrap shrink-0">
                {faNum(d.score, 1)} از {toPersianDigits(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={null}>
      <QuestionsContent />
    </Suspense>
  );
}
