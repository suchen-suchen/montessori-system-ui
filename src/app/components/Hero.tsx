'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="pt-[208px] sm:pt-[148px] md:pt-[160px] pb-10 px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background3.png')" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold text-blue-900 sm:text-4xl md:text-5xl">
          St. Christopher Montessori School
        </h2>
        <p className="mb-6 font-light text-blue-900 text-md sm:text-xl md:text-2xl">
          Senior High School Department
        </p>

        {/* ✅ Updated CTA to navigate to /inquire */}
        <Link
          href="/Inquire"
          className="inline-block px-6 py-3 text-base font-semibold text-white transition bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 sm:text-lg"
        >
          Apply Now
        </Link>
      </div>
    </section>
  );
}
