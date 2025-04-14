'use client';
import Image from "next/image";
import { tracks } from "../data/tracks";

export default function Tracks() {
  return (
    <section
      id="tracks"
      className="py-20 px-6 bg-gradient-to-br from-[#dbeafe] via-[#fef3c7] to-[#ffffff]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-blue-800 mb-10">Academic Tracks</h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-cover bg-center bg-no-repeat p-6 rounded-xl shadow-2xl"
          style={{ backgroundImage: "url('/background1.png')" }}
        >
          {tracks.map((track) => (
            <div
              key={track.name}
              className="bg-white/30 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-md hover:shadow-xl transition text-center"
            >
              <Image
                src={track.image}
                alt={track.name}
                width={220}
                height={220}
                className="mx-auto mb-6 w-auto h-[200px] object-contain"
              />
              <h4 className="text-2xl font-bold text-blue-700 mb-3">{track.name}</h4>
              <p className="text-base font-medium text-gray-800">{track.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
