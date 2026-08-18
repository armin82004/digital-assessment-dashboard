import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { respondent_profile_id, industry_id, sector_id, answers } = body;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const question_id in answers) {
        await client.query(
          `
      INSERT INTO answers
(
 respondent_profile_id,
 industry_id,
 sector_id,
 question_id,
 selected_option
)
VALUES
($1,$2,$3,$4,$5)

ON CONFLICT (
 respondent_profile_id,
 question_id
)

DO UPDATE SET
selected_option = EXCLUDED.selected_option
          `,
          [
            respondent_profile_id,
            industry_id,
            sector_id,
            question_id,
            answers[question_id],
          ],
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
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
