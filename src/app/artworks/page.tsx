'use client';

import { useState } from 'react';
import ArtworkGrid, { ArtworkFilters } from '@/components/gallery/ArtworkGrid';

export default function ArtworksPage() {
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              작품 컬렉션
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              갤러리에 전시된 모든 작품을 둘러보세요. 
              다양한 장르와 스타일의 현대 미술 작품들을 만나보실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <ArtworkFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Artworks Grid */}
        <ArtworkGrid 
          showArtist={true}
          featuredOnly={false}
        />
      </div>

      {/* Featured Section - if no filters applied */}
      {Object.keys(currentFilters).length === 0 && (
        <div className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">
                추천 작품
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                큐레이터가 선정한 특별한 작품들을 감상해보세요.
              </p>
            </div>
            
            <ArtworkGrid 
              featuredOnly={true}
              limit={8}
              showArtist={true}
            />
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              작품에 관심이 있으시나요?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              작품 구매 문의나 전시 관련 정보가 필요하시면 언제든 연락주세요.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}