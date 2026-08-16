import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const industryId = searchParams.get("industryId");
  const sectorId = searchParams.get("sectorId");

  if (!industryId || !sectorId) {
    return NextResponse.json(
      { error: "industryId and sectorId are required" },
      { status: 400 },
    );
  }

  const result = await pool.query(
    `
    SELECT
      industries.code AS industry_code,
      sectors.code AS sector_code
    FROM sectors
    JOIN industries
      ON sectors.industry_id = industries.id
    WHERE industries.id = $1
      AND sectors.id = $2
    `,
    [industryId, sectorId],
  );

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: "Industry or sector not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(result.rows[0]);
}
