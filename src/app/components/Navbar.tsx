'use client';
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      {/* Header Top (Logo) */}
      <header
        className="fixed top-0 left-0 w-full z-50 h-[160px] sm:h-[100px] bg-cover bg-center shadow"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left h-full">
          <Image
            src="/logo.png"
            alt="SCMS SHS"
            width={80}
            height={80}
            sizes="(max-width: 768px) 60px, 80px"
            className="w-20 sm:w-28 h-auto"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">
            St. Christopher Montessori School of Santa Rosa, Inc.
          </h1>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200 sticky top-[160px] sm:top-[100px] z-40">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold text-gray-700">
            <a href="#about" className="hover:text-blue-700 transition">About</a>
            <a href="#tracks" className="hover:text-blue-700 transition">Tracks</a>
            <a href="#admissions" className="hover:text-blue-700 transition">Admissions</a>
            <a href="#contact" className="hover:text-blue-700 transition">Contact</a>
            <a href="#" className="hover:text-blue-700 transition">Login</a>
          </nav>
        </div>
      </div>
    </>
  );
}
