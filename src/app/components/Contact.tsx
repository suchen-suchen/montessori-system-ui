'use client';
import Image from "next/image";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 px-6 bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#fef9c3] text-blue-900"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="w-full max-w-xl rounded-lg shadow-xl overflow-hidden h-auto md:h-[600px]">
          <Image
            src="/contact1.png"
            alt="Contact"
            width={800}
            height={600}
            className="w-full h-auto md:h-full object-cover"
          />
        </div>
        <div className="w-full max-w-xl rounded-lg shadow-xl overflow-hidden h-auto md:h-[600px]">
          <iframe
            title="SCMS Facebook Page"
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSCMSSHS23&tabs=timeline&width=600&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
            width="100%"
            height="600"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <iframe
          title="SCMS Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.609738183148!2d120.93956987502399!3d15.422568754247252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33972a1b1a84d91d%3A0x34ea0d8ddc26ea7f!2sSanta%20Rosa%2C%20Nueva%20Ecija!5e0!3m2!1sen!2sph!4v1713012345678"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
