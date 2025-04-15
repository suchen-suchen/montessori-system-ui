'use client';

import InquiryForm from './InquiryForm';
import NavbarSimple from '../components/NavbarSimple'; // ✅ NEW simplified navbar

export default function InquirePage() {
  return (
    <>
      <NavbarSimple />
      <main className="min-h-screen px-4 py-10 bg-gray-100 pt-[200px] sm:pt-[120px]">
        <div className="max-w-5xl mx-auto">
          <InquiryForm />
        </div>
      </main>
    </>
  );
}
