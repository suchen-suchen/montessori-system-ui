'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const snedDiagnoses = [
  'Attention Deficit Hyperactivity Disorder',
  'Intellectual Disability',
  'Special Health Problem/Chronic Disease',
  'Autism Spectrum Disorder',
  'Learning Disability',
  'Cancer',
  'Non-Cancer',
  'Cerebral Palsy',
  'Multiple Disabilities',
  'Visual Impairment',
  'Emotional-Behavior Disorder',
  'Orthopedic/Physical Handicap',
  'Blind',
  'Low Vision',
  'Hearing Impairment',
  'Speech/Language Disorder',
];

const snedManifestations = [
  'Difficulty in Applying Knowledge',
  'Difficulty in Mobility (Walking, Climbing and Grasping)',
  'Difficulty in Communicating',
  'Difficulty in Performing Adaptive Skills (Self-Care)',
  'Difficulty in Displaying Interpersonal Behavior',
  'Difficulty in Remembering, Concentrating, Paying Attention and Understanding',
  'Difficulty in Hearing',
  'Difficulty in Seeing',
];

const learningModalities = [
  'Modular (Print)',
  'Modular (Digital)',
  'Online',
  'Radio-Based Television',
  'Educational Television',
  'Homeschooling',
  'Blended (Combination)',
];

