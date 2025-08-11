import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ExhibitionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ExhibitionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Exhibition Details | PipeGallery`,
    description: `Details about the ${slug} exhibition at PipeGallery`,
  };
}

export default async function ExhibitionDetailPage({ params }: ExhibitionDetailPageProps) {
  const { slug } = await params;
  // TODO: Fetch exhibition data by slug
  // For now, just show placeholder
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Exhibition: {slug}
          </h1>
        </header>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            Exhibition details for "{slug}" will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}