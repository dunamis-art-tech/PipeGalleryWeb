import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artists | PipeGallery',
  description: 'Contemporary artists featured at PipeGallery. Explore artist profiles, biographies, and portfolios.',
  keywords: ['contemporary artists', 'artist profiles', 'Korean artists', 'art gallery'],
};

export default function ArtistsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artists
          </h1>
          <p className="text-lg text-gray-600">
            Meet the talented contemporary artists we represent
          </p>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Artist profiles and portfolios will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}