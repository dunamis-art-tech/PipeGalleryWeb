import { Metadata } from 'next';
import Link from 'next/link';
import PlaceholderImage from '@/components/ui/PlaceholderImage';

export const metadata: Metadata = {
  title: 'PIPE GALLERY | Contemporary Art Gallery',
  description: 'Contemporary art gallery showcasing emerging and established artists through carefully curated exhibitions.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Exhibition Section - Main Poster */}
      <section className="w-full min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[600px]">
            {/* Exhibition Info */}
            <div className="space-y-8">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight leading-none">
                Heun (痕)
              </h1>
              <p className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-gray-700 tracking-tight leading-tight">
                5 Aug - 3 Sep<br />
                2025
              </p>
            </div>

            {/* Poster Image */}
            <div className="aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <PlaceholderImage 
                type="poster"
                text="Heun (痕)"
                className="w-full h-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* POST Section - Artist Interview */}
      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Post Image */}
            <div className="aspect-[4/3] w-full">
              <PlaceholderImage 
                type="studio"
                text="Artist in Studio"
                className="w-full h-full rounded-lg shadow-lg"
              />
            </div>

            {/* Post Info */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-thin text-gray-900 tracking-tight leading-tight">
                POST
              </h2>
              <h3 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-gray-800 tracking-tight leading-tight">
                Vein and Fever: 김찬송 아티스트 인터뷰
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Visit & Contact Section */}
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Visit Info */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-thin text-gray-900 tracking-tight leading-tight">
                VISIT
              </h2>
              <div className="space-y-4 text-lg lg:text-xl xl:text-2xl font-medium text-gray-800 leading-relaxed">
                <p className="font-semibold">관람시간 :</p>
                <p>Tue- Sat 10am-6pm and by appointment closed on Sundays, Mondays and National holidays.</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-thin text-gray-900 tracking-tight leading-tight">
                CONTACT
              </h2>
              <div className="space-y-2 text-lg lg:text-xl xl:text-2xl font-medium text-gray-800 leading-relaxed">
                <p>PIPE GALLERY</p>
                <p>info@pipegallery.com</p>
                <p>T. +82 2 797 3996</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}