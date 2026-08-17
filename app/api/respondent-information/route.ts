import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT unnest(enum_range(NULL::tavanir_company_type)) AS company_type;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch company types" },
      { status: 500 },
    );
  }
}
