"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CompanyType = "greenhouse" | "poultry" | "tavanir" | null;

type sectors = {
  id: string;
  name: string;
  code: "agriculture" | "energy";
  description: string;
  industry_code: string;
};

export default function CompanyTypePage() {
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [sectors, setSectors] = useState<sectors[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const industry = searchParams.get("industryId");
  useEffect(() => {
    fetch(`/api/sectors?industry=${industry}`)
      .then((res) => res.json())
      .then((data) => setSectors(data));
  }, []);

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
    <main className="min-h-screen flex items-center justify-center">
      {sectors.length === 0 ? (
        <div className="p-10 flex items-center justify-center gap-10 w-2xl">
          <Spinner className="size-10" />
        </div>
      ) : (
        <div className="p-10 flex flex-col gap-10 w-2xl">
          <h1 className="text-2xl">نوع فعالیت شرکت شما چیست؟</h1>

          <RadioGroup
            value={selectedSectorId ?? ""}
            onValueChange={(value) => setSelectedSectorId(value)}
            className="flex"
          >
            {sectors.map((item) => (
              <FieldLabel key={item.id} htmlFor={item.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{item.name}</FieldTitle>
                    <FieldDescription>{item.description}</FieldDescription>
                  </FieldContent>

                  <RadioGroupItem value={item.id} id={item.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <Button
            className="self-end"
            size="lg"
            disabled={!selectedSectorId}
            onClick={handleContinue}
          >
            تأیید
          </Button>
        </div>
      )}
    </main>
  );
}