function safeJsonArray(value: any) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function EditEnrollmentPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchEnrollment();
  }, [router]);

  async function fetchEnrollment() {
    try {
      const res = await fetch(`/api/admin/enrollments/${params.id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load record');
      }

      const e = data.enrollment;

      setFormData({
        schoolYearFrom: e.school_year_from || '',
        schoolYearTo: e.school_year_to || '',
        learnerReferenceNo: e.learner_reference_no || '',
        withLrn: e.learner_reference_no ? 'Yes' : 'No',
        returningBalikAral: e.returning_balik_aral || '',
        gradeLevelToEnroll: e.grade_level_to_enroll || '',
        kinderProgram: e.kinder_program || '',

        psaBirthCertificateNo: e.psa_birth_certificate_no || '',
        lastName: e.last_name || '',
        firstName: e.first_name || '',
        middleName: e.middle_name || '',
        extensionName: e.extension_name || '',
        birthdate: normalizeDateForInput(e.birthdate),
        age: e.age || '',
        sex: e.sex || '',
        religion: e.religion || '',
        birthPlace: e.birth_place || '',
        motherTongue: e.mother_tongue || '',

        ipCommunity: e.ip_community || '',
        ipDetails: e.ip_details || '',
        fourPs: e.four_ps || '',
        fourPsId: e.four_ps_id || '',

        currentHouseNo: e.current_house_no || '',
        currentStreetName: e.current_street || '',
        currentBarangay: e.current_barangay || '',
        currentMunicipalityCity: e.current_city || '',
        currentProvince: e.current_province || '',
        currentCountry: e.current_country || '',
        currentZipCode: e.current_zip || '',

        sameAddress: e.same_address || '',

        permanentHouseNo: e.permanent_house_no || '',
        permanentStreetName: e.permanent_street || '',
        permanentBarangay: e.permanent_barangay || '',
        permanentMunicipalityCity: e.permanent_city || '',
        permanentProvince: e.permanent_province || '',
        permanentCountry: e.permanent_country || '',
        permanentZipCode: e.permanent_zip || '',

        fatherLastName: e.father_last_name || '',
        fatherFirstName: e.father_first_name || '',
        fatherMiddleName: e.father_middle_name || '',
        fatherContactNumber: e.father_contact || '',

        motherLastName: e.mother_last_name || '',
        motherFirstName: e.mother_first_name || '',
        motherMiddleName: e.mother_middle_name || '',
        motherContactNumber: e.mother_contact || '',

        guardianLastName: e.guardian_last_name || '',
        guardianFirstName: e.guardian_first_name || '',
        guardianMiddleName: e.guardian_middle_name || '',
        guardianContactNumber: e.guardian_contact || '',

        specialNeedsProgram: e.special_needs || '',
        snedDiagnosis: safeJsonArray(e.sned_diagnosis),
        snedManifestations: safeJsonArray(e.sned_manifestations),
        pwdIdHolder: e.pwd_id || '',

        lastGradeLevelCompleted: e.last_grade_completed || '',
        lastSchoolYearCompleted: e.last_school_year || '',
        lastSchoolAttended: e.last_school || '',
        schoolId: e.school_id || '',

        semester: e.semester || '',
        track: e.track || '',
        strand: e.strand || '',

        preferredLearningModality: safeJsonArray(e.learning_modalities),

        parentFullName: e.parent_full_name || '',
        certificationAccepted: !!e.certification_accepted,
        signatureDate: normalizeDateForInput(e.signature_date),
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load record');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleArrayToggle(
    field: 'snedDiagnosis' | 'snedManifestations' | 'preferredLearningModality',
    value: string
  ) {
    setFormData((prev: any) => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists
          ? current.filter((item: string) => item !== value)
          : [...current, value],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        snedDiagnosis: JSON.stringify(formData.snedDiagnosis || []),
        snedManifestations: JSON.stringify(formData.snedManifestations || []),
        preferredLearningModality: JSON.stringify(
          formData.preferredLearningModality || []
        ),
      };

      const res = await fetch(`/api/admin/enrollments/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update');
      }

      alert('Enrollment updated successfully.');
      router.push('/admin/enrollments');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !formData) {
    return (
      <section className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="max-w-5xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
          <div className="space-y-4 animate-pulse">
            <div className="w-56 h-8 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-100 rounded w-72" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-100 rounded-lg" />
              <div className="h-12 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700';
  const sectionTitleClass = 'mb-4 text-xl font-bold text-blue-800';
  const cardClass = 'rounded-2xl bg-white p-6 shadow-xl sm:p-8';
  const checkLabelClass = 'inline-flex items-center gap-2 text-sm text-gray-700';
  const radioWrapClass =
    'flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3';

  return (
    <section className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={cardClass}>
          <div className="flex flex-col gap-4 pb-6 mb-8 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">
                Update Enrollment Form
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Edit the learner&apos;s enrollment details below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/admin/enrollments')}
              className="rounded-lg bg-gray-600 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700"
            >
              Back to Records
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h3 className={sectionTitleClass}>School Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>School Year From</label>
                  <input
                    name="schoolYearFrom"
                    value={formData.schoolYearFrom}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="School Year From"
                  />
                </div>

                <div>
                  <label className={labelClass}>School Year To</label>
                  <input
                    name="schoolYearTo"
                    value={formData.schoolYearTo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="School Year To"
                  />
                </div>

                <div>
                  <label className={labelClass}>Learner Reference No. (LRN)</label>
                  <input
                    name="learnerReferenceNo"
                    value={formData.learnerReferenceNo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="LRN"
                  />
                </div>

                <div>
                  <label className={labelClass}>Grade Level to Enroll</label>
                  <input
                    name="gradeLevelToEnroll"
                    value={formData.gradeLevelToEnroll}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Grade Level"
                  />
                </div>

                <div>
                  <label className={labelClass}>With LRN?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="withLrn"
                        value="Yes"
                        checked={formData.withLrn === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="withLrn"
                        value="No"
                        checked={formData.withLrn === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Returning (Balik-Aral)?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="returningBalikAral"
                        value="Yes"
                        checked={formData.returningBalikAral === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="returningBalikAral"
                        value="No"
                        checked={formData.returningBalikAral === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Kinder Program</label>
                  <input
                    name="kinderProgram"
                    value={formData.kinderProgram}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Kinder Program"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Learner&apos;s Personal Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>PSA Birth Certificate No.</label>
                  <input
                    name="psaBirthCertificateNo"
                    value={formData.psaBirthCertificateNo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="PSA Birth Certificate No."
                  />
                </div>

                <div>
                  <label className={labelClass}>Birthdate</label>
                  <input
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Last Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Middle Name</label>
                  <input
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Middle Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Extension Name</label>
                  <input
                    name="extensionName"
                    value={formData.extensionName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Extension Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Age"
                  />
                </div>

                <div>
                  <label className={labelClass}>Sex</label>
                  <input
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Sex"
                  />
                </div>

                <div>
                  <label className={labelClass}>Religion</label>
                  <input
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Religion"
                  />
                </div>

                <div>
                  <label className={labelClass}>Birth Place</label>
                  <input
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Birth Place"
                  />
                </div>

                <div>
                  <label className={labelClass}>Mother Tongue</label>
                  <input
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Mother Tongue"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>
                Indigenous Peoples (IP) / 4Ps Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Belonging to any IP Community?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="ipCommunity"
                        value="Yes"
                        checked={formData.ipCommunity === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="ipCommunity"
                        value="No"
                        checked={formData.ipCommunity === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>IP Details</label>
                  <input
                    name="ipDetails"
                    value={formData.ipDetails}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="If yes, specify IP details"
                  />
                </div>

                <div>
                  <label className={labelClass}>4Ps Beneficiary?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="fourPs"
                        value="Yes"
                        checked={formData.fourPs === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="fourPs"
                        value="No"
                        checked={formData.fourPs === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>4Ps Household ID</label>
                  <input
                    name="fourPsId"
                    value={formData.fourPsId}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="4Ps Household ID"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Current Address</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>House No.</label>
                  <input
                    name="currentHouseNo"
                    value={formData.currentHouseNo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="House No."
                  />
                </div>

                <div>
                  <label className={labelClass}>Street Name</label>
                  <input
                    name="currentStreetName"
                    value={formData.currentStreetName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Street Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Barangay</label>
                  <input
                    name="currentBarangay"
                    value={formData.currentBarangay}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Barangay"
                  />
                </div>

                <div>
                  <label className={labelClass}>Municipality / City</label>
                  <input
                    name="currentMunicipalityCity"
                    value={formData.currentMunicipalityCity}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Current City"
                  />
                </div>

                <div>
                  <label className={labelClass}>Province</label>
                  <input
                    name="currentProvince"
                    value={formData.currentProvince}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Current Province"
                  />
                </div>

                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    name="currentCountry"
                    value={formData.currentCountry}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Current Country"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input
                    name="currentZipCode"
                    value={formData.currentZipCode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Zip Code"
                  />
                </div>

                <div>
                  <label className={labelClass}>Same as Current Address?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="sameAddress"
                        value="Yes"
                        checked={formData.sameAddress === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="sameAddress"
                        value="No"
                        checked={formData.sameAddress === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Permanent Address</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>House No.</label>
                  <input
                    name="permanentHouseNo"
                    value={formData.permanentHouseNo}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="House No."
                  />
                </div>

                <div>
                  <label className={labelClass}>Street Name</label>
                  <input
                    name="permanentStreetName"
                    value={formData.permanentStreetName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Street Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Barangay</label>
                  <input
                    name="permanentBarangay"
                    value={formData.permanentBarangay}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Barangay"
                  />
                </div>

                <div>
                  <label className={labelClass}>Municipality / City</label>
                  <input
                    name="permanentMunicipalityCity"
                    value={formData.permanentMunicipalityCity}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Permanent City"
                  />
                </div>

                <div>
                  <label className={labelClass}>Province</label>
                  <input
                    name="permanentProvince"
                    value={formData.permanentProvince}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Permanent Province"
                  />
                </div>

                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    name="permanentCountry"
                    value={formData.permanentCountry}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Permanent Country"
                  />
                </div>

                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input
                    name="permanentZipCode"
                    value={formData.permanentZipCode}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>
                Parent&apos;s / Guardian&apos;s Information
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-700">
                    Father&apos;s Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Father Last Name</label>
                      <input
                        name="fatherLastName"
                        value={formData.fatherLastName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Father Last Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Father First Name</label>
                      <input
                        name="fatherFirstName"
                        value={formData.fatherFirstName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Father First Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Father Middle Name</label>
                      <input
                        name="fatherMiddleName"
                        value={formData.fatherMiddleName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Father Middle Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Father Contact Number</label>
                      <input
                        name="fatherContactNumber"
                        value={formData.fatherContactNumber}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Father Contact"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-700">
                    Mother&apos;s Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Mother Last Name</label>
                      <input
                        name="motherLastName"
                        value={formData.motherLastName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Mother Last Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mother First Name</label>
                      <input
                        name="motherFirstName"
                        value={formData.motherFirstName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Mother First Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mother Middle Name</label>
                      <input
                        name="motherMiddleName"
                        value={formData.motherMiddleName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Mother Middle Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mother Contact Number</label>
                      <input
                        name="motherContactNumber"
                        value={formData.motherContactNumber}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Mother Contact"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-700">
                    Guardian&apos;s Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Guardian Last Name</label>
                      <input
                        name="guardianLastName"
                        value={formData.guardianLastName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Guardian Last Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Guardian First Name</label>
                      <input
                        name="guardianFirstName"
                        value={formData.guardianFirstName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Guardian First Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Guardian Middle Name</label>
                      <input
                        name="guardianMiddleName"
                        value={formData.guardianMiddleName}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Guardian Middle Name"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Guardian Contact Number</label>
                      <input
                        name="guardianContactNumber"
                        value={formData.guardianContactNumber}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Guardian Contact"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Learner with Disability / SNED</h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Is the child a learner with disability?
                  </label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="specialNeedsProgram"
                        value="Yes"
                        checked={formData.specialNeedsProgram === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="specialNeedsProgram"
                        value="No"
                        checked={formData.specialNeedsProgram === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Type of Disability</label>
                  <div className="grid gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 md:grid-cols-2">
                    {snedDiagnoses.map((item) => (
                      <label key={item} className={checkLabelClass}>
                        <input
                          type="checkbox"
                          checked={formData.snedDiagnosis.includes(item)}
                          onChange={() => handleArrayToggle('snedDiagnosis', item)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Manifestations</label>
                  <div className="grid gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 md:grid-cols-2">
                    {snedManifestations.map((item) => (
                      <label key={item} className={checkLabelClass}>
                        <input
                          type="checkbox"
                          checked={formData.snedManifestations.includes(item)}
                          onChange={() =>
                            handleArrayToggle('snedManifestations', item)
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Does the learner have a PWD ID?</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="pwdIdHolder"
                        value="Yes"
                        checked={formData.pwdIdHolder === 'Yes'}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="pwdIdHolder"
                        value="No"
                        checked={formData.pwdIdHolder === 'No'}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>
                For Returning Learner (Balik-Aral) and Transfer / Move In
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Last Grade Level Completed</label>
                  <input
                    name="lastGradeLevelCompleted"
                    value={formData.lastGradeLevelCompleted}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Last Grade Level Completed"
                  />
                </div>

                <div>
                  <label className={labelClass}>Last School Year Completed</label>
                  <input
                    name="lastSchoolYearCompleted"
                    value={formData.lastSchoolYearCompleted}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Last School Year Completed"
                  />
                </div>

                <div>
                  <label className={labelClass}>Last School Attended</label>
                  <input
                    name="lastSchoolAttended"
                    value={formData.lastSchoolAttended}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Last School Attended"
                  />
                </div>

                <div>
                  <label className={labelClass}>School ID</label>
                  <input
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="School ID"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>For Learners in Senior High School</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Semester</label>
                  <div className={radioWrapClass}>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="semester"
                        value="1st"
                        checked={formData.semester === '1st'}
                        onChange={handleChange}
                      />
                      1st
                    </label>
                    <label className={checkLabelClass}>
                      <input
                        type="radio"
                        name="semester"
                        value="2nd"
                        checked={formData.semester === '2nd'}
                        onChange={handleChange}
                      />
                      2nd
                    </label>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Track</label>
                  <input
                    name="track"
                    value={formData.track}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Track"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Strand / Specialization</label>
                  <input
                    name="strand"
                    value={formData.strand}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Strand"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>
                Preferred Distance Learning Modality
              </h3>

              <p className="mb-3 text-sm text-gray-600">
                If school will implement other distance learning modalities aside
                from face to face instruction, what would you prefer for your child?
                Choose all that apply:
              </p>

              <div className="grid gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 md:grid-cols-2">
                {learningModalities.map((item) => (
                  <label key={item} className={checkLabelClass}>
                    <input
                      type="checkbox"
                      checked={formData.preferredLearningModality.includes(item)}
                      onChange={() =>
                        handleArrayToggle('preferredLearningModality', item)
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Certification and Signature</h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Parent / Guardian Full Name</label>
                  <input
                    name="parentFullName"
                    value={formData.parentFullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Parent Full Name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Signature Date</label>
                  <input
                    name="signatureDate"
                    type="date"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-xl bg-blue-50/60">
                  <div className="flex items-center gap-3">
                    <input
                      id="certificationAccepted"
                      name="certificationAccepted"
                      type="checkbox"
                      checked={formData.certificationAccepted}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="certificationAccepted"
                      className="text-sm font-medium text-gray-700"
                    >
                      Certification Accepted
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push('/admin/enrollments')}
                className="w-full rounded-lg bg-gray-500 px-4 py-3 font-semibold text-white transition hover:bg-gray-600 sm:min-w-[160px] sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 font-semibold text-white transition bg-blue-700 rounded-lg hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Update Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function normalizeDateForInput(value: any) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}