'use client';

import { useEffect, useMemo, useState } from 'react';

type FormData = {
  schoolYearFrom: string;
  schoolYearTo: string;
  learnerReferenceNo: string;

  gradeLevelToEnroll: string;
  kinderProgram: string;

  psaBirthCertificateNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  extensionName: string;
  birthdate: string;
  age: string;
  sex: string;
  religion: string;
  birthPlace: string;
  birthPlaceOther: string;
  motherTongue: string;

  ipCommunity: string;
  ipDetails: string;
  fourPs: string;
  fourPsId: string;

  currentHouseNo: string;
  currentStreetName: string;
  currentBarangay: string;
  currentMunicipalityCity: string;
  currentMunicipalityCityOther: string;
  currentProvince: string;
  currentProvinceOther: string;
  currentCountry: string;
  currentZipCode: string;

  sameAddress: string;

  permanentHouseNo: string;
  permanentStreetName: string;
  permanentBarangay: string;
  permanentMunicipalityCity: string;
  permanentMunicipalityCityOther: string;
  permanentProvince: string;
  permanentProvinceOther: string;
  permanentCountry: string;
  permanentZipCode: string;

  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherContactNumber: string;

  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherContactNumber: string;

  guardianLastName: string;
  guardianFirstName: string;
  guardianMiddleName: string;
  guardianContactNumber: string;

  specialNeedsProgram: string;
  snedDiagnosis: string[];
  snedManifestations: string[];
  pwdIdHolder: string;

  lastGradeLevelCompleted: string;
  lastSchoolYearCompleted: string;
  lastSchoolAttended: string;
  schoolId: string;

  semester: string;
  track: string;
  strand: string;

  preferredLearningModality: string[];

  parentFullName: string;
  certificationAccepted: boolean;
  signatureDate: string;
};

const municipalityOptions = [
  'ALAMINOS',
  'BIÑAN',
  'CABUYAO',
  'CALAMBA',
  'CALOOCAN',
  'CARMONA',
  'GENERAL MARIANO ALVAREZ',
  'LAS PIÑAS',
  'MAKATI',
  'MALABON',
  'MANDALUYONG',
  'MANILA',
  'MARIKINA',
  'MUNTINLUPA',
  'NAVOTAS',
  'PARAÑAQUE',
  'PASAY',
  'PASIG',
  'PATEROS',
  'QUEZON CITY',
  'SAN JUAN',
  'SAN PABLO',
  'SAN PEDRO',
  'SANTA ROSA',
  'SILANG',
  'TAGAYTAY',
  'TAGUIG',
  'VALENZUELA',
  'OTHERS',
];

const provinceOptions = [
  'ABRA',
  'AGUSAN DEL NORTE',
  'AGUSAN DEL SUR',
  'AKLAN',
  'ALBAY',
  'ANTIQUE',
  'APAYAO',
  'AURORA',
  'BASILAN',
  'BATAAN',
  'BATANES',
  'BATANGAS',
  'BENGUET',
  'BILIRAN',
  'BOHOL',
  'BUKIDNON',
  'BULACAN',
  'CAGAYAN',
  'CAMARINES NORTE',
  'CAMARINES SUR',
  'CAMIGUIN',
  'CAPIZ',
  'CATANDUANES',
  'CAVITE',
  'CEBU',
  'COTABATO',
  'DAVAO DE ORO',
  'DAVAO DEL NORTE',
  'DAVAO DEL SUR',
  'DAVAO OCCIDENTAL',
  'DAVAO ORIENTAL',
  'DINAGAT ISLANDS',
  'EASTERN SAMAR',
  'GUIMARAS',
  'IFUGAO',
  'ILOCOS NORTE',
  'ILOCOS SUR',
  'ILOILO',
  'ISABELA',
  'KALINGA',
  'LA UNION',
  'LAGUNA',
  'LANAO DEL NORTE',
  'LANAO DEL SUR',
  'LEYTE',
  'MAGUINDANAO DEL NORTE',
  'MAGUINDANAO DEL SUR',
  'MARINDUQUE',
  'MASBATE',
  'MISAMIS OCCIDENTAL',
  'MISAMIS ORIENTAL',
  'MOUNTAIN PROVINCE',
  'NEGROS OCCIDENTAL',
  'NEGROS ORIENTAL',
  'NORTHERN SAMAR',
  'NUEVA ECIJA',
  'NUEVA VIZCAYA',
  'OCCIDENTAL MINDORO',
  'ORIENTAL MINDORO',
  'PALAWAN',
  'PAMPANGA',
  'PANGASINAN',
  'QUEZON',
  'QUIRINO',
  'RIZAL',
  'ROMBLON',
  'SAMAR',
  'SARANGANI',
  'SIQUIJOR',
  'SORSOGON',
  'SOUTH COTABATO',
  'SOUTHERN LEYTE',
  'SULTAN KUDARAT',
  'SULU',
  'SURIGAO DEL NORTE',
  'SURIGAO DEL SUR',
  'TARLAC',
  'TAWI-TAWI',
  'ZAMBALES',
  'ZAMBOANGA DEL NORTE',
  'ZAMBOANGA DEL SUR',
  'ZAMBOANGA SIBUGAY',
  'METRO MANILA',
  'OTHERS',
];

