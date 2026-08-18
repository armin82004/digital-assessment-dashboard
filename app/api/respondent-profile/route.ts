import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { industry_id, sector_id, full_name, company_id, position } = body;

    if (!industry_id || !sector_id || !full_name || !company_id || !position) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const result = await pool.query(
      `
      INSERT INTO respondent_profiles
      (
        industry_id,
        sector_id,
        full_name,
        company_id,
        position
      )
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [industry_id, sector_id, full_name, company_id, position],
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
