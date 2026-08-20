export type QuestionnaireResult = {
  id: string;
  full_name: string;
  position: string | null;
  company_name: string | null;
  province: string | null;
  city?: string | null;
  sector_code: "tavanir" | "greenhouse" | "poultry";
  industry_name: string;
  tavanir_company_type: string | null;
  overall_score: number | string | null;
};

export type DimensionScore = {
  dimension_id: string;
  dimension_title: string;
  dimension_score: number | string | null;
};

export type IndexScore = {
  index_id: string;
  index_title: string;
  component_title: string;
  component_score: number | string | null;
  index_score: number | string | null;
};

const TAVANIR_TYPE_LABELS: Record<string, string> = {
  distribution: "توزیع برق",
  regional_electric: "برق منطقه‌ای",
  tavanir: "توانیر (مرکزی)",
  iran_grid_management: "مدیریت شبکه برق ایران",
};

const SECTOR_LABELS: Record<string, string> = {
  tavanir: "توانیر",
  greenhouse: "گلخانه",
  poultry: "مرغداری",
};

// اگه شرکت "توانیر" بود، اسم شرکت = نوع شرکت (توزیع برق / برق منطقه‌ای)، وگرنه همون نام ثبت‌شده
export function getCompanyDisplayName(row: QuestionnaireResult): string {
  if (row.sector_code === "tavanir") {
    return row.tavanir_company_type
      ? (TAVANIR_TYPE_LABELS[row.tavanir_company_type] ??
          row.tavanir_company_type)
      : "—";
  }
  return row.company_name ?? "—";
}

// فرمت "توزیع برق استان تهران" برای کارت‌های بالاترین/کمترین
export function getCompanyProvinceLabel(row: QuestionnaireResult): string {
  const name = getCompanyDisplayName(row);
  if (!row.province) return name;
  return `${name} استان ${row.province}`;
}

export function getSectorLabel(code: string): string {
  return SECTOR_LABELS[code] ?? code;
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatScore(score: number | string | null): string {
  if (score === null || score === undefined) return "—";
  const n = Number(score);
  return Number.isNaN(n) ? "—" : toPersianDigits(n.toFixed(2));
}

export function getMaturityLevel(
  score: number | string | null,
): { level: number; title: string } | null {
  if (score === null || score === undefined) return null;
  const n = Number(score);
  if (Number.isNaN(n)) return null;
  if (n <= 1.8) return { level: 1, title: "ابتدایی" };
  if (n <= 2.6) return { level: 2, title: "در حال شکل‌گیری" };
  if (n <= 3.4) return { level: 3, title: "یکپارچه" };
  if (n <= 4.2) return { level: 4, title: "توسعه‌یافته" };
  return { level: 5, title: "نوآور و پیشرو" };
}
