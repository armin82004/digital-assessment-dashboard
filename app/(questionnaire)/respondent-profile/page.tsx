"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import TavanirProfileForm from "@/app/_components/TavanirProfileForm";
import AgricultureProfileForm from "@/app/_components/AgricultureProfileForm";

type Sector = {
  id: string;
  slug: "tavanir" | "poultry" | "greenhouse";
};

function RespondentProfileContents() {
  const searchParams = useSearchParams();

  const sectorId = searchParams.get("sectorId");
  const industryId = searchParams.get("industryId");
  const [sector, setSector] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sectors/${sectorId}`)
      .then((res) => res.json())
      .then((data) => {
        setSector(data.code);
      });
  }, [sectorId]);

  if (!industryId || !sectorId) {
    return null;
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="size-8 sm:size-10" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-4 py-4 sm:py-8">
      {sector === "tavanir" && (
        <TavanirProfileForm industryId={industryId} sectorId={sectorId} />
      )}

      {(sector === "poultry" || sector === "greenhouse") && (
        <AgricultureProfileForm
          sector={sector}
          industryId={industryId}
          sectorId={sectorId}
        />
      )}
    </main>
  );
}

export default function RespondentProfile() {
  return (
    <Suspense fallback={null}>
      <RespondentProfileContents />
    </Suspense>
  );
}
