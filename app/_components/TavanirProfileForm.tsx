"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type TavanirCompanyType =
  | "iran_grid_management"
  | "regional_electric"
  | "distribution"
  | "tavanir";

const tavanirCompanyTypeLabels: Record<TavanirCompanyType, string> = {
  iran_grid_management: "مدیریت شبکه برق ایران",
  regional_electric: "شرکت برق منطقه‌ای",
  distribution: "شرکت توزیع نیروی برق",
  tavanir: "شرکت توانیر",
};

type Props = {
  industryId: string;
  sectorId: string;
};

export default function TavanirProfileForm({ industryId, sectorId }: Props) {
  const [companyTypes, setCompanyTypes] = useState<TavanirCompanyType[]>([]);
  const router = useRouter();
  const [profile, setProfile] = useState<{
    full_name: string;
    company_type: TavanirCompanyType | null;
    position: string;
  }>({
    full_name: "",
    company_type: null,
    position: "",
  });

  useEffect(() => {
    fetch("/api/respondent-information")
      .then((res) => res.json())
      .then((data) => {
        setCompanyTypes(
          data.map(
            (item: { company_type: TavanirCompanyType }) => item.company_type,
          ),
        );
      });
  }, []);

  async function handleSubmit() {
    const data = {
      ...profile,
      industry_id: industryId,
      sector_id: sectorId,
    };

    const res = await fetch("/api/respondent-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(await res.text());
      return;
    }

    const result = await res.json();

    router.push(
      `/questions?respondentId=${result.id}&industryId=${industryId}&sectorId=${sectorId}`,
    );
  }

  return (
    <div className="p-2 sm:p-6 md:p-10 flex flex-col gap-6 w-full max-w-2xl">
      <h1 className="text-xl sm:text-2xl">اطلاعات تکمیلی کسب‌وکار</h1>

      <div className="grid gap-2">
        <Label>نام و نام خانوادگی</Label>

        <Input
          dir="rtl"
          onChange={(e) =>
            setProfile({
              ...profile,
              full_name: e.target.value,
            })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label>نوع شرکت</Label>

        <Select
          value={profile.company_type ?? ""}
          onValueChange={(value) =>
            setProfile({
              ...profile,
              company_type: value as TavanirCompanyType,
            })
          }
        >
          <SelectTrigger>
            <SelectValue>
              {profile.company_type
                ? tavanirCompanyTypeLabels[profile.company_type]
                : "انتخاب کنید"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {companyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {tavanirCompanyTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>سمت</Label>

        <Input
          dir="rtl"
          placeholder="مدیر IT"
          onChange={(e) =>
            setProfile({
              ...profile,
              position: e.target.value,
            })
          }
        />
      </div>

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
            disabled={
              !profile.full_name || !profile.company_type || !profile.position
            }
            onClick={handleSubmit}
          >
            تایید
          </Button>
        </div>
      </div>
    </div>
  );
}
