import CompanyTypeContent from "@/app/_components/CompanyTypeContent";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default function CompanyTypePage() {
  return (
    <Suspense fallback={<Spinner className="size-10" />}>
      <CompanyTypeContent />
    </Suspense>
  );
}