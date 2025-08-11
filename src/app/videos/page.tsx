import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Videos | PipeGallery',
  description: 'Video content from PipeGallery exhibitions, artist interviews, and gallery tours.',
  keywords: ['art videos', 'artist interviews', 'exhibition tours', 'contemporary art'],
};

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Videos
          </h1>
          <p className="text-lg text-gray-600">
            Explore our video content including artist interviews and exhibition tours
          </p>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Video gallery will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}