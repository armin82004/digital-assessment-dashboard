"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import TavanirProfileForm from "@/app/_components/TavanirProfileForm";
import AgricultureProfileForm from "@/app/_components/AgricultureProfileForm";

type SectorCode = "tavanir" | "poultry" | "greenhouse";

type Sector = {
  id: string;
  code: SectorCode;
};

function RespondentProfileContents() {
  const searchParams = useSearchParams();

  const sectorId = searchParams.get("sectorId");
  const industryId = searchParams.get("industryId");

  const [sector, setSector] = useState<Sector | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sectorId) return;

    async function fetchSector() {
      try {
        setError(false);

        const res = await fetch(`/api/sectors/${sectorId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch sector");
        }

        const data = await res.json();

        if (
          data.code !== "tavanir" &&
          data.code !== "poultry" &&
          data.code !== "greenhouse"
        ) {
          throw new Error("Invalid sector");
        }

        setSector({
          id: data.id,
          code: data.code,
        });
      } catch (error) {
        console.error(error);
        setError(true);
      }
    }

    fetchSector();
  }, [sectorId]);

  if (!industryId || !sectorId) {
    return null;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p>خطا در دریافت اطلاعات بخش</p>
      </main>
    );
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-8 sm:size-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 py-4 sm:py-8 dark:bg-linear-to-t dark:from-neutral-950 dark:to-neutral-800">
      {sector.code === "tavanir" && (
        <TavanirProfileForm industryId={industryId} sectorId={sectorId} />
      )}

      {(sector.code === "poultry" || sector.code === "greenhouse") && (
        <AgricultureProfileForm
          industryId={industryId}
          sectorId={sectorId}
          sector={sector.code}
        />
      )}
    </main>
  );
}

export default function RespondentProfile() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center dark:bg-linear-to-t dark:from-neutral-950 dark:to-neutral-800">
          <Spinner className="size-8 sm:size-10" />
        </div>
      }
    >
      <RespondentProfileContents />
    </Suspense>
  );
}
