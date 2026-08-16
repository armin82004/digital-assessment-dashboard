import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query("SELECT * FROM industries ORDER BY name");

  return NextResponse.json(result.rows);
}