const countryOptions = ['PHILIPPINES', 'USA', 'CANADA', 'AUSTRALIA'];

const religionOptions = [
  'ROMAN CATHOLIC',
  'CHRISTIAN',
  'IGLESIA NI CRISTO',
  'ISLAM',
  'BUDDHISM',
  'HINDUISM',
  'SEVENTH-DAY ADVENTIST',
  'JEHOVAH’S WITNESSES',
  'BORN AGAIN',
  'PROTESTANT',
  'OTHERS',
];

const motherTongueOptions = [
  'FILIPINO',
  'ENGLISH',
  'TAGALOG',
  'CEBUANO',
  'ILOCANO',
  'HILIGAYNON',
  'BICOLANO',
  'WARAY',
  'KAPAMPANGAN',
  'PANGASINAN',
  'MARANAO',
  'MAGUINDANAO',
  'TAUSUG',
  'CHAVACANO',
  'OTHERS',
];

const gradeOptions = [
  'NURSERY',
  'PRE-KINDER',
  'KINDER',
  'GRADE 1',
  'GRADE 2',
  'GRADE 3',
  'GRADE 4',
  'GRADE 5',
  'GRADE 6',
  'GRADE 7',
  'GRADE 8',
  'GRADE 9',
  'GRADE 10',
  'GRADE 11',
  'GRADE 12',
  '1ST YEAR COLLEGE',
  '2ND YEAR COLLEGE',
  '3RD YEAR COLLEGE',
  '4TH YEAR COLLEGE',
];

const clusterOptions: Record<string, string[]> = {
  'ACADEMIC TRACK': ['STEM', 'ABM', 'HUMSS', 'GAS'],
  'TECHNICAL-PROFESSIONAL TRACK': [
    'ICT SUPPORT AND COMPUTER PROGRAMMING',
    'AUTOMOTIVE AND SMALL ENGINE TECHNOLOGIES',
    'HOSPITALITY AND TOURISM',
  ],
};

const learningModalities = [
  'Blended (Combination)',
  'Homeschooling',
  'Modular (Print)',
  'Radio-Based Television',
  'Educational Television',
  'Modular (Digital)',
  'Online',
];

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

