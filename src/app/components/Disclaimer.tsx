'use client';

export default function Disclaimer() {
  return (
    <section
      id="disclaimer"
      className="py-20 px-6 bg-gradient-to-br from-[#dbeafe] via-[#fef3c7] to-white"
    >
      <div
        className="max-w-5xl mx-auto p-8 rounded-xl shadow-2xl bg-white/30 backdrop-blur-lg border border-white/20 text-sm text-gray-800 leading-relaxed"
      >
        {/* Fair Use Section */}
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-blue-800">FAIR USE STATEMENT</h2>
          <p>
            This website may include copyrighted materials that are not always
            specifically authorized by the copyright owner. Typically, we
            provide credit to the authors of photos, videos, and other related
            content, which are sourced from various internet sites. These
            materials are used for educational purposes or to enhance teaching
            methodologies in various learning areas.
          </p>
          <p>
            If you wish to use copyrighted materials from this site for
            purposes beyond &quot;fair use,&quot; you must obtain explicit
            permission from the copyright owner.
          </p>
          <p>
            If you are the owner of any copyrighted
            material and believe that its use does not qualify as
            &quot;fair use,&quot; please contact us so we can make the
            appropriate corrections or remove the content if necessary.
          </p>
        </div>

        {/* Disclaimer Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-800">DISCLAIMER</h2>
          <p>
            The owner of this website, its administrators, or representatives
            will not be held personally responsible or liable for any damages,
            actual or consequential, arising from any claims, comments, or
            feedback by third parties that may violate any law.
          </p>
        </div>
      </div>
    </section>
  );
}
