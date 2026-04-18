import { NextResponse } from 'next/server';
import { pool } from '../../../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        CONCAT(
          COALESCE(last_name, ''),
          ', ',
          COALESCE(first_name, ''),
          CASE
            WHEN middle_name IS NOT NULL AND middle_name != '' THEN CONCAT(' ', middle_name)
            ELSE ''
          END
        ) AS full_name,
        grade_level_to_enroll,
        CONCAT(
          COALESCE(school_year_from, ''),
          '-',
          COALESCE(school_year_to, '')
        ) AS school_year,
        created_at
      FROM enrollments
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      success: true,
      enrollments: rows,
    });
  } catch (error) {
    console.error('FETCH ENROLLMENTS ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch enrollments',
      },
      { status: 500 }
    );
  }
}