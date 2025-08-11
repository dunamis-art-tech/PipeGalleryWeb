import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exhibitions | PipeGallery',
  description: 'Contemporary art exhibitions at PipeGallery. Explore current, upcoming, and past exhibitions.',
  keywords: ['contemporary art', 'art exhibitions', 'gallery', 'Seoul art'],
};

export default function ExhibitionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Exhibitions
          </h1>
          <p className="text-lg text-gray-600">
            Discover contemporary art through our carefully curated exhibitions
          </p>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Exhibition listings and details will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}