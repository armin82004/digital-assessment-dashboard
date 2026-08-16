import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const result = await pool.query(
    'SELECT 1 FROM "user" WHERE email = $1 LIMIT 1',
    [email],
  );

  return NextResponse.json({
    exists: result.rowCount === 1,
  });
}
