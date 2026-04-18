'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

type Enrollment = Record<string, any>;

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

const learningModalities = [
  'Modular (Print)',
  'Modular (Digital)',
  'Online',
  'Radio-Based Television',
  'Educational Television',
  'Homeschooling',
  'Blended (Combination)',
];

export default function EnrollmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const printMode = searchParams.get('print') === '1';

  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

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

  useEffect(() => {
    if (printMode && enrollment) {
      setTimeout(() => {
        window.print();
      }, 400);
    }
  }, [printMode, enrollment]);

  async function fetchEnrollment() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/enrollments/${params.id}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load enrollment');
      }

      setEnrollment(data.enrollment);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to load record');
    } finally {
      setLoading(false);
    }
  }

  const parsedDiagnosis = useMemo(
    () => parseJsonArray(enrollment?.sned_diagnosis),
    [enrollment?.sned_diagnosis]
  );

  const parsedModalities = useMemo(
    () => parseJsonArray(enrollment?.learning_modalities),
    [enrollment?.learning_modalities]
  );

  if (loading) {
    return (
      <section className="min-h-screen bg-[#ececec] px-4 py-8 print:bg-white print:px-0 print:py-0">
        <div className="mx-auto max-w-[980px]">
          <div className="mx-auto w-full max-w-[900px] bg-white p-6 shadow-md print:max-w-none print:p-0 print:shadow-none">
            Loading...
          </div>
        </div>
      </section>
    );
  }

  if (!enrollment) {
    return (
      <section className="min-h-screen bg-[#ececec] px-4 py-8">
        <div className="mx-auto max-w-[980px]">
          <div className="mx-auto w-full max-w-[900px] rounded-xl bg-white p-8 shadow-md">
            Enrollment not found
          </div>
        </div>
      </section>
    );
  }

  const schoolYear = joinParts(
    [enrollment.school_year_from, enrollment.school_year_to],
    ' - '
  );

  return (
    <section className="min-h-screen bg-[#ececec] px-4 py-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-[980px]">
        {!printMode && (
          <div className="mb-4 flex flex-wrap gap-3 print:hidden">
            <button
              onClick={() => router.push('/admin/enrollments')}
              className="rounded-xl bg-gray-700 px-4 py-2 font-semibold text-white shadow transition hover:bg-gray-800"
            >
              Back
            </button>

            <button
              onClick={() => window.print()}
              className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-green-700"
            >
              Print | Download PDF
            </button>
          </div>
        )}

        <div className="space-y-6 print:space-y-0">
          <PaperShell>
            <EnrollmentFormPaper
              enrollment={enrollment}
              parsedDiagnosis={parsedDiagnosis}
              parsedModalities={parsedModalities}
              schoolYear={schoolYear}
            />
          </PaperShell>
        </div>
      </div>
    </section>
  );
}

function PaperShell({
  children,
  breakBefore = false,
}: {
  children: React.ReactNode;
  breakBefore?: boolean;
}) {
  return (
    <div
      className={[
        'mx-auto w-full max-w-[900px] bg-white p-6 shadow-md',
        'print:max-w-none print:bg-white print:p-0 print:shadow-none',
        breakBefore ? 'print:break-before-page' : '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function EnrollmentFormPaper({
  enrollment,
  parsedDiagnosis,
  parsedModalities,
  schoolYear,
}: {
  enrollment: Enrollment;
  parsedDiagnosis: string[];
  parsedModalities: string[];
  schoolYear: string;
}) {
  const schoolYearParts =
    schoolYear !== '-' ? schoolYear.replace(/\s*-\s*/g, '') : '';
  const gradeText = safeValue(enrollment.grade_level_to_enroll);
  const gradeDigits = gradeText.replace(/\D/g, '').slice(0, 2);
  const isMale = String(enrollment.sex || '').toLowerCase() === 'male';
  const isFemale = String(enrollment.sex || '').toLowerCase() === 'female';
  const isIpYes = String(enrollment.ip_community || '').toLowerCase() === 'yes';
  const isIpNo = String(enrollment.ip_community || '').toLowerCase() === 'no';
  const is4PsYes = String(enrollment.four_ps || '').toLowerCase() === 'yes';
  const is4PsNo = String(enrollment.four_ps || '').toLowerCase() === 'no';
  const sameAddressYes =
    String(enrollment.same_address || '').toLowerCase() === 'yes';
  const sameAddressNo =
    String(enrollment.same_address || '').toLowerCase() === 'no';
  const sem1 = String(enrollment.semester || '').toLowerCase() === '1st';
  const sem2 = String(enrollment.semester || '').toLowerCase() === '2nd';

  const withLrnYes = Boolean(enrollment.learner_reference_no);
  const withLrnNo = !withLrnYes;

  const balikAralYes = false;
  const balikAralNo = true;

  return (
    <div className="mx-auto w-full max-w-[850px] border border-black bg-white p-3 text-[12px] leading-tight text-black">
      <div className="mb-2 flex items-start">
        <div className="w-[70px] shrink-0 pt-0.5">
          <Image
            src="/deped.png"
            alt="DepEd Logo"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>

        <div className="flex-1 text-center">
          <div className="text-[18px] font-medium uppercase">
            Basic Education Enrollment Form
          </div>
          <div className="text-[10px] uppercase">This form is not for sale.</div>
        </div>

        <div className="w-[110px] shrink-0 text-right text-[10px]">
          <div>Revised as of 03/27/2023</div>
          <div className="mt-1 inline-block border border-black px-2 py-[1px] font-bold">
            ANNEX 1
          </div>
        </div>
      </div>

      <div className="mb-2 flex gap-3">
        <div className="min-w-[250px]">
          <div className="grid grid-cols-[95px_1fr] items-center gap-y-3">
            <div>School Year</div>
            <BoxDigits value={schoolYearParts} count={8} withHyphen hyphenAfter={4} />

            <div>Grade level to Enroll:</div>
            <div className="pl-[45px]">
              <BoxDigits value={gradeDigits} count={2} />
            </div>
          </div>
        </div>

        <div className="flex-1 border border-black p-2">
          <div className="mb-2 font-semibold">Check the appropriate box only</div>

          <div className="grid grid-cols-[1fr_auto_40px_auto_40px_1fr_auto_40px_auto_40px] items-center gap-x-2 gap-y-1">
            <div>1. With LRN?</div>
            <CheckSquare checked={withLrnYes} />
            <div className="whitespace-nowrap">Yes</div>
            <CheckSquare checked={withLrnNo} />
            <div className="whitespace-nowrap">No</div>

            <div>2. Returning (Balik-Aral)</div>
            <CheckSquare checked={balikAralYes} />
            <div className="whitespace-nowrap">Yes</div>
            <CheckSquare checked={balikAralNo} />
            <div className="whitespace-nowrap">No</div>
          </div>
        </div>
      </div>

      <div className="mb-2 border border-black px-1 py-[3px] text-[11px]">
        <strong>INSTRUCTIONS:</strong> Print legibly all information required in
        CAPITAL letters.
      </div>

      <table className="mb-3 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <th
              colSpan={4}
              className="border border-black bg-[#f3f3f3] py-[3px] font-semibold"
            >
              Learner Information
            </th>
          </tr>

          <tr>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              PSA Birth Certificate No. (if available upon registration)
            </td>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              Learner Reference No. (LRN)
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-[2px]">
              <ReadBox value={enrollment.psa_birth_certificate_no} />
            </td>
            <td colSpan={2} className="border border-black p-[2px]">
              <ReadBox value={enrollment.learner_reference_no} />
            </td>
          </tr>

          <tr>
            <td className="border border-black px-1 py-[3px]">Last Name</td>
            <td className="border border-black px-1 py-[3px]">First Name</td>
            <td className="border border-black px-1 py-[3px]">Middle Name</td>
            <td className="border border-black px-1 py-[3px]">
              Extension Name (if applicable)
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.last_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.first_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.middle_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.extension_name} />
            </td>
          </tr>

          <tr>
            <td className="border border-black px-1 py-[3px]">
              Birthdate (mm/dd/yyyy)
            </td>
            <td className="border border-black px-1 py-[3px]">
              Place of Birth (Municipality/City)
            </td>
            <td className="border border-black px-1 py-[3px]">Sex</td>
            <td className="border border-black px-1 py-[3px]">Age</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={formatDate(enrollment.birthdate)} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.birth_place} />
            </td>
            <td className="border border-black p-[2px]">
              <SelectLike
                value={
                  isMale ? 'Male' : isFemale ? 'Female' : safeValue(enrollment.sex)
                }
              />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.age} />
            </td>
          </tr>

          <tr>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              Mother Tongue
            </td>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              Belonging to any Indigenous Peoples (IP) Community/Indigenous
              Cultural Community?
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-[2px]">
              <ReadBox value={enrollment.mother_tongue} />
            </td>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-1">
                  <CheckSquare checked={isIpYes} />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <CheckSquare checked={isIpNo} />
                  <span>No</span>
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-[2px]" />
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              Specify if Yes
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-black p-[2px]" />
            <td colSpan={2} className="border border-black p-[2px]">
              <ReadBox value={enrollment.ip_details} />
            </td>
          </tr>

          <tr>
            <td colSpan={4} className="border border-black px-1 py-[3px]">
              Is your family a beneficiary of 4Ps?{' '}
              <span className="ml-2 inline-flex items-center gap-1">
                <CheckSquare checked={is4PsYes} /> Yes
              </span>
              <span className="ml-4 inline-flex items-center gap-1">
                <CheckSquare checked={is4PsNo} /> No
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black p-[2px]">
              <ReadBox
                value={enrollment.four_ps_id}
                placeholder="If Yes, write the 4Ps Household ID Number"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-3 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <td
              colSpan={4}
              className="border border-black px-1 py-[3px] text-left font-normal"
            >
              Is the child a Learner with Disability?
              <span className="ml-4 inline-flex items-center gap-1">
                <CheckSquare
                  checked={
                    String(enrollment.special_needs || '').toLowerCase() === 'yes'
                  }
                />
                Yes
              </span>
              <span className="ml-4 inline-flex items-center gap-1">
                <CheckSquare
                  checked={
                    String(enrollment.special_needs || '').toLowerCase() !== 'yes'
                  }
                />
                No
              </span>
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black px-1 py-[3px]">
              If Yes, specify the type of disability:
            </td>
          </tr>
          {[
            snedDiagnoses.slice(0, 4),
            snedDiagnoses.slice(4, 8),
            snedDiagnoses.slice(8, 12),
          ].map((row, idx) => (
            <tr key={idx}>
              {row.map((item) => (
                <td key={item} className="border border-black px-1 py-[4px]">
                  <span className="inline-flex items-center gap-1">
                    <CheckSquare checked={parsedDiagnosis.includes(item)} />
                    {item}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table className="mb-3 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <td
              colSpan={4}
              className="border border-black px-1 py-[3px] text-left font-normal"
            >
              Current Address
            </td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">House No,</td>
            <td className="border border-black px-1 py-[3px]">
              Sitio/Street Name
            </td>
            <td className="border border-black px-1 py-[3px]">Barangay</td>
            <td className="border border-black px-1 py-[3px]">
              Municipality/City
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_house_no} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_street} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_barangay} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_city} />
            </td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">Province</td>
            <td className="border border-black px-1 py-[3px]">Country</td>
            <td className="border border-black px-1 py-[3px]">Zip Code</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_province} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_country} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.current_zip} />
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black px-1 py-[3px]">
              Same with your Current Address?{' '}
              <span className="ml-2 inline-flex items-center gap-1">
                <CheckSquare checked={sameAddressYes} /> Yes
              </span>
              <span className="ml-4 inline-flex items-center gap-1">
                <CheckSquare checked={sameAddressNo} /> No
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-3 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <td
              colSpan={4}
              className="border border-black px-1 py-[3px] text-left font-normal"
            >
              Permanent Address
            </td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">House No,</td>
            <td className="border border-black px-1 py-[3px]">
              Sitio/Street Name
            </td>
            <td className="border border-black px-1 py-[3px]">Barangay</td>
            <td className="border border-black px-1 py-[3px]">
              Municipality/City
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_house_no} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_street} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_barangay} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_city} />
            </td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">Province</td>
            <td className="border border-black px-1 py-[3px]">Country</td>
            <td className="border border-black px-1 py-[3px]">Zip Code</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_province} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_country} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.permanent_zip} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-3 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <th
              colSpan={4}
              className="border border-black bg-[#f3f3f3] py-[3px] font-semibold"
            >
              Parent&apos;s/Guardian&apos;s Information
            </th>
          </tr>

          <tr>
            <td className="border border-black px-1 py-[3px]">
              Father&apos;s Last Name
            </td>
            <td className="border border-black px-1 py-[3px]">First Name</td>
            <td className="border border-black px-1 py-[3px]">Middle Name</td>
            <td className="border border-black px-1 py-[3px]">Contact Number</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.father_last_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.father_first_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.father_middle_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.father_contact} />
            </td>
          </tr>

          <tr>
            <td className="border border-black px-1 py-[3px]">
              Mother&apos;s Maiden Last Name
            </td>
            <td className="border border-black px-1 py-[3px]">First Name</td>
            <td className="border border-black px-1 py-[3px]">Middle Name</td>
            <td className="border border-black px-1 py-[3px]">Contact Number</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.mother_last_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.mother_first_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.mother_middle_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.mother_contact} />
            </td>
          </tr>

          <tr>
            <td className="border border-black px-1 py-[3px]">
              Legal Guardian&apos;s Last Name
            </td>
            <td className="border border-black px-1 py-[3px]">First Name</td>
            <td className="border border-black px-1 py-[3px]">Middle Name</td>
            <td className="border border-black px-1 py-[3px]">Contact Number</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.guardian_last_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.guardian_first_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.guardian_middle_name} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.guardian_contact} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-5 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <th
              colSpan={4}
              className="border border-black bg-[#f3f3f3] py-[3px] font-semibold"
            >
              For Returning Learner (Balik-Aral) and Those Who will Transfer/Move
              In
            </th>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">
              Last Grade Level Completed
            </td>
            <td className="border border-black px-1 py-[3px]">
              Last School Year Completed
            </td>
            <td className="border border-black px-1 py-[3px]">
              Last School Attended
            </td>
            <td className="border border-black px-1 py-[3px]">School ID</td>
          </tr>
          <tr>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.last_grade_completed} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.last_school_year} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.last_school} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.school_id} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="mb-5 w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <th
              colSpan={4}
              className="border border-black bg-[#f3f3f3] py-[3px] font-semibold"
            >
              For Learners in Senior High School
            </th>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[3px]">Semester</td>
            <td colSpan={2} className="border border-black px-1 py-[3px]">
              Track
            </td>
            <td className="border border-black px-1 py-[3px]">Strand</td>
          </tr>
          <tr>
            <td className="border border-black px-1 py-[6px]">
              <span className="inline-flex items-center gap-1">
                <CheckSquare checked={sem1} /> 1st
              </span>
              <span className="ml-3 inline-flex items-center gap-1">
                <CheckSquare checked={sem2} /> 2nd
              </span>
            </td>
            <td colSpan={2} className="border border-black p-[2px]">
              <ReadBox value={formatTrack(enrollment.track)} />
            </td>
            <td className="border border-black p-[2px]">
              <ReadBox value={enrollment.strand} />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse text-[11px]">
        <tbody>
          <tr>
            <th
              colSpan={4}
              className="border border-black bg-[#f3f3f3] py-[3px] font-semibold"
            >
              Preferred Distance Learning Modality
            </th>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black px-1 py-[3px]">
              If school will implement other distance learning modalities aside from
              face to face instruction, what would you prefer for your child?
              Choose all that apply:
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border border-black px-1 py-[6px]">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {learningModalities.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1">
                    <CheckSquare checked={parsedModalities.includes(item)} />
                    {item}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 text-[11px] leading-relaxed">
        I hereby certify that the above information given are true and correct of
        the best of my knowledge and i allow the department of education to use my
        child&apos;s details to create and/or update his/her learner profile in the
        Learner Information System. The information herein shall be treated as
        confidential in compliance with the Data Privacy Act of 2012.
      </div>

      <div className="mt-6">
        <div className="mb-1 text-right text-[11px]">
          Signature Over Printed Name of Parent/Guardian:
        </div>
        <div className="ml-auto h-[82px] w-[50%] border border-black bg-white px-3">
          <div className="flex h-full items-end justify-center pb-2 text-[14px]">
            {safeValue(enrollment.parent_full_name)}
          </div>
        </div>

        <div className="mt-2 text-right text-[11px]">Date:</div>
        <div className="ml-auto flex h-[40px] w-[30%] items-center justify-center border border-black text-[14px]">
          {formatDate(enrollment.signature_date)}
        </div>
      </div>
    </div>
  );
}

