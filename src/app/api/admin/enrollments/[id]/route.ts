import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../../../lib/db';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.execute(
      'SELECT * FROM enrollments WHERE id = ? LIMIT 1',
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enrollment: rows[0],
    });
  } catch (error) {
    console.error('FETCH ONE ENROLLMENT ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch enrollment',
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();

    const sql = `
      UPDATE enrollments SET
        school_year_from = ?,
        school_year_to = ?,
        learner_reference_no = ?,
        grade_level_to_enroll = ?,
        kinder_program = ?,

        psa_birth_certificate_no = ?,
        last_name = ?,
        first_name = ?,
        middle_name = ?,
        extension_name = ?,
        birthdate = ?,
        age = ?,
        sex = ?,
        religion = ?,
        birth_place = ?,
        mother_tongue = ?,

        ip_community = ?,
        ip_details = ?,
        four_ps = ?,
        four_ps_id = ?,

        current_house_no = ?,
        current_street = ?,
        current_barangay = ?,
        current_city = ?,
        current_province = ?,
        current_country = ?,
        current_zip = ?,

        same_address = ?,
        permanent_house_no = ?,
        permanent_street = ?,
        permanent_barangay = ?,
        permanent_city = ?,
        permanent_province = ?,
        permanent_country = ?,
        permanent_zip = ?,

        father_last_name = ?,
        father_first_name = ?,
        father_middle_name = ?,
        father_contact = ?,

        mother_last_name = ?,
        mother_first_name = ?,
        mother_middle_name = ?,
        mother_contact = ?,

        guardian_last_name = ?,
        guardian_first_name = ?,
        guardian_middle_name = ?,
        guardian_contact = ?,

        special_needs = ?,
        sned_diagnosis = ?,
        sned_manifestations = ?,
        pwd_id = ?,

        last_grade_completed = ?,
        last_school_year = ?,
        last_school = ?,
        school_id = ?,

        semester = ?,
        track = ?,
        strand = ?,

        learning_modalities = ?,

        parent_full_name = ?,
        certification_accepted = ?,
        signature_date = ?
      WHERE id = ?
    `;

    const values = [
      body.schoolYearFrom || null,
      body.schoolYearTo || null,
      body.learnerReferenceNo || null,
      body.gradeLevelToEnroll || null,
      body.kinderProgram || null,

      body.psaBirthCertificateNo || null,
      body.lastName || null,
      body.firstName || null,
      body.middleName || null,
      body.extensionName || null,
      body.birthdate || null,
      body.age ? Number(body.age) : null,
      body.sex || null,
      body.religion || null,
      body.birthPlace || null,
      body.motherTongue || null,

      body.ipCommunity || null,
      body.ipDetails || null,
      body.fourPs || null,
      body.fourPsId || null,

      body.currentHouseNo || null,
      body.currentStreetName || null,
      body.currentBarangay || null,
      body.currentMunicipalityCity || null,
      body.currentProvince || null,
      body.currentCountry || null,
      body.currentZipCode || null,

      body.sameAddress || null,
      body.permanentHouseNo || null,
      body.permanentStreetName || null,
      body.permanentBarangay || null,
      body.permanentMunicipalityCity || null,
      body.permanentProvince || null,
      body.permanentCountry || null,
      body.permanentZipCode || null,

      body.fatherLastName || null,
      body.fatherFirstName || null,
      body.fatherMiddleName || null,
      body.fatherContactNumber || null,

      body.motherLastName || null,
      body.motherFirstName || null,
      body.motherMiddleName || null,
      body.motherContactNumber || null,

      body.guardianLastName || null,
      body.guardianFirstName || null,
      body.guardianMiddleName || null,
      body.guardianContactNumber || null,

      body.specialNeedsProgram || null,
      JSON.stringify(body.snedDiagnosis || []),
      JSON.stringify(body.snedManifestations || []),
      body.pwdIdHolder || null,

      body.lastGradeLevelCompleted || null,
      body.lastSchoolYearCompleted || null,
      body.lastSchoolAttended || null,
      body.schoolId || null,

      body.semester || null,
      body.track || null,
      body.strand || null,

      JSON.stringify(body.preferredLearningModality || []),

      body.parentFullName || null,
      body.certificationAccepted ? 1 : 0,
      body.signatureDate || null,

      id,
    ];

    await pool.execute(sql, values);

    return NextResponse.json({
      success: true,
      message: 'Enrollment updated successfully.',
    });
  } catch (error) {
    console.error('UPDATE ENROLLMENT ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update enrollment',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await pool.execute('DELETE FROM enrollments WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Enrollment deleted successfully.',
    });
  } catch (error) {
    console.error('DELETE ENROLLMENT ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete enrollment',
      },
      { status: 500 }
    );
  }
}