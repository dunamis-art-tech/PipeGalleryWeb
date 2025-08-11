'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ArtworkForm from '@/components/forms/ArtworkForm';
import { artworkService } from '@/lib/api/artworks';
import type { Database } from '@/types/database';

type Artwork = Database['public']['Tables']['artworks']['Row'];
type ArtworkWithImages = Database['public']['Tables']['artworks']['Row'] & {
  images: Database['public']['Tables']['artwork_images']['Row'][];
  artist?: {
    id: string;
    name: string;
    profile_image_url?: string;
  };
};

export default function EditArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const artworkId = params.id as string;

  useEffect(() => {
    async function loadArtwork() {
      try {
        setLoading(true);
        const artworkData = await artworkService.getById(artworkId);
        if (artworkData) {
          setArtwork(artworkData);
        } else {
          setError('작품을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to load artwork:', err);
        setError('작품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    if (artworkId) {
      loadArtwork();
    }
  }, [artworkId]);

  const handleSuccess = (updatedArtwork: Artwork) => {
    alert(`작품 "${updatedArtwork.title}"이 성공적으로 수정되었습니다.`);
    router.push('/admin/artworks');
  };

  const handleCancel = () => {
    router.push('/admin/artworks');
  };

  const handleDelete = async () => {
    if (!artwork) return;
    
    if (!confirm(`정말로 작품 "${artwork.title}"을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await artworkService.delete(artwork.id);
      alert('작품이 성공적으로 삭제되었습니다.');
      router.push('/admin/artworks');
    } catch (error) {
      console.error('Failed to delete artwork:', error);
      alert('작품 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">작품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/admin/artworks')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  작품 목록으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/admin" className="hover:text-gray-700">관리자</a>
          <span>/</span>
          <a href="/admin/artworks" className="hover:text-gray-700">작품 관리</a>
          <span>/</span>
          <span className="text-gray-900">{artwork.title} 수정</span>
        </nav>

        <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">작품 수정</h1>
            <p className="text-gray-600 mt-2">
              "{artwork.title}" 작품 정보를 수정합니다.
            </p>
          </div>
          
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            작품 삭제
          </button>
        </div>
      </div>

      {/* Form */}
      <ArtworkForm 
        artwork={artwork}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEditing={true}
      />

      {/* Current Images Display */}
      {artwork && (
        <CurrentArtworkImages artworkId={artwork.id} />
      )}
    </div>
  );
}

// Component to display current artwork images
function CurrentArtworkImages({ artworkId }: { artworkId: string }) {
  const [artworkWithImages, setArtworkWithImages] = useState<ArtworkWithImages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtworkImages() {
      try {
        const data = await artworkService.getById(artworkId);
        setArtworkWithImages(data);
      } catch (error) {
        console.error('Failed to load artwork images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArtworkImages();
  }, [artworkId]);

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;

    try {
      await artworkService.deleteImage(imageId);
      // Refresh the images
      const updatedArtwork = await artworkService.getById(artworkId);
      setArtworkWithImages(updatedArtwork);
      alert('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">현재 작품 이미지</h3>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-md bg-gray-300 h-24 w-24"></div>
          <div className="rounded-md bg-gray-300 h-24 w-24"></div>
        </div>
      </div>
    );
  }

  if (!artworkWithImages?.images || artworkWithImages.images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">현재 작품 이미지</h3>
        <p className="text-gray-500">등록된 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        현재 작품 이미지 ({artworkWithImages.images.length}개)
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworkWithImages.images.map((image, index) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img
                src={image.image_url}
                alt={image.alt_text || `Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Info */}
            <div className="mt-2">
              {image.is_primary && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  대표 이미지
                </span>
              )}
              <p className="text-xs text-gray-500 mt-1">
                순서: {image.display_order}
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteImage(image.id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              title="이미지 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}