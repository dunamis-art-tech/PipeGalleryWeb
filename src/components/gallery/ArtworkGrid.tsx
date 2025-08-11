'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { artworkService } from '@/lib/api/artworks';
import { formatFileSize } from '@/lib/utils/upload';
import type { Database } from '@/types/database';

type ArtworkWithImages = Database['public']['Tables']['artworks']['Row'] & {
  images: Database['public']['Tables']['artwork_images']['Row'][];
  artist?: {
    id: string;
    name: string;
    profile_image_url?: string;
  };
};

interface ArtworkGridProps {
  artistId?: string;
  limit?: number;
  showArtist?: boolean;
  featuredOnly?: boolean;
}

export default function ArtworkGrid({ 
  artistId, 
  limit, 
  showArtist = true,
  featuredOnly = false 
}: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<ArtworkWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const params = {
          artist_id: artistId,
          is_featured: featuredOnly ? true : undefined,
          limit,
          sort_by: 'created_at' as const
        };

        const artworkList = await artworkService.getAll(params);
        setArtworks(artworkList);
      } catch (err) {
        setError(err instanceof Error ? err.message : '작품을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [artistId, limit, featuredOnly]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-300 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">작품이 없습니다</h3>
        <p className="mt-2 text-gray-500">
          {featuredOnly ? '추천 작품이' : '등록된 작품이'} 아직 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard 
          key={artwork.id} 
          artwork={artwork} 
          showArtist={showArtist} 
        />
      ))}
    </div>
  );
}

interface ArtworkCardProps {
  artwork: ArtworkWithImages;
  showArtist?: boolean;
}

function ArtworkCard({ artwork, showArtist = true }: ArtworkCardProps) {
  const primaryImage = artwork.images.find(img => img.is_primary) || artwork.images[0];
  
  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Artwork Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Featured Badge */}
        {artwork.is_featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              추천
            </span>
          </div>
        )}

        {/* Image Count Badge */}
        {artwork.images.length > 1 && (
          <div className="absolute top-2 right-2">
            <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
              +{artwork.images.length - 1}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </div>

      {/* Artwork Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
          {artwork.title}
        </h3>

        {/* Artist Info */}
        {showArtist && artwork.artist && (
          <p className="text-sm text-gray-600 mb-2">
            {artwork.artist.name}
          </p>
        )}

        {/* Artwork Details */}
        <div className="text-xs text-gray-500 space-y-1">
          {artwork.year && (
            <p>{artwork.year}년</p>
          )}
          {artwork.materials && (
            <p className="line-clamp-1">{artwork.materials}</p>
          )}
          {artwork.dimensions && (
            <p>{artwork.dimensions}</p>
          )}
        </div>

        {/* Description Preview */}
        {artwork.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {artwork.description}
          </p>
        )}
      </div>

      {/* Click Area */}
      <Link 
        href={`/artworks/${artwork.slug || artwork.id}`}
        className="absolute inset-0"
      >
        <span className="sr-only">{artwork.title} 자세히 보기</span>
      </Link>
    </div>
  );
}

// Artwork Search and Filter Component
interface ArtworkFiltersProps {
  onFiltersChange: (filters: {
    query?: string;
    year?: number;
    materials?: string;
    is_featured?: boolean;
    sort_by?: string;
  }) => void;
}

export function ArtworkFilters({ onFiltersChange }: ArtworkFiltersProps) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [materials, setMaterials] = useState('');
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>();
  const [sortBy, setSortBy] = useState('created_at');

  const handleFilterChange = () => {
    onFiltersChange({
      query: query || undefined,
      year: year ? parseInt(year) : undefined,
      materials: materials || undefined,
      is_featured: isFeatured,
      sort_by: sortBy
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [query, year, materials, isFeatured, sortBy]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Query */}
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="작품명, 재료 검색"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Year Filter */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            제작연도
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="예: 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Materials Filter */}
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
            재료/기법
          </label>
          <input
            type="text"
            id="materials"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="예: 유화, 아크릴"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Featured Filter */}
        <div>
          <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">
            추천작품
          </label>
          <select
            id="featured"
            value={isFeatured === undefined ? '' : isFeatured.toString()}
            onChange={(e) => setIsFeatured(
              e.target.value === '' ? undefined : e.target.value === 'true'
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            <option value="true">추천작품만</option>
            <option value="false">일반작품만</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            정렬
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at">등록일순</option>
            <option value="title">제목순</option>
            <option value="year">제작연도순</option>
            <option value="featured">추천작품순</option>
          </select>
        </div>
      </div>
    </div>
  );
}