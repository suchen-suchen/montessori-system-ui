'use client';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VideoSection from "./components/VideoSection";
import About from "./components/About";
import Tracks from "./components/Tracks";
import Admissions from "./components/Admissions";
import Contact from "./components/Contact";
import Disclaimer from "./components/Disclaimer"; 
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="font-sans text-gray-800 bg-white scroll-smooth">
      <Navbar />
      <Hero />
      <VideoSection />
      <About />
      <Tracks />
      <Admissions />
      <Contact /> 
      <Disclaimer />
      <Footer />
    </main>
  );
}
