import { pool } from "../auth";
import type { QuestionnaireResult } from "./results-helpers";

export * from "./results-helpers";

export async function getQuestionnaireResults(): Promise<
  QuestionnaireResult[]
> {
  const { rows } = await pool.query(`
    SELECT
      rp.id,
      rp.full_name,
      rp.position,
      rp.company_name,
      rp.province,
      s.code AS sector_code,
      ind.name AS industry_name,
      tc.type AS tavanir_company_type,
      ros.overall_score
    FROM respondent_profiles rp
    JOIN sectors s ON s.id = rp.sector_id
    JOIN industries ind ON ind.id = rp.industry_id
    LEFT JOIN tavanir_companies tc ON tc.id = rp.company_id
    LEFT JOIN respondent_overall_scores ros ON ros.respondent_profile_id = rp.id
    WHERE ros.overall_score IS NOT NULL
    ORDER BY ros.overall_score DESC;
  `);
  return rows;
}
