'use client';

export default function VideoSection() {
  return (
    <section
      id="videos"
      className="py-20 px-6 bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#fefce8]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-xl">
            <iframe
              className="w-full h-full"
              src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/1168678687883866&show_text=false&width=734"
              width="734"
              height="411"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
