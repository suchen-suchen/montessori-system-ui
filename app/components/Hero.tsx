'use client';

export default function Hero() {
  return (
    <section
      className="pt-[208px] sm:pt-[148px] md:pt-[160px] pb-10 px-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background3.png')" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-blue-900">
          St. Christopher Montessori School
        </h2>
        <p className="text-md sm:text-xl md:text-2xl mb-6 font-light text-blue-900">
          Senior High School Department
        </p>

        {/* 👇 CTA Button */}
        <a
          href="#admissions"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full shadow-lg transition font-semibold text-base sm:text-lg"
        >
          Apply Now
        </a>
      </div>
    </section>
  );
}
