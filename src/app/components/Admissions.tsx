'use client';

export default function Admissions() {
  return (
    <section
      id="admissions"
      className="py-20 scroll-mt-[160px] px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background2.png')" }}
    >
      <div className="max-w-4xl mx-auto text-center bg-white/20 backdrop-blur-lg p-10 rounded-xl shadow-2xl border border-white/20">
        <h3 className="text-3xl font-bold text-blue-800 mb-6">Admissions</h3>
        <p className="mb-6 text-gray-800 text-lg font-semibold">
          Start your journey with us! Prepare the following:
        </p>

        <ul className="text-left max-w-md mx-auto mb-6 text-gray-800 list-disc list-inside text-base font-medium">
          <li>Form 138 (Report Card)</li>
          <li>PSA Birth Certificate</li>
          <li>Certificate of Good Moral Character</li>
          <li>1x1 Photo (2 pcs)</li>
        </ul>

        <a
          href="https://www.facebook.com/SCMSSHS23"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-800 transition font-semibold"
        >
          Contact Us on Facebook
        </a>
      </div>
    </section>
  );
}
