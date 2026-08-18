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
import { Suspense, useEffect, useState } from "react";

type Answer = Record<string, 1 | 2 | 3 | 4 | 5>;

type Question = {
  question_id: string;
  question_text: string;

  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  option_5: string;

  index_title: string;
  component_title: string;
  dimension_title: string;
};

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number) {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

function QuestionsContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const industryId = searchParams.get("industryId");
  const sectorId = searchParams.get("sectorId");
  const respondentId = searchParams.get("respondentId");

  const [questions, setQuestions] = useState<Question[]>([]);

  const [answers, setAnswers] = useState<Answer>({});

  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!sectorId || !respondentId) {
      router.replace("/industry");

      return;
    }

    async function loadQuestions() {
      try {
        const res = await fetch(`/api/questionnaire?sectorId=${sectorId}`);

        const data = await res.json();

        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [sectorId, respondentId, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>سوالی برای این بخش وجود ندارد</p>
      </main>
    );
  }

  const question = questions[currentIndex];

  const currentAnswer = answers[question.question_id];

  const isFirst = currentIndex === 0;

  const isLast = currentIndex === questions.length - 1;

function handleAnswer(value: string) {
  const score = Number(value) as 1 | 2 | 3 | 4 | 5;

  setAnswers((prev) => ({
    ...prev,
    [question.question_id]: score,
  }));
}

async function handleNext() {
  if (!currentAnswer) return;

  const finalAnswers = {
    ...answers,
    [question.question_id]: currentAnswer,
  };

  if (isLast) {
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          respondent_profile_id: respondentId,
          industry_id: industryId,
          sector_id: sectorId,
          answers: finalAnswers,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error(error);
        return;
      }

      setFinished(true);
    } catch (error) {
      console.error(error);
    }

    return;
  }

  setAnswers(finalAnswers);

  setCurrentIndex((prev) => prev + 1);
}

  function handleBack() {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  if (finished) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <h1 className="text-2xl font-bold">ارزیابی شما ثبت شد</h1>

          <Button
            onClick={() => router.push(`/result?respondentId=${respondentId}`)}
          >
            مشاهده نتیجه
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 pt-24 pb-10 sm:py-12">
      <div className="p-4 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>{question.dimension_title}</span>

            <span>
              سوال {toPersianDigits(currentIndex + 1)} از{" "}
              {toPersianDigits(questions.length)}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {question.component_title}
            {" / "}
            {question.index_title}
          </span>

          <h1 className="text-lg sm:text-xl font-medium leading-relaxed">
            {question.question_text}
          </h1>
        </div>

        <RadioGroup
          value={currentAnswer?.toString() ?? ""}
          onValueChange={handleAnswer}
          className="flex flex-col gap-3"
        >
          {[
            question.option_1,
            question.option_2,
            question.option_3,
            question.option_4,
            question.option_5,
          ].map((option, index) => (
            <FieldLabel
              key={index}
              htmlFor={`${question.question_id}-${index + 1}`}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldDescription>{option}</FieldDescription>
                </FieldContent>

                <RadioGroupItem
                  value={(index + 1).toString()}
                  id={`${question.question_id}-${index + 1}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isFirst}
            onClick={handleBack}
          >
            قبلی
          </Button>

          <Button
            className="w-full sm:w-auto"
            disabled={!currentAnswer}
            onClick={handleNext}
          >
            {isLast ? "پایان و مشاهده نتیجه" : "بعدی"}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <QuestionsContent />
    </Suspense>
  );
}
