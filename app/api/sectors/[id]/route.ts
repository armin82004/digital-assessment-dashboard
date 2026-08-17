import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await pool.query(
    `
    SELECT 
      sectors.id,
      sectors.name,
      sectors.code,
      sectors.description,
      industries.code AS industry_code
    FROM sectors
    JOIN industries
      ON sectors.industry_id = industries.id
    WHERE sectors.id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "sector not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
