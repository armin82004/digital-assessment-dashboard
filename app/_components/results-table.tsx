"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
            <SelectValue placeholder="فیلتر بخش" />
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
              <TableHead className="text-left">جزئیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => {
              const maturity = getMaturityLevel(row.overall_score);
              return (
                <TableRow key={row.id}>
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
                    {maturity ? `سطح ${maturity.level} - ${maturity.title}` : "—"}
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline" size="sm">
                      <a href={`/dashboard/results/${row.id}`}>جزئیات بیشتر</a>
                    </Button>
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