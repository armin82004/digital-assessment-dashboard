import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const sectorId = searchParams.get("sectorId");

    if (!sectorId) {
      return NextResponse.json(
        { error: "sectorId is required" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      `
      SELECT
        q.id AS question_id,
        q.text AS question_text,
        q.option_1,
        q.option_2,
        q.option_3,
        q.option_4,
        q.option_5,
        q.display_order AS question_order,

        i.id AS index_id,
        i.title AS index_title,
        i.dimension_weight,
        i.main_weight,
        i.indicator_weight,
        i.global_weight,

        c.id AS component_id,
        c.title AS component_title,

        d.id AS dimension_id,
        d.title AS dimension_title

      FROM questions q

      JOIN indices i
        ON q.index_id = i.id

      JOIN components c
        ON i.component_id = c.id

      JOIN dimensions d
        ON i.dimension_id = d.id

      WHERE q.sector_id = $1

      ORDER BY
        d.display_order,
        c.display_order,
        q.display_order
      `,
      [sectorId],
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
