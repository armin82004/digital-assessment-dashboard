"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCompanyDisplayName,
  getMaturityLevel,
  formatScore,
  toPersianDigits,
  type QuestionnaireResult,
} from "@/lib/db/results-helpers";

const SECTOR_OPTIONS = [
  { value: "all", label: "همه بخش‌ها" },
  { value: "tavanir", label: "توانیر" },
  { value: "greenhouse", label: "گلخانه" },
  { value: "poultry", label: "مرغداری" },
];

export function ResultsTable({ results }: { results: QuestionnaireResult[] }) {
  const [sector, setSector] = useState("all");
  const router = useRouter();
  const pathname = usePathname();

  const filtered = useMemo(() => {
    if (sector === "all") return results;
    return results.filter((r) => r.sector_code === sector);
  }, [results, sector]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Select
          value={sector}
          onValueChange={(value) => setSector(value ?? "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="فیلتر بخش">
              {(value: string | null) =>
                SECTOR_OPTIONS.find((opt) => opt.value === value)?.label ??
                "فیلتر بخش"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SECTOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام شرکت</TableHead>
              <TableHead>نام و نام خانوادگی</TableHead>
              <TableHead>سمت</TableHead>
              <TableHead>استان</TableHead>
              <TableHead>وزن کل</TableHead>
              <TableHead>سطح آمادگی دیجیتال</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => {
              const maturity = getMaturityLevel(row.overall_score);
              return (
                <TableRow
                  key={row.id}
                  onClick={() =>
                    router.push(`${pathname}?tab=results&id=${row.id}`)
                  }
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {getCompanyDisplayName(row)}
                  </TableCell>
                  <TableCell>{row.full_name}</TableCell>
                  <TableCell>{row.position ?? "—"}</TableCell>
                  <TableCell>{row.province ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatScore(row.overall_score)}
                  </TableCell>
                  <TableCell>
                    {maturity
                      ? `سطح ${toPersianDigits(maturity.level)} - ${maturity.title}`
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
