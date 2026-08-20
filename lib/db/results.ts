
import { pool } from "../auth";
import type {
  QuestionnaireResult,
  DimensionScore,
  IndexScore,
} from "./results-helpers";

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

export async function getQuestionnaireResultById(
  id: string,
): Promise<QuestionnaireResult | null> {
  const { rows } = await pool.query(
    `
    SELECT
      rp.id,
      rp.full_name,
      rp.position,
      rp.company_name,
      rp.province,
      rp.city,
      s.code AS sector_code,
      ind.name AS industry_name,
      tc.type AS tavanir_company_type,
      ros.overall_score
    FROM respondent_profiles rp
    JOIN sectors s ON s.id = rp.sector_id
    JOIN industries ind ON ind.id = rp.industry_id
    LEFT JOIN tavanir_companies tc ON tc.id = rp.company_id
    LEFT JOIN respondent_overall_scores ros ON ros.respondent_profile_id = rp.id
    WHERE rp.id = $1;
    `,
    [id],
  );
  return rows[0] ?? null;
}

export async function getDimensionScores(
  respondentId: string,
): Promise<DimensionScore[]> {
  const { rows } = await pool.query(
    `
    SELECT
      rds.dimension_id,
      d.title AS dimension_title,
      rds.dimension_score
    FROM respondent_dimension_scores rds
    JOIN dimensions d ON d.id = rds.dimension_id
    WHERE rds.respondent_profile_id = $1
    ORDER BY d.display_order;
    `,
    [respondentId],
  );
  return rows;
}

export async function getIndexScores(
  respondentId: string,
): Promise<IndexScore[]> {
  const { rows } = await pool.query(
    `
    SELECT
      ris.index_id,
      i.title AS index_title,
      c.title AS component_title,
      rcs.component_score,
      ris.index_score
    FROM respondent_index_scores ris
    JOIN indices i ON i.id = ris.index_id
    JOIN components c ON c.id = ris.component_id
    LEFT JOIN respondent_component_scores rcs
      ON rcs.respondent_profile_id = ris.respondent_profile_id
      AND rcs.component_id = ris.component_id
    WHERE ris.respondent_profile_id = $1
    ORDER BY c.title, i.title;
    `,
    [respondentId],
  );
  return rows;
}
