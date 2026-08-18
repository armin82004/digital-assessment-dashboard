"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type CompanyType =
  | "iran_grid_management"
  | "regional_electric"
  | "distribution"
  | "tavanir";

type TavanirCompany = {
  id: string;
  name: string;
  type: CompanyType;
};

type Props = {
  industryId: string;
  sectorId: string;
};

const companyTypeLabels: Record<CompanyType, string> = {
  distribution: "شرکت‌های توزیع نیروی برق",
  regional_electric: "شرکت‌های برق منطقه‌ای",
  iran_grid_management: "مدیریت شبکه برق ایران",
  tavanir: "شرکت توانیر",
};

export default function TavanirProfileForm({ industryId, sectorId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [companies, setCompanies] = useState<TavanirCompany[]>([]);

  const [profile, setProfile] = useState({
    full_name: "",
    company_id: "",
    position: "",
  });

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/tavanir-companies");

        if (!res.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await res.json();

        setCompanies(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCompanies();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    if (!profile.full_name || !profile.company_id || !profile.position) {
      return;
    }

    const res = await fetch("/api/respondent-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...profile,
        industry_id: industryId,
        sector_id: sectorId,
      }),
    });

    if (!res.ok) {
      console.error(await res.text());
      setLoading(false);
      return;
    }

    const result = await res.json();
    setLoading(false);

    router.push(
      `/questions?respondentId=${result.id}&industryId=${industryId}&sectorId=${sectorId}`,
    );
  }

  function getCompanyName() {
    const company = companies.find((item) => item.id === profile.company_id);

    return company ? company.name : "";
  }

  return (
    <div className="p-2 sm:p-6 md:p-10 flex flex-col gap-6 w-full max-w-2xl">
      <h1 className="text-xl sm:text-2xl">اطلاعات تکمیلی کسب‌وکار</h1>

      <div className="grid gap-2">
        <Label>نام و نام خانوادگی</Label>

        <Input
          dir="rtl"
          value={profile.full_name}
          onChange={(e) =>
            setProfile({
              ...profile,
              full_name: e.target.value,
            })
          }
        />
      </div>

      <div className="grid gap-2">
        <Label>شرکت</Label>
        <Select
          value={profile.company_id || ""}
          onValueChange={(value) =>
            setProfile({
              ...profile,
              company_id: value as string,
            })
          }
        >
          <SelectTrigger dir="rtl">
            <SelectValue>
              {profile.company_id ? getCompanyName() : "انتخاب شرکت"}
            </SelectValue>
          </SelectTrigger>

          <SelectContent className="min-w-[350px]">
            {(
              [
                "distribution",
                "regional_electric",
                "iran_grid_management",
                "tavanir",
              ] as CompanyType[]
            ).map((type, index) => {
              const items = companies.filter(
                (company) => company.type === type,
              );

              if (items.length === 0) return null;

              return (
                <div key={type}>
                  {index !== 0 && <SelectSeparator />}

                  <SelectGroup>
                    <SelectLabel>{companyTypeLabels[type]}</SelectLabel>

                    {items.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {type === "distribution"
                          ? `شرکت توزیع نیروی برق ${company.name}`
                          : type === "regional_electric"
                            ? `شرکت برق منطقه‌ای ${company.name}`
                            : company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </div>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>سمت</Label>

        <Input
          dir="rtl"
          placeholder="مدیر IT"
          value={profile.position}
          onChange={(e) =>
            setProfile({
              ...profile,
              position: e.target.value,
            })
          }
        />
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-neutral-100/30 dark:bg-background/50 backdrop-blur-sm sm:static sm:w-auto sm:p-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            صفحه قبلی
          </Button>

          <Button
            size="lg"
            disabled={
              !profile.full_name ||
              !profile.company_id ||
              !profile.position ||
              loading
            }
            onClick={handleSubmit}
          >
            {loading ? "در حال ارسال اطلاعات..." : "تایید"}
          </Button>
        </div>
      </div>
    </div>
  );
}