function ConfirmationSlipPaper({
  enrollment,
  schoolYear,
  learnerFullName,
  parentOrGuardianName,
}: {
  enrollment: Enrollment;
  schoolYear: string;
  learnerFullName: string;
  parentOrGuardianName: string;
}) {
  const confirmationYear = schoolYear && schoolYear !== '-' ? schoolYear : '';
  const [yearFrom = '', yearTo = ''] = confirmationYear.split(' - ');

  return (
    <div className="mx-auto w-full max-w-[850px] border border-black bg-white p-4 text-[12px] text-black">
      <div className="mx-auto max-w-[520px] border border-black bg-[#f5f5f5] p-4">
        <div className="mb-5 flex items-start gap-4">
          <div className="mt-2 shrink-0">
            <Image
              src="/deped.png"
              alt="DepEd Logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
              priority
            />
          </div>

          <div className="flex-1 text-[12px] leading-[1.35]">
            <div>Department of Education</div>
            <div>
              Region:
              <span className="inline-block min-w-[140px] align-middle border-b border-black" />
            </div>
            <div>
              Division:
              <span className="inline-block min-w-[120px] align-middle border-b border-black" />
            </div>
            <div>
              School ID:
              <span className="inline-block min-w-[110px] align-middle border-b border-black" />
            </div>
            <div>
              School Name:
              <span className="inline-block min-w-[180px] align-middle border-b border-black" />
            </div>
          </div>
        </div>

        <div className="mb-5 text-center text-[18px] font-bold uppercase">
          Confirmation Slip
        </div>

        <div className="space-y-1 text-[12px]">
          <SlipRow label="Name of Learner:" value={learnerFullName} />
          <SlipRowBoxes
            label="Learner's Reference No:"
            value={enrollment.learner_reference_no}
            boxes={12}
          />
          <SlipRow
            label="Grade Level to Enroll:"
            value={enrollment.grade_level_to_enroll}
          />
          <SlipRow
            label={"Parent's or Legal Guardian's Name:"}
            value={parentOrGuardianName}
          />
          <SlipRow
            label="Contact No.:"
            value={
              enrollment.guardian_contact ||
              enrollment.mother_contact ||
              enrollment.father_contact ||
              '-'
            }
          />
        </div>

        <div className="mt-8 text-[12px]">
          <div className="mb-2">
            Do you confirm the enrollment of the learner in this school for SY
          </div>

          <div className="mb-2 flex items-center gap-2">
            <YearBox value={yearFrom} />
            <span>-</span>
            <YearBox value={yearTo} />
            <span className="ml-2">?</span>
            <label className="ml-4 inline-flex items-center gap-1">
              <span className="inline-block h-[12px] w-[12px] border border-black" />
              YES
            </label>
            <label className="inline-flex items-center gap-1">
              <span className="inline-block h-[12px] w-[12px] border border-black" />
              NO
            </label>
          </div>
        </div>

        <div className="mt-10 text-center text-[12px]">
          <div className="mx-auto max-w-[420px] border-t border-black pt-1">
            Signature over Printed Name of Parent/Legal Guardian
          </div>

          <div className="mx-auto mt-4 max-w-[140px] border-t border-black pt-1">
            Date
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckSquare({ checked }: { checked: boolean }) {
  return (
    <span className="inline-flex h-[13px] w-[13px] items-center justify-center border border-black text-[10px] leading-none">
      {checked ? '✓' : ''}
    </span>
  );
}

function BoxDigits({
  value,
  count,
  withHyphen = false,
  hyphenAfter = 0,
}: {
  value: string;
  count: number;
  withHyphen?: boolean;
  hyphenAfter?: number;
}) {
  const chars = String(value || '')
    .replace(/\s+/g, '')
    .slice(0, count)
    .split('');

  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="contents">
          {withHyphen && hyphenAfter > 0 && index === hyphenAfter && (
            <span className="mx-1">-</span>
          )}
          <div className="flex h-[18px] w-[18px] items-center justify-center border border-black text-[11px]">
            {chars[index] || ''}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReadBox({
  value,
  placeholder,
}: {
  value: any;
  placeholder?: string;
}) {
  const safe = safeValue(value);
  return (
    <div className="min-h-[24px] border border-black px-1 py-[4px] text-[12px]">
      {safe === '-' && placeholder ? (
        <span className="text-gray-500">{placeholder}</span>
      ) : (
        safe
      )}
    </div>
  );
}

function SelectLike({ value }: { value: any }) {
  return (
    <div className="relative min-h-[24px] border border-black px-1 py-[4px] text-[12px]">
      {safeValue(value)}
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[10px]">
        ▼
      </span>
    </div>
  );
}

function SlipRow({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="grid grid-cols-[145px_1fr] items-center gap-2">
      <div>{label}</div>
      <div className="min-h-[18px] border border-[#bfbfbf] bg-white px-2 py-[1px]">
        {safeValue(value)}
      </div>
    </div>
  );
}

function SlipRowBoxes({
  label,
  value,
  boxes,
}: {
  label: string;
  value: any;
  boxes: number;
}) {
  const chars = String(value || '')
    .replace(/\s+/g, '')
    .slice(0, boxes)
    .split('');

  return (
    <div className="grid grid-cols-[145px_1fr] items-center gap-2">
      <div>{label}</div>
      <div className="flex flex-wrap gap-0">
        {Array.from({ length: boxes }).map((_, index) => (
          <div
            key={index}
            className="flex h-[18px] w-[16px] items-center justify-center border border-[#bfbfbf] bg-white text-[11px]"
          >
            {chars[index] || ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function YearBox({ value }: { value: string }) {
  return (
    <div className="min-w-[54px] border border-[#bfbfbf] bg-white px-3 py-[2px] text-center">
      {value || ''}
    </div>
  );
}

function parseJsonArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function safeValue(value: any) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function joinParts(parts: any[], separator = ', ') {
  const filtered = parts
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);

  return filtered.length ? filtered.join(separator) : '-';
}

function buildFullName(
  last?: string,
  first?: string,
  middle?: string,
  extension?: string
) {
  const left = [last].filter(Boolean).join('');
  const right = [first, middle, extension].filter(Boolean).join(' ');
  const combined = [left, right].filter(Boolean).join(', ');
  return combined || '-';
}

function formatDate(value: any) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return safeValue(value);

  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatTrack(value: any) {
  const safe = String(value || '').trim().toUpperCase();

  if (safe === 'TECHNICAL-PROFESSIONAL CLUSTER') {
    return 'TECHNICAL-PROFESSIONAL TRACK';
  }

  if (safe === 'ACADEMIC CLUSTER') {
    return 'ACADEMIC TRACK';
  }

  return safeValue(value);
}