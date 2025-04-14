'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} St. Christopher Montessori School - SHS Dept. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
