import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News | PipeGallery',
  description: 'Latest news, updates, and posts from PipeGallery. Stay informed about our activities.',
  keywords: ['gallery news', 'art news', 'exhibition updates', 'gallery activities'],
};

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            News
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest from PipeGallery
          </p>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            News and updates will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}