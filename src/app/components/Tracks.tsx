'use client';
import Image from "next/image";

const tracks = [
  {
    name: "Academic Cluster",
    image: "/academic.png",
    clusters: ["STEM", "ABM", "HUMSS", "GAS"],
  },
  {
    name: "Technical-Professional Cluster",
    image: "/techpro.png",
    clusters: [
      "ICT SUPPORT AND COMPUTER PROGRAMMING",
      "AUTOMOTIVE AND SMALL ENGINE TECHNOLOGIES",
      "HOSPITALITY AND TOURISM",
    ],
  },
];

export default function Tracks() {
  return (
    <section
      id="tracks"
      className="py-20 px-6 bg-gradient-to-br from-[#dbeafe] via-[#fef3c7] to-[#ffffff]"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-blue-800 mb-10">
          Senior High School Tracks
        </h3>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cover bg-center bg-no-repeat p-6 rounded-xl shadow-2xl"
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
                className="mx-auto mb-6 w-auto h-[350px] object-contain"
              />

              <h4 className="text-2xl font-bold text-blue-700 mb-4">
                {track.name}
              </h4>

              <ul className="flex flex-wrap justify-center gap-2">
                {track.clusters.map((cluster, index) => (
                  <li
                    key={index}
                    className="bg-white/40 rounded px-3 py-1"
                  >
                    {cluster}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}