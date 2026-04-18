import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      schoolYearFrom,
      schoolYearTo,
      learnerReferenceNo,
      gradeLevelToEnroll,
      kinderProgram,

      psaBirthCertificateNo,
      lastName,
      firstName,
      middleName,
      extensionName,
      birthdate,
      age,
      sex,
      religion,
      birthPlace,
      motherTongue,

      ipCommunity,
      ipDetails,
      fourPs,
      fourPsId,

      currentHouseNo,
      currentStreetName,
      currentBarangay,
      currentMunicipalityCity,
      currentProvince,
      currentCountry,
      currentZipCode,

      sameAddress,
      permanentHouseNo,
      permanentStreetName,
      permanentBarangay,
      permanentMunicipalityCity,
      permanentProvince,
      permanentCountry,
      permanentZipCode,

      fatherLastName,
      fatherFirstName,
      fatherMiddleName,
      fatherContactNumber,

      motherLastName,
      motherFirstName,
      motherMiddleName,
      motherContactNumber,

      guardianLastName,
      guardianFirstName,
      guardianMiddleName,
      guardianContactNumber,

      specialNeedsProgram,
      snedDiagnosis,
      snedManifestations,
      pwdIdHolder,

      lastGradeLevelCompleted,
      lastSchoolYearCompleted,
      lastSchoolAttended,
      schoolId,

      semester,
      track,
      strand,

      preferredLearningModality,

      parentFullName,
      certificationAccepted,
      signatureDate,
    } = body;

    let existingId: number | null = null;

    // 1) Duplicate check using LRN if available
    if (learnerReferenceNo && String(learnerReferenceNo).trim() !== '') {
      const [rows]: any = await pool.execute(
        `
          SELECT id
          FROM enrollments
          WHERE learner_reference_no = ?
            AND school_year_from = ?
            AND school_year_to = ?
          LIMIT 1
        `,
        [learnerReferenceNo, schoolYearFrom, schoolYearTo]
      );

      if (rows.length > 0) {
        existingId = rows[0].id;
      }
    } else {
      // 2) Fallback duplicate check using name + birthdate + school year
      const [rows]: any = await pool.execute(
        `
          SELECT id
          FROM enrollments
          WHERE last_name = ?
            AND first_name = ?
            AND COALESCE(middle_name, '') = COALESCE(?, '')
            AND birthdate = ?
            AND school_year_from = ?
            AND school_year_to = ?
          LIMIT 1
        `,
        [
          lastName || '',
          firstName || '',
          middleName || '',
          birthdate || null,
          schoolYearFrom,
          schoolYearTo,
        ]
      );

      if (rows.length > 0) {
        existingId = rows[0].id;
      }
    }

    const commonValues = [
      schoolYearFrom || null,
      schoolYearTo || null,
      learnerReferenceNo || null,
      gradeLevelToEnroll || null,
      kinderProgram || null,

      psaBirthCertificateNo || null,
      lastName || null,
      firstName || null,
      middleName || null,
      extensionName || null,
      birthdate || null,
      age ? Number(age) : null,
      sex || null,
      religion || null,
      birthPlace || null,
      motherTongue || null,

      ipCommunity || null,
      ipDetails || null,
      fourPs || null,
      fourPsId || null,

      currentHouseNo || null,
      currentStreetName || null,
      currentBarangay || null,
      currentMunicipalityCity || null,
      currentProvince || null,
      currentCountry || null,
      currentZipCode || null,

      sameAddress || null,
      permanentHouseNo || null,
      permanentStreetName || null,
      permanentBarangay || null,
      permanentMunicipalityCity || null,
      permanentProvince || null,
      permanentCountry || null,
      permanentZipCode || null,

      fatherLastName || null,
      fatherFirstName || null,
      fatherMiddleName || null,
      fatherContactNumber || null,

      motherLastName || null,
      motherFirstName || null,
      motherMiddleName || null,
      motherContactNumber || null,

      guardianLastName || null,
      guardianFirstName || null,
      guardianMiddleName || null,
      guardianContactNumber || null,

      specialNeedsProgram || null,
      JSON.stringify(snedDiagnosis || []),
      JSON.stringify(snedManifestations || []),
      pwdIdHolder || null,

      lastGradeLevelCompleted || null,
      lastSchoolYearCompleted || null,
      lastSchoolAttended || null,
      schoolId || null,

      semester || null,
      track || null,
      strand || null,

      JSON.stringify(preferredLearningModality || []),

      parentFullName || null,
      certificationAccepted ? 1 : 0,
      signatureDate || null,
    ];

    if (existingId) {
      const updateSql = `
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

      await pool.execute(updateSql, [...commonValues, existingId]);

      return NextResponse.json({
        success: true,
        mode: 'updated',
        id: existingId,
        message: 'Existing enrollment record updated successfully.',
      });
    }

    const insertSql = `
      INSERT INTO enrollments (
        school_year_from,
        school_year_to,
        learner_reference_no,
        grade_level_to_enroll,
        kinder_program,

        psa_birth_certificate_no,
        last_name,
        first_name,
        middle_name,
        extension_name,
        birthdate,
        age,
        sex,
        religion,
        birth_place,
        mother_tongue,

        ip_community,
        ip_details,
        four_ps,
        four_ps_id,

        current_house_no,
        current_street,
        current_barangay,
        current_city,
        current_province,
        current_country,
        current_zip,

        same_address,
        permanent_house_no,
        permanent_street,
        permanent_barangay,
        permanent_city,
        permanent_province,
        permanent_country,
        permanent_zip,

        father_last_name,
        father_first_name,
        father_middle_name,
        father_contact,

        mother_last_name,
        mother_first_name,
        mother_middle_name,
        mother_contact,

        guardian_last_name,
        guardian_first_name,
        guardian_middle_name,
        guardian_contact,

        special_needs,
        sned_diagnosis,
        sned_manifestations,
        pwd_id,

        last_grade_completed,
        last_school_year,
        last_school,
        school_id,

        semester,
        track,
        strand,

        learning_modalities,

        parent_full_name,
        certification_accepted,
        signature_date
      )
      VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?,
        ?, ?, ?
      )
    `;

    const [result]: any = await pool.execute(insertSql, commonValues);

    return NextResponse.json({
      success: true,
      mode: 'inserted',
      id: result.insertId,
      message: 'Enrollment saved successfully.',
    });
  } catch (error) {
    console.error('API ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Database error',
      },
      { status: 500 }
    );
  }
}