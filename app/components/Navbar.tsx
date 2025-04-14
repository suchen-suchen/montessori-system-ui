'use client';
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      {/* Header Top (Logo) */}
      <header
        className="fixed top-0 left-0 w-full z-50 h-[160px] sm:h-[100px] bg-cover bg-center shadow"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="container flex flex-col items-center h-full gap-2 px-4 py-3 mx-auto text-center sm:flex-row sm:gap-4 sm:text-left">
          <Image
            src="/logo.png"
            alt="SCMS SHS"
            width={80}
            height={80}
            sizes="(max-width: 768px) 60px, 80px"
            className="w-20 h-auto sm:w-28"
          />
          <h1 className="text-xl font-bold text-white md:text-2xl drop-shadow-sm">
            St. Christopher Montessori School of Santa Rosa, Inc.
          </h1>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200 sticky top-[160px] sm:top-[100px] z-40">
        <div className="container px-4 py-3 mx-auto">
          <nav
            className="flex flex-wrap justify-center text-sm font-bold text-gray-700 gap-x-6 gap-y-3 sm:text-base"
            role="navigation"
            aria-label="Main navigation"
          >
            <a href="#about" className="transition hover:text-blue-700">About</a>
            <a href="#tracks" className="transition hover:text-blue-700">Tracks</a>
            <a href="#admissions" className="transition hover:text-blue-700">Admissions</a>
            <a href="#contact" className="transition hover:text-blue-700">Contact</a>
            {/* Login is now a Link component (for real routing!) */}
            <Link href="/login" className="transition hover:text-blue-700">Login</Link>
          </nav>
        </div>
      </div>
    </>
  );
}
