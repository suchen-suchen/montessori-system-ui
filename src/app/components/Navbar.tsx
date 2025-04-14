'use client';
import { useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("data-section") === id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.6 } // triggers when 60% of section is visible
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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

      {/* Nav Menu */}
      <div className="bg-white shadow-sm border-t border-b border-gray-200 sticky top-[160px] sm:top-[100px] z-40">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold text-gray-700">
            <a
              href="#about"
              className="nav-link transition hover:text-blue-700"
              data-section="about"
            >
              About
            </a>
            <a
              href="#tracks"
              className="nav-link transition hover:text-blue-700"
              data-section="tracks"
            >
              Tracks
            </a>
            <a
              href="#admissions"
              className="nav-link transition hover:text-blue-700"
              data-section="admissions"
            >
              Admissions
            </a>
            <a
              href="#contact"
              className="nav-link transition hover:text-blue-700"
              data-section="contact"
            >
              Contact
            </a>
            <a
              href="#"
              className="nav-link transition hover:text-blue-700"
              data-section="login"
            >
              Login
            </a>
          </nav>
        </div>
      </div>

      {/* Scroll Highlight Style */}
      <style jsx>{`
        .nav-link.active {
          color: #1d4ed8; /* Tailwind blue-700 */
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
