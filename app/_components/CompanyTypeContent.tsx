"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup } from "@base-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
type sectors = {
  id: string;
  name: string;
  code: "agriculture" | "energy";
  description: string;
  industry_code: string;
};

export default function CompanyTypeContent() {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [sectors, setSectors] = useState<sectors[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const industry = searchParams.get("industryId");

  useEffect(() => {
    if (!industry) return;

    fetch(`/api/sectors?industry=${industry}`)
      .then((res) => res.json())
      .then((data) => setSectors(data));
  }, [industry]);

  const handleContinue = () => {
    if (!selectedSectorId || !industry) return;

    sessionStorage.setItem(
      "assessment",
      JSON.stringify({
        industry,
        sector: selectedSectorId,
      }),
    );

    router.push(
      `/questions?industryId=${industry}&sectorId=${selectedSectorId}`,
    );
  };

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 py-4 sm:py-8">
      {sectors.length === 0 ? (
        <div className="p-6 sm:p-10 flex items-center justify-center w-full max-w-2xl">
          <Spinner className="size-8 sm:size-10" />
        </div>
      ) : (
        <div className="p-2 sm:p-6 md:p-10 flex flex-col gap-6 sm:gap-10 w-full max-w-2xl">
          <h1 className="text-xl sm:text-2xl leading-relaxed text-balance">
            نوع فعالیت شرکت شما چیست؟
          </h1>

          <RadioGroup
            value={selectedSectorId ?? ""}
            onValueChange={setSelectedSectorId}
            className="flex flex-col sm:flex-row gap-4"
          >
            {sectors.map((item) => (
              <FieldLabel key={item.id} htmlFor={item.id} className="flex-1">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{item.name}</FieldTitle>
                    <FieldDescription className="text-pretty">
                      {item.description}
                    </FieldDescription>
                  </FieldContent>

                  <RadioGroupItem value={item.id} id={item.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>

          <div className="fixed bottom-0 left-0 w-full p-4 bg-neutral-100/30 dark:bg-background/50 backdrop-blur-sm sm:static sm:w-auto sm:p-0">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                size="lg"
                onClick={() => router.back()}
              >
                صفحه قبلی
              </Button>

              <Button
                className="w-full sm:w-auto"
                size="lg"
                disabled={!selectedSectorId}
                onClick={handleContinue}
              >
                تایید
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
