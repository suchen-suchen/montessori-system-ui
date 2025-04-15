'use client';

import { useState } from 'react';

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    birthdate: '',
    gender: '',
    track: '',
    contact: '',
    email: '',
    parentName: '',
    parentContact: '',
    schoolName: '',
    lastGrade: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inquiry Submitted:', formData);
    alert('✅ Thank you! Your inquiry has been submitted.');
  };

  return (
    <section className="p-6 bg-white shadow-xl rounded-xl sm:p-10">
      <h2 className="mb-8 text-2xl font-bold text-center text-blue-800">
        Senior High School Enrollment Inquiry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
        {/* 🧑 Student Info */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Student Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="studentName"
              type="text"
              placeholder="Full Name"
              value={formData.studentName}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="text-gray-800 placeholder-gray-500 bg-white appearance-none form-input focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
            <select
              name="track"
              value={formData.track}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Desired Track</option>
              <option value="STEM">STEM</option>
              <option value="ABM">ABM</option>
              <option value="HUMSS">HUMSS</option>
              <option value="GAS">GAS</option>
            </select>
            <input
              name="contact"
              type="text"
              placeholder="Student Contact Number"
              value={formData.contact}
              onChange={handleChange}
              className="form-input"
            />
            <input
              name="email"
              type="email"
              placeholder="Student Email Address"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* 👨‍👩‍👧 Parent Info */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Parent/Guardian Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="parentName"
              type="text"
              placeholder="Parent/Guardian Name"
              value={formData.parentName}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              name="parentContact"
              type="text"
              placeholder="Parent Contact Number"
              value={formData.parentContact}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* 🏫 Previous School */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Previous School Attended</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="schoolName"
              type="text"
              placeholder="School Name"
              value={formData.schoolName}
              onChange={handleChange}
              className="form-input"
            />
            <input
              name="lastGrade"
              type="text"
              placeholder="Last Grade Completed (e.g. Grade 10)"
              value={formData.lastGrade}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* 📝 Message */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Additional Message</label>
          <textarea
            name="message"
            placeholder="Is there anything you'd like us to know?"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 bg-white border rounded-lg focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* ✅ Submit */}
        <button
          type="submit"
          className="w-full py-3 font-semibold text-white transition bg-blue-700 rounded-lg shadow hover:bg-blue-800"
        >
          Submit Inquiry
        </button>
      </form>
    </section>
  );
}
