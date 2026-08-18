import { pool } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      industry_id,
      sector_id,
      full_name,
      company_id,
      position,
      company_name,
      person_type,
      license_number,
      unique_id,
      agriculture_unique_id,
      province,
      city,
    } = body;

    // فیلدهای مشترک
    if (!industry_id || !sector_id || !full_name) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // توانیر
    // =========================
    if (company_id) {
      if (!position) {
        return NextResponse.json(
          {
            error: "Position is required",
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
    }

    // =========================
    // گلخانه / مرغداری
    // =========================

    if (!license_number || !province || !city) {
      return NextResponse.json(
        {
          error: "Missing required agriculture fields",
        },
        {
          status: 400,
        },
      );
    }

    // گلخانه → unique_id
    // مرغداری → agriculture_unique_id
    if (!unique_id && !agriculture_unique_id) {
      return NextResponse.json(
        {
          error: "Agriculture unique ID is required",
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
        company_name,
        person_type,
        license_number,
        unique_id,
        agriculture_unique_id,
        province,
        city
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
      `,
      [
        industry_id,
        sector_id,
        full_name,
        company_name || null,
        person_type || null,
        license_number,
        unique_id || null,
        agriculture_unique_id || null,
        province,
        city,
      ],
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
