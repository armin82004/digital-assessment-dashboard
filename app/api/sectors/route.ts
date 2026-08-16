import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const industryId = searchParams.get("industry");

  if (!industryId) {
    return NextResponse.json(
      { error: "industry is required" },
      { status: 400 },
    );
  }

  const result = await pool.query(
    `
    SELECT 
      sectors.*,
      industries.code AS industry_code
    FROM sectors
    JOIN industries 
      ON sectors.industry_id = industries.id
    WHERE sectors.industry_id = $1
    ORDER BY sectors.code
    `,
    [industryId],
  );

  return NextResponse.json(result.rows);
}
