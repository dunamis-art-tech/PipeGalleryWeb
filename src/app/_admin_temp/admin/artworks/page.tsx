'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import ArtworkGrid, { ArtworkFilters } from '@/components/gallery/ArtworkGrid';
import { artworkService } from '@/lib/api/artworks';
import type { Database } from '@/types/database';

type ArtworkWithImages = Database['public']['Tables']['artworks']['Row'] & {
  images: Database['public']['Tables']['artwork_images']['Row'][];
  artist?: {
    id: string;
    name: string;
    profile_image_url?: string;
  };
};

export default function ArtworksAdminPage() {
  const [artworks, setArtworks] = useState<ArtworkWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  // Load artworks with filters
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const artworkList = await artworkService.getAll({
          ...currentFilters,
          sort_by: currentFilters.sort_by || 'created_at'
        });
        setArtworks(artworkList);
        setError(null);
      } catch (err) {
        console.error('Failed to load artworks:', err);
        setError('작품 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [currentFilters]);

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!confirm('정말로 이 작품을 삭제하시겠습니까?')) return;

    try {
      await artworkService.delete(artworkId);
      setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
      alert('작품이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      alert('작품 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">작품 관리</h1>
          <p className="text-gray-600 mt-1">
            갤러리의 작품을 등록, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <Link
          href="/admin/artworks/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          새 작품 등록
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">전체 작품</div>
          <div className="text-2xl font-bold text-gray-900">{artworks.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">추천 작품</div>
          <div className="text-2xl font-bold text-gray-900">
            {artworks.filter(a => a.is_featured).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">이미지 있는 작품</div>
          <div className="text-2xl font-bold text-gray-900">
            {artworks.filter(a => a.images && a.images.length > 0).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500">최근 등록</div>
          <div className="text-2xl font-bold text-gray-900">
            {artworks.filter(a => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(a.created_at) > weekAgo;
            }).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <ArtworkFilters onFiltersChange={handleFiltersChange} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-800 underline hover:text-red-900"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">작품 목록을 불러오는 중...</p>
        </div>
      )}

      {/* Artworks Grid with Admin Actions */}
      {!loading && !error && (
        <>
          {artworks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">작품이 없습니다</h3>
              <p className="mt-2 text-gray-500">첫 번째 작품을 등록해보세요.</p>
              <div className="mt-6">
                <Link
                  href="/admin/artworks/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  작품 등록하기
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <AdminArtworkCard 
                  key={artwork.id} 
                  artwork={artwork} 
                  onDelete={() => handleDeleteArtwork(artwork.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Admin Artwork Card with edit/delete actions
interface AdminArtworkCardProps {
  artwork: ArtworkWithImages;
  onDelete: () => void;
}

function AdminArtworkCard({ artwork, onDelete }: AdminArtworkCardProps) {
  const primaryImage = artwork.images?.find(img => img.is_primary) || artwork.images?.[0];
  
  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Artwork Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {artwork.is_featured && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              추천
            </span>
          )}
          {artwork.images && artwork.images.length > 1 && (
            <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full">
              +{artwork.images.length - 1}
            </span>
          )}
        </div>

        {/* Admin Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-y-1">
          <Link
            href={`/admin/artworks/${artwork.id}/edit`}
            className="block bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="수정"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={onDelete}
            className="block bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            title="삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Artwork Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
          {artwork.title}
        </h3>

        {/* Artist Info */}
        {artwork.artist && (
          <p className="text-sm text-gray-600 mb-2">
            {artwork.artist.name}
          </p>
        )}

        {/* Artwork Details */}
        <div className="text-xs text-gray-500 space-y-1">
          {artwork.year && <p>{artwork.year}년</p>}
          {artwork.materials && <p className="line-clamp-1">{artwork.materials}</p>}
          {artwork.dimensions && <p>{artwork.dimensions}</p>}
        </div>

        {/* Admin Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>등록: {new Date(artwork.created_at).toLocaleDateString('ko-KR')}</span>
            <span>이미지: {artwork.images?.length || 0}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}