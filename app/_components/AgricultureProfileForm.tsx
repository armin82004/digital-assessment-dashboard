"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  industryId: string;
  sectorId: string;
  sector: "poultry" | "greenhouse";
};

export default function AgricultureProfileForm({
  industryId,
  sectorId,
  sector,
}: Props) {
  const router = useRouter();

  const [profile, setProfile] = useState({
    full_name: "",
    company_name: "",
    person_type: "",
    license_number: "",
    unique_id: "",
    agriculture_unique_id: "",
    province: "",
    city: "",
  });
  const isFormValid =
    profile.full_name &&
    profile.license_number &&
    profile.province &&
    profile.city &&
    (sector === "greenhouse"
      ? profile.unique_id
      : profile.agriculture_unique_id);

  async function handleSubmit() {
    try {   
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
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-2 sm:p-6 md:p-10 flex flex-col gap-6 w-full max-w-2xl">
      <h1 className="text-xl sm:text-2xl">اطلاعات تکمیلی کسب‌وکار</h1>

      <div className="grid gap-2">
        <Label>نام و نام خانوادگی / نام شرکت</Label>

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
        <Label>شماره پروانه بهره‌برداری</Label>

        <Input
          dir="rtl"
          onChange={(e) =>
            setProfile({
              ...profile,
              license_number: e.target.value,
            })
          }
        />
      </div>

      {sector === "greenhouse" ? (
        <div className="grid gap-2">
          <Label>شناسه یکتا</Label>

          <Input
            dir="rtl"
            onChange={(e) =>
              setProfile({
                ...profile,
                unique_id: e.target.value,
              })
            }
          />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label>شناسه یکتای کشاورزی</Label>

          <Input
            dir="rtl"
            onChange={(e) =>
              setProfile({
                ...profile,
                agriculture_unique_id: e.target.value,
              })
            }
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label>استان</Label>

        <Input
          dir="rtl"
          onChange={(e) =>
            setProfile({
              ...profile,
              province: e.target.value,
            })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label>شهر</Label>

        <Input
          dir="rtl"
          onChange={(e) =>
            setProfile({
              ...profile,
              city: e.target.value,
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
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            تایید
          </Button>
        </div>
      </div>
    </div>
  );
}
