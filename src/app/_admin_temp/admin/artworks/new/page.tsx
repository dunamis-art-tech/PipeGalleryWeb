'use client';

import { useRouter } from 'next/navigation';
import ArtworkForm from '@/components/forms/ArtworkForm';
import type { Database } from '@/types/database';

type Artwork = Database['public']['Tables']['artworks']['Row'];

export default function NewArtworkPage() {
  const router = useRouter();

  const handleSuccess = (artwork: Artwork) => {
    alert(`작품 "${artwork.title}"이 성공적으로 등록되었습니다.`);
    router.push('/admin/artworks');
  };

  const handleCancel = () => {
    router.push('/admin/artworks');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/admin" className="hover:text-gray-700">관리자</a>
          <span>/</span>
          <a href="/admin/artworks" className="hover:text-gray-700">작품 관리</a>
          <span>/</span>
          <span className="text-gray-900">새 작품 등록</span>
        </nav>

        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">새 작품 등록</h1>
          <p className="text-gray-600 mt-2">
            새로운 작품의 정보를 입력하고 이미지를 업로드하세요.
          </p>
        </div>
      </div>

      {/* Form */}
      <ArtworkForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEditing={false}
      />

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">작품 등록 가이드</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>작가는 반드시 선택해야 합니다. 작가가 없다면 먼저 작가를 등록하세요.</li>
                <li>작품 제목은 필수 항목입니다.</li>
                <li>이미지는 여러 장 업로드할 수 있으며, 첫 번째 이미지가 대표 이미지가 됩니다.</li>
                <li>지원 파일 형식: JPEG, PNG, WebP, GIF (최대 50MB)</li>
                <li>추천 작품으로 설정하면 메인 페이지에 노출됩니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}