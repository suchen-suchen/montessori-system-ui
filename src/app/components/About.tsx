'use client';
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-8 bg-blue-900 text-white">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* VISION, MISSION, PHILOSOPHY, VALUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Side: Vision, Mission, etc. */}
          <div className="space-y-12">
            {[
              {
                title: 'Vision',
                text: `St. Christopher Montessori School is an educational institution committed to the
                development of young individuals’ knowledge, skills, and personality to make them
                agents of positive and productive changes in society.`
              },
              {
                title: 'Mission',
                text: `SCMS aims to form students with essential knowledge to cope with higher studies,
                to identify and develop skills as a foundation for living and working in the
                community, and to strengthen a positive personality reflecting joy, peace, and
                love to one another.`
              },
              {
                title: 'Philosophy',
                text: `SCMS believes that students are to be given learning opportunities that help them
                acquire essential knowledge, develop skills, and mold personality through the
                guidance of teachers and programs beneficial to the community and country.`
              }
            ].map((item, idx) => (
              <div key={idx}>
                <h2 className="text-3xl font-bold mb-3 border-l-4 border-yellow-400 pl-4 uppercase tracking-wide">
                  {item.title}
                </h2>
                <p className="text-base leading-relaxed text-white/90">
                  {item.text}
                </p>
              </div>
            ))}

            {/* Core Values */}
            <div>
              <h2 className="text-3xl font-bold mb-3 border-l-4 border-yellow-400 pl-4 uppercase tracking-wide">
                Core Values
              </h2>
              <ul className="list-none text-base space-y-2 pl-2">
                {['Competence', 'Service', 'Character'].map((value, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-300">✔️</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: Image + About SHS Description */}
          <div className="flex flex-col justify-center items-center md:items-start text-left space-y-6">
            <Image
              src="/campus.png"
              alt="St. Christopher Montessori School Building"
              width={600}
              height={400}
              className="w-full max-w-md md:max-w-full h-auto rounded-lg shadow-2xl object-cover"
            />
            <div>
              <h3 className="text-2xl font-bold mb-2">About Our SHS Department</h3>
              <p className="text-base leading-relaxed text-white/90">
                At SCMS, our Senior High School department provides a holistic education that nurtures
                intellectual excellence, personal growth, and moral integrity. We prepare students for
                college and life beyond through advanced academic tracks, experienced faculty, and a
                supportive learning environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
