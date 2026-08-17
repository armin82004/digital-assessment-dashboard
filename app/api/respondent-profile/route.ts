import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { industry_id, sector_id, full_name, company_type, position } = body;

  const result = await pool.query(
    `
    INSERT INTO respondent_profiles
    (
      industry_id,
      sector_id,
      first_name,
      company_type,
      position
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id
    `,
    [industry_id, sector_id, full_name, company_type, position],
  );

  return NextResponse.json({
    id: result.rows[0].id,
  });
}
