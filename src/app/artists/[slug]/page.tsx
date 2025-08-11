import { Metadata } from 'next';

interface ArtistDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArtistDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Artist Profile | PipeGallery`,
    description: `Artist profile and portfolio for ${slug} at PipeGallery`,
  };
}

export default async function ArtistDetailPage({ params }: ArtistDetailPageProps) {
  const { slug } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artist: {slug}
          </h1>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Artist profile for "{slug}" will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}