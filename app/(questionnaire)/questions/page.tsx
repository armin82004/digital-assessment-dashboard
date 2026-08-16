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
import { useEffect, useMemo, useState } from "react";
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

export default function QuestionsPage() {
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
      <main className="min-h-screen flex items-center justify-center">
        <Spinner className="size-10" />
      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>خطا در دریافت اطلاعات ارزیابی</p>
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
    <main className="absolute inset-x-0 top-20 min-h-screen flex items-center justify-center">
      <div className="p-10 flex flex-col gap-8 w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{dimension.title}</span>

            <span>
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
          <span className="text-sm text-muted-foreground">
            {question.component} / {question.indicator}
          </span>

          {question.generalQuestion && (
            <p className="text-base text-muted-foreground">
              {question.generalQuestion}
            </p>
          )}

          <h1 className="text-xl font-medium">{question.specificQuestion}</h1>
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
                  <FieldDescription>{criterion.description}</FieldDescription>
                </FieldContent>

                <RadioGroupItem
                  value={criterion.score.toString()}
                  id={`${question.id}-${criterion.score}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isFirst}>
            قبلی
          </Button>

          <Button onClick={handleNext} disabled={!currentAnswer}>
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
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-10 flex flex-col gap-6 w-full max-w-3xl">
        <h1 className="text-2xl">نتیجه ارزیابی شما</h1>

        <div className="rounded-lg border p-4 flex items-center justify-between">
          <span className="text-muted-foreground">امتیاز کلی</span>

          <span className="text-xl font-semibold">
            {faNum(overallScore, 2)} از {toPersianDigits(5)} (
            {faNum((overallScore / 5) * 100, 0)}
            %)
          </span>
        </div>

        <div className="h-80 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                domain={[0, 5]}
                tickFormatter={(value: number) => toPersianDigits(value)}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [faNum(Number(value ?? 0), 2), "امتیاز"]}
              />

              <Bar dataKey="امتیاز" fill="var(--primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
          {dimensionScores.map((d) => (
            <div key={d.id} className="flex justify-between border-b pb-2">
              <span>{d.title}</span>

              <span>
                {faNum(d.score, 1)} از {toPersianDigits(5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
