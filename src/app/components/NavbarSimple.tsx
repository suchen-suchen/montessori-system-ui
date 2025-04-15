'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NavbarSimple() {
  return (
    <>
      {/* 🔵 Logo Header */}
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

      {/* 🔗 Home Link Only */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200 sticky top-[160px] sm:top-[100px] z-40">
        <div className="container px-4 py-3 mx-auto text-center">
          <Link
            href="/"
            className="text-sm sm:text-base font-bold text-gray-700 hover:text-blue-700 transition"
          >
            Home
          </Link>
        </div>
      </div>
    </>
  );
}