function getCurrentSchoolYear() {
  const year = new Date().getFullYear();
  return {
    from: String(year),
    to: String(year + 1),
  };
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function calculateAge(birthdate: string) {
  if (!birthdate) return '';

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 0 ? String(age) : '';
}

export default function InquiryForm() {
  const currentSchoolYear = getCurrentSchoolYear();

  const [formData, setFormData] = useState<FormData>({
    schoolYearFrom: currentSchoolYear.from,
    schoolYearTo: currentSchoolYear.to,
    learnerReferenceNo: '',

    gradeLevelToEnroll: '',
    kinderProgram: '',

    psaBirthCertificateNo: '',
    lastName: '',
    firstName: '',
    middleName: '',
    extensionName: '',
    birthdate: '',
    age: '',
    sex: '',
    religion: '',
    birthPlace: '',
    birthPlaceOther: '',
    motherTongue: '',

    ipCommunity: '',
    ipDetails: '',
    fourPs: '',
    fourPsId: '',

    currentHouseNo: '',
    currentStreetName: '',
    currentBarangay: '',
    currentMunicipalityCity: '',
    currentMunicipalityCityOther: '',
    currentProvince: '',
    currentProvinceOther: '',
    currentCountry: 'PHILIPPINES',
    currentZipCode: '',

    sameAddress: 'Yes',

    permanentHouseNo: '',
    permanentStreetName: '',
    permanentBarangay: '',
    permanentMunicipalityCity: '',
    permanentMunicipalityCityOther: '',
    permanentProvince: '',
    permanentProvinceOther: '',
    permanentCountry: 'PHILIPPINES',
    permanentZipCode: '',

    fatherLastName: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherContactNumber: '',

    motherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherContactNumber: '',

    guardianLastName: '',
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianContactNumber: '',

    specialNeedsProgram: '',
    snedDiagnosis: [],
    snedManifestations: [],
    pwdIdHolder: '',

    lastGradeLevelCompleted: '',
    lastSchoolYearCompleted: '',
    lastSchoolAttended: '',
    schoolId: '',

    semester: '',
    track: '',
    strand: '',

    preferredLearningModality: [],

    parentFullName: '',
    certificationAccepted: false,
    signatureDate: getTodayDate(),
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      age: calculateAge(prev.birthdate),
      signatureDate: getTodayDate(),
    }));
  }, [formData.birthdate]);

  const uppercaseFields = new Set([
    'learnerReferenceNo',
    'psaBirthCertificateNo',
    'lastName',
    'firstName',
    'middleName',
    'extensionName',
    'birthPlaceOther',
    'currentHouseNo',
    'currentStreetName',
    'currentBarangay',
    'currentMunicipalityCity',
    'currentMunicipalityCityOther',
    'currentProvince',
    'currentProvinceOther',
    'currentCountry',
    'currentZipCode',
    'permanentHouseNo',
    'permanentStreetName',
    'permanentBarangay',
    'permanentMunicipalityCity',
    'permanentMunicipalityCityOther',
    'permanentProvince',
    'permanentProvinceOther',
    'permanentCountry',
    'permanentZipCode',
    'fatherLastName',
    'fatherFirstName',
    'fatherMiddleName',
    'motherLastName',
    'motherFirstName',
    'motherMiddleName',
    'guardianLastName',
    'guardianFirstName',
    'guardianMiddleName',
    'ipDetails',
    'fourPsId',
    'lastGradeLevelCompleted',
    'lastSchoolYearCompleted',
    'lastSchoolAttended',
    'schoolId',
    'track',
    'strand',
    'parentFullName',
  ]);

  const strands = useMemo(() => clusterOptions[formData.track] || [], [formData.track]);

  const isSeniorHigh =
    formData.gradeLevelToEnroll === 'GRADE 11' ||
    formData.gradeLevelToEnroll === 'GRADE 12';

  const isKinder = formData.gradeLevelToEnroll === 'KINDER';

  const inputClass =
    'w-full rounded-lg border border-gray-400 bg-white px-4 py-3 outline-none focus:border-blue-700';
  const sectionTitleClass = 'mb-4 text-xl font-bold text-blue-800';
  const cardClass = 'rounded-xl bg-white p-6 shadow-xl sm:p-8';
  const checkboxLabelClass = 'flex items-center gap-2 text-sm text-gray-800';

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value } = target;

    const nextValue = uppercaseFields.has(name) ? value.toUpperCase() : value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : nextValue,
      };

      if (name === 'track') {
        updated.strand = '';
      }

      if (name === 'sameAddress' && value === 'Yes') {
        updated.permanentHouseNo = updated.currentHouseNo;
        updated.permanentStreetName = updated.currentStreetName;
        updated.permanentBarangay = updated.currentBarangay;
        updated.permanentMunicipalityCity = updated.currentMunicipalityCity;
        updated.permanentMunicipalityCityOther = updated.currentMunicipalityCityOther;
        updated.permanentProvince = updated.currentProvince;
        updated.permanentProvinceOther = updated.currentProvinceOther;
        updated.permanentCountry = updated.currentCountry;
        updated.permanentZipCode = updated.currentZipCode;
      }

      if (
        prev.sameAddress === 'Yes' &&
        [
          'currentHouseNo',
          'currentStreetName',
          'currentBarangay',
          'currentMunicipalityCity',
          'currentMunicipalityCityOther',
          'currentProvince',
          'currentProvinceOther',
          'currentCountry',
          'currentZipCode',
        ].includes(name)
      ) {
        updated.permanentHouseNo =
          name === 'currentHouseNo' ? nextValue : updated.currentHouseNo;
        updated.permanentStreetName =
          name === 'currentStreetName' ? nextValue : updated.currentStreetName;
        updated.permanentBarangay =
          name === 'currentBarangay' ? nextValue : updated.currentBarangay;
        updated.permanentMunicipalityCity =
          name === 'currentMunicipalityCity'
            ? nextValue
            : updated.currentMunicipalityCity;
        updated.permanentMunicipalityCityOther =
          name === 'currentMunicipalityCityOther'
            ? nextValue
            : updated.currentMunicipalityCityOther;
        updated.permanentProvince =
          name === 'currentProvince' ? nextValue : updated.permanentProvince;
        updated.permanentProvinceOther =
          name === 'currentProvinceOther'
            ? nextValue
            : updated.permanentProvinceOther;
        updated.permanentCountry =
          name === 'currentCountry' ? nextValue : updated.currentCountry;
        updated.permanentZipCode =
          name === 'currentZipCode' ? nextValue : updated.currentZipCode;
      }

      return updated;
    });
  }

  function toggleArrayValue(
    key: 'preferredLearningModality' | 'snedDiagnosis' | 'snedManifestations',
    value: string
  ) {
    setFormData((prev) => {
      const list = prev[key];
      const nextList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

      return {
        ...prev,
        [key]: nextList,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ✅ NEW: Require LRN
if (!formData.learnerReferenceNo) {
  alert('Learner Reference Number (LRN) is required.');
  return;
}

// existing validation
if (!formData.certificationAccepted) {
  alert('You must acknowledge the certification statement to proceed. Please check the acknowledgment box to confirm that the information provided is true and that you consent to data processing in accordance with the Data Privacy Act.');
  return;
}

    try {
      const finalDataBase =
        formData.sameAddress === 'Yes'
          ? {
              ...formData,
              permanentHouseNo: formData.currentHouseNo,
              permanentStreetName: formData.currentStreetName,
              permanentBarangay: formData.currentBarangay,
              permanentMunicipalityCity: formData.currentMunicipalityCity,
              permanentMunicipalityCityOther: formData.currentMunicipalityCityOther,
              permanentProvince: formData.currentProvince,
              permanentProvinceOther: formData.currentProvinceOther,
              permanentCountry: formData.currentCountry,
              permanentZipCode: formData.currentZipCode,
            }
          : formData;

      const finalData = {
        ...finalDataBase,
        birthPlace:
          finalDataBase.birthPlace === 'OTHERS'
            ? finalDataBase.birthPlaceOther
            : finalDataBase.birthPlace,
        currentMunicipalityCity:
          finalDataBase.currentMunicipalityCity === 'OTHERS'
            ? finalDataBase.currentMunicipalityCityOther
            : finalDataBase.currentMunicipalityCity,
        currentProvince:
          finalDataBase.currentProvince === 'OTHERS'
            ? finalDataBase.currentProvinceOther
            : finalDataBase.currentProvince,
        permanentMunicipalityCity:
          finalDataBase.permanentMunicipalityCity === 'OTHERS'
            ? finalDataBase.permanentMunicipalityCityOther
            : finalDataBase.permanentMunicipalityCity,
        permanentProvince:
          finalDataBase.permanentProvince === 'OTHERS'
            ? finalDataBase.permanentProvinceOther
            : finalDataBase.permanentProvince,
      };

      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to save');
      }

      alert(data.message || 'Enrollment saved successfully.');
    } catch (error) {
      console.error('SUBMIT ERROR:', error);
      alert(error instanceof Error ? error.message : 'Error saving data');
    }
  }

  return (
    <section className={cardClass}>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-blue-800">
          BASIC EDUCATION ENROLLMENT FORM
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <h3 className={sectionTitleClass}> School Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">School Year</label>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
                <input
                  name="schoolYearFrom"
                  value={formData.schoolYearFrom}
                  onChange={handleChange}
                  className={inputClass}
                  readOnly
                />
                <div className="flex items-center justify-center font-bold">-</div>
                <input
                  name="schoolYearTo"
                  value={formData.schoolYearTo}
                  onChange={handleChange}
                  className={inputClass}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Learner Reference No. (LRN)
              </label>
             <input
                name="learnerReferenceNo"
                value={formData.learnerReferenceNo}
                onChange={handleChange}
                className={inputClass}
                placeholder="Learner Reference No."
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Grade Level to Enroll
              </label>
              <select
                name="gradeLevelToEnroll"
                value={formData.gradeLevelToEnroll}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Grade Level</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {isKinder && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Early Learning Program
                </label>
                <input
                  name="kinderProgram"
                  value={formData.kinderProgram}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="If attended, please specify"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className={sectionTitleClass}> Learner&apos;s Personal Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="psaBirthCertificateNo"
              value={formData.psaBirthCertificateNo}
              onChange={handleChange}
              className={inputClass}
              placeholder="PSA Birth Certificate No. (if available)"
            />
            <div />

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Last Name"
              required
            />
            <div>
              <label className="block mb-1 text-sm font-medium">
                Birth Date
              </label>
              <input
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Name"
              required
            />
            <input
              name="age"
              value={formData.age}
              readOnly
              className={inputClass}
              placeholder="Age"
            />

            <input
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Middle Name"
              required
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              name="extensionName"
              value={formData.extensionName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Extension Name e.g. Jr., III"
            />
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Religion</option>
              {religionOptions.map((religion) => (
                <option key={religion} value={religion}>
                  {religion}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <select
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Birthplace Province</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              {formData.birthPlace === 'OTHERS' && (
                <input
                  name="birthPlaceOther"
                  value={formData.birthPlaceOther}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Type birthplace"
                />
              )}
            </div>

            <select
              name="motherTongue"
              value={formData.motherTongue}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Mother Tongue</option>
              {motherTongueOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Belonging to any Indigenous Peoples (IP) Community / Indigenous Cultural Community?
              </p>
              <div className="flex gap-4">
                <label className={checkboxLabelClass}>
                  <input
                    type="radio"
                    name="ipCommunity"
                    value="Yes"
                    checked={formData.ipCommunity === 'Yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className={checkboxLabelClass}>
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

            <input
              name="ipDetails"
              value={formData.ipDetails}
              onChange={handleChange}
              className={inputClass}
              placeholder="If yes, please specify"
            />

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Is your family a beneficiary of 4Ps?
              </p>
              <div className="flex gap-4">
                <label className={checkboxLabelClass}>
                  <input
                    type="radio"
                    name="fourPs"
                    value="Yes"
                    checked={formData.fourPs === 'Yes'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label className={checkboxLabelClass}>
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

            <input
              name="fourPsId"
              value={formData.fourPsId}
              onChange={handleChange}
              className={inputClass}
              placeholder="If yes, write the 4Ps Household ID Number"
            />
          </div>
        </div>

        <div>
          <h3 className={sectionTitleClass}> Address Information</h3>

          <h4 className="mb-3 text-lg font-semibold text-gray-700">Current Address</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="currentHouseNo"
              value={formData.currentHouseNo}
              onChange={handleChange}
              className={inputClass}
              placeholder="House No."
            />
            <input
              name="currentStreetName"
              value={formData.currentStreetName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Sitio / Street Name"
            />
            <input
              name="currentBarangay"
              value={formData.currentBarangay}
              onChange={handleChange}
              className={inputClass}
              placeholder="Barangay"
            />
            <div className="space-y-2">
              <select
                name="currentMunicipalityCity"
                value={formData.currentMunicipalityCity}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Municipality / City</option>
                {municipalityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {formData.currentMunicipalityCity === 'OTHERS' && (
                <input
                  name="currentMunicipalityCityOther"
                  value={formData.currentMunicipalityCityOther}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Type current municipality / city"
                />
              )}
            </div>

            <div className="space-y-2">
              <select
                name="currentProvince"
                value={formData.currentProvince}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Province</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              {formData.currentProvince === 'OTHERS' && (
                <input
                  name="currentProvinceOther"
                  value={formData.currentProvinceOther}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Type current province"
                />
              )}
            </div>

            <select
              name="currentCountry"
              value={formData.currentCountry}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Country</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <input
              name="currentZipCode"
              value={formData.currentZipCode}
              onChange={handleChange}
              className={inputClass}
              placeholder="Zip Code"
            />
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-900">
              Same with your Current Address?
            </p>
            <div className="flex gap-4">
              <label className={checkboxLabelClass}>
                <input
                  type="radio"
                  name="sameAddress"
                  value="Yes"
                  checked={formData.sameAddress === 'Yes'}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className={checkboxLabelClass}>
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

          {formData.sameAddress === 'No' && (
            <>
              <h4 className="mt-6 mb-3 text-lg font-semibold text-gray-700">
                Permanent Address
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="permanentHouseNo"
                  value={formData.permanentHouseNo}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="House No."
                />
                <input
                  name="permanentStreetName"
                  value={formData.permanentStreetName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Sitio / Street Name"
                />
                <input
                  name="permanentBarangay"
                  value={formData.permanentBarangay}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Barangay"
                />
                <div className="space-y-2">
                  <select
                    name="permanentMunicipalityCity"
                    value={formData.permanentMunicipalityCity}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Municipality / City</option>
                    {municipalityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>

                  {formData.permanentMunicipalityCity === 'OTHERS' && (
                    <input
                      name="permanentMunicipalityCityOther"
                      value={formData.permanentMunicipalityCityOther}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Type permanent municipality / city"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <select
                    name="permanentProvince"
                    value={formData.permanentProvince}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select Province</option>
                    {provinceOptions.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>

                  {formData.permanentProvince === 'OTHERS' && (
                    <input
                      name="permanentProvinceOther"
                      value={formData.permanentProvinceOther}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Type permanent province"
                    />
                  )}
                </div>

                <select
                  name="permanentCountry"
                  value={formData.permanentCountry}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <input
                  name="permanentZipCode"
                  value={formData.permanentZipCode}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Zip Code"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className={sectionTitleClass}> Parent&apos;s / Guardian&apos;s Information</h3>

          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-700">
                Father&apos;s Name
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="fatherLastName"
                  value={formData.fatherLastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last Name"
                />
                <input
                  name="fatherFirstName"
                  value={formData.fatherFirstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First Name"
                />
                <input
                  name="fatherMiddleName"
                  value={formData.fatherMiddleName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Middle Name"
                />
                <input
                  name="fatherContactNumber"
                  value={formData.fatherContactNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contact Number"
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-700">
                Mother&apos;s Maiden Name
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="motherLastName"
                  value={formData.motherLastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last Name"
                />
                <input
                  name="motherFirstName"
                  value={formData.motherFirstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First Name"
                />
                <input
                  name="motherMiddleName"
                  value={formData.motherMiddleName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Middle Name"
                />
                <input
                  name="motherContactNumber"
                  value={formData.motherContactNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contact Number"
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-700">
                Legal Guardian&apos;s Name
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="guardianLastName"
                  value={formData.guardianLastName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last Name"
                />
                <input
                  name="guardianFirstName"
                  value={formData.guardianFirstName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First Name"
                />
                <input
                  name="guardianMiddleName"
                  value={formData.guardianMiddleName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Middle Name"
                />
                <input
                  name="guardianContactNumber"
                  value={formData.guardianContactNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contact Number"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className={sectionTitleClass}>
             Is the Learner under the Special Needs Education Program?
          </h3>

          <div className="flex gap-4 mb-4">
            <label className={checkboxLabelClass}>
              <input
                type="radio"
                name="specialNeedsProgram"
                value="Yes"
                checked={formData.specialNeedsProgram === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label className={checkboxLabelClass}>
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

          {formData.specialNeedsProgram === 'Yes' && (
            <div className="space-y-8">
              <div>
                <h4 className="mb-3 text-lg font-semibold text-gray-700">
                  a1. With Diagnosis from Licensed Medical Specialist
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {snedDiagnoses.map((item) => (
                    <label key={item} className={checkboxLabelClass}>
                      <input
                        type="checkbox"
                        checked={formData.snedDiagnosis.includes(item)}
                        onChange={() => toggleArrayValue('snedDiagnosis', item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold text-gray-700">
                  a2. With Manifestations
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {snedManifestations.map((item) => (
                    <label key={item} className={checkboxLabelClass}>
                      <input
                        type="checkbox"
                        checked={formData.snedManifestations.includes(item)}
                        onChange={() => toggleArrayValue('snedManifestations', item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-gray-900">Does the Learner have a PWD ID?</p>
            <div className="flex gap-4">
              <label className={checkboxLabelClass}>
                <input
                  type="radio"
                  name="pwdIdHolder"
                  value="Yes"
                  checked={formData.pwdIdHolder === 'Yes'}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className={checkboxLabelClass}>
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

        <div>
          <h3 className={sectionTitleClass}>
             For Returning Learner (Balik-Aral) and those who will Transfer / Move In
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="lastGradeLevelCompleted"
              value={formData.lastGradeLevelCompleted}
              onChange={handleChange}
              className={inputClass}
              placeholder="Last Grade Level Completed"
            />
            <input
              name="lastSchoolYearCompleted"
              value={formData.lastSchoolYearCompleted}
              onChange={handleChange}
              className={inputClass}
              placeholder="Last School Year Completed"
            />
            <input
              name="lastSchoolAttended"
              value={formData.lastSchoolAttended}
              onChange={handleChange}
              className={inputClass}
              placeholder="Last School Attended"
            />
            <input
              name="schoolId"
              value={formData.schoolId}
              onChange={handleChange}
              className={inputClass}
              placeholder="School ID"
            />
          </div>
        </div>

        {isSeniorHigh && (
          <div>
            <h3 className={sectionTitleClass}> For Learner in Senior High School</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-900">Semester</p>
                <div className="flex gap-4">
                  <label className={checkboxLabelClass}>
                    <input
                        type="radio"
                        name="semester"
                        value="1st"
                        checked={formData.semester === '1st'}
                        onChange={handleChange}
                        required={isSeniorHigh}
                      />
                    1st
                  </label>
                  <label className={checkboxLabelClass}>
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

              <select
                name="track"
                value={formData.track}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Track</option>
                <option value="ACADEMIC TRACK">Academic Track</option>
                <option value="TECHNICAL-PROFESSIONAL TRACK">
                  Technical-Professional Track
                </option>
              </select>
                            <select
                name="strand"
                value={formData.strand}
                onChange={handleChange}
                className={inputClass}
                required={isSeniorHigh}
              >
                <option value="">Select Specialization</option>
                {strands.map((strand) => (
                  <option key={strand} value={strand}>
                    {strand}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <h3 className={sectionTitleClass}>
             If the school will implement other distance learning modalities aside from
            face-to-face instruction, what would you prefer for your child?
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {learningModalities.map((item) => (
              <label key={item} className={checkboxLabelClass}>
                <input
                  type="checkbox"
                  checked={formData.preferredLearningModality.includes(item)}
                  onChange={() => toggleArrayValue('preferredLearningModality', item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className={sectionTitleClass}>Certification</h3>
          <p className="mb-4 text-sm leading-6 text-gray-600">
            I hereby certify that the above information given are true and correct to
            the best of my knowledge and I allow the Department of Education to process
            the learner&apos;s personal information for the purpose of registration. The
            personal information herein shall be treated as confidential in compliance
            with the Data Privacy Act.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="parentFullName"
              value={formData.parentFullName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Full Name of Parent / Guardian"
              required
            />

            <input
              name="signatureDate"
              type="date"
              value={formData.signatureDate}
              readOnly
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-3 mt-4 text-sm text-gray-700">
            <input
              type="checkbox"
              name="certificationAccepted"
              checked={formData.certificationAccepted}
              onChange={handleChange}
              className="mt-1"
            />
            I agree and confirm that the information provided is true and correct.
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-white transition bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Submit Enrollment Form
        </button>
      </form>
    </section>
  );
}