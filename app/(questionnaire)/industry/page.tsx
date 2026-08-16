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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Industry = {
  id: string;
  name: string;
  code: "agriculture" | "energy";
  description: string;
};

export default function SelectIndustry() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/industries")
      .then((res) => res.json())
      .then((data) => {
        setIndustries(data);
      });
  }, []);

  function handleContinue() {
    if (!selectedId) return;

    router.push(`/company-type?industryId=${selectedId}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      {industries.length === 0 ? (
        <div className="p-10 flex items-center justify-center gap-10 w-2xl">
          <Spinner className="size-10" />
        </div>
      ) : (
        <div className="p-10 flex flex-col gap-10 w-2xl">
          <h1 className="text-2xl">شرکت شما در چه صنعتی قرار می گیرد؟</h1>

          <RadioGroup
            onValueChange={(value) => {
              setSelectedId(value);
            }}
            className="flex"
          >
            {industries.map((item) => (
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
            disabled={!selectedId}
            onClick={handleContinue}
          >
            تایید
          </Button>
        </div>
      )}
    </main>
  );
}
