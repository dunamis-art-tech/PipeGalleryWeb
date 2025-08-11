'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { artworkService } from '@/lib/api/artworks';
import type { Database } from '@/types/database';

type ArtworkWithImages = Database['public']['Tables']['artworks']['Row'] & {
  images: Database['public']['Tables']['artwork_images']['Row'][];
  artist?: {
    id: string;
    name: string;
    profile_image_url?: string;
    biography?: string;
  };
};

export default function ArtworkDetailPage() {
  const params = useParams();
  const [artwork, setArtwork] = useState<ArtworkWithImages | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relatedArtworks, setRelatedArtworks] = useState<ArtworkWithImages[]>([]);

  const slug = params.slug as string;

  useEffect(() => {
    async function loadArtwork() {
      try {
        setLoading(true);
        
        // Try to find by slug first, then by ID
        let artworkData = null;
        try {
          artworkData = await artworkService.getBySlug(slug);
        } catch (error) {
          // If slug fails, try by ID
          artworkData = await artworkService.getById(slug);
        }

        if (!artworkData) {
          notFound();
          return;
        }

        setArtwork(artworkData);

        // Load related artworks by same artist
        if (artworkData.artist_id) {
          const related = await artworkService.getByArtistId(artworkData.artist_id);
          const filteredRelated = related.filter(art => art.id !== artworkData.id).slice(0, 6);
          setRelatedArtworks(filteredRelated);
        }
      } catch (error) {
        console.error('Failed to load artwork:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadArtwork();
    }
  }, [slug]);

  const nextImage = () => {
    if (artwork && artwork.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % artwork.images.length);
    }
  };

  const prevImage = () => {
    if (artwork && artwork.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + artwork.images.length) % artwork.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">작품을 불러오는 중...</p>
      </div>
    );
  }

  if (!artwork) {
    return notFound();
  }

  const currentImage = artwork.images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <Link href="/artworks" className="text-blue-600 hover:text-blue-800">
              ← 작품 목록으로
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              {artwork.artist?.name} - {artwork.title}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
              {currentImage ? (
                <>
                  <Image
                    src={currentImage.image_url}
                    alt={currentImage.alt_text || artwork.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Navigation Arrows */}
                  {artwork.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        aria-label="이전 이미지"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        aria-label="다음 이미지"
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {artwork.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {artwork.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {artwork.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {artwork.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Information */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              {artwork.is_featured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  추천 작품
                </span>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              
              {artwork.artist && (
                <div className="flex items-center space-x-3 mb-4">
                  {artwork.artist.profile_image_url && (
                    <Image
                      src={artwork.artist.profile_image_url}
                      alt={artwork.artist.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <Link 
                      href={`/artists/${artwork.artist.id}`}
                      className="text-lg font-medium text-blue-600 hover:text-blue-800"
                    >
                      {artwork.artist.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Artwork Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">작품 정보</h3>
              <dl className="space-y-3">
                {artwork.year && (
                  <div className="flex">
                    <dt className="w-24 text-sm font-medium text-gray-500">제작연도</dt>
                    <dd className="text-sm text-gray-900">{artwork.year}년</dd>
                  </div>
                )}
                {artwork.materials && (
                  <div className="flex">
                    <dt className="w-24 text-sm font-medium text-gray-500">재료/기법</dt>
                    <dd className="text-sm text-gray-900">{artwork.materials}</dd>
                  </div>
                )}
                {artwork.dimensions && (
                  <div className="flex">
                    <dt className="w-24 text-sm font-medium text-gray-500">크기</dt>
                    <dd className="text-sm text-gray-900">{artwork.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">작품 설명</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Artist Bio */}
            {artwork.artist?.biography && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">작가 소개</h3>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.artist.biography}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/artists/${artwork.artist.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    작가 프로필 보기 →
                  </Link>
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">작품 문의</h3>
              <p className="text-gray-600 mb-4">
                이 작품에 대해 궁금한 점이 있으시거나 구매를 원하시면 연락주세요.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {artwork.artist?.name}의 다른 작품
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArtworks.map((relatedArtwork) => {
                const primaryImage = relatedArtwork.images?.find(img => img.is_primary) || relatedArtwork.images?.[0];
                return (
                  <Link
                    key={relatedArtwork.id}
                    href={`/artworks/${relatedArtwork.slug || relatedArtwork.id}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url}
                          alt={primaryImage.alt_text || relatedArtwork.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {relatedArtwork.title}
                      </h3>
                      {relatedArtwork.year && (
                        <p className="text-sm text-gray-500 mt-1">{relatedArtwork.year}년</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}