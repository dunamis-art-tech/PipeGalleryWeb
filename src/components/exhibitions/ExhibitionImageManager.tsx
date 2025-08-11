'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  PhotoIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { exhibitionImageService, EXHIBITION_IMAGE_TYPE_LABELS } from '@/lib/api/exhibition-images';
import { uploadFiles, STORAGE_BUCKETS } from '@/lib/utils/upload';
import { 
  exhibitionImageFormSchema, 
  imageTypeOptions,
  type ExhibitionImageFormData 
} from '@/lib/validations/exhibition-image';
import type { Database } from '@/types/database';

type ExhibitionImage = Database['public']['Tables']['exhibition_images']['Row'];

interface ExhibitionImageManagerProps {
  exhibitionId: string;
  onImagesChange?: (images: ExhibitionImage[]) => void;
  allowedTypes?: string[];
  maxImagesPerType?: number;
  showStats?: boolean;
}

export default function ExhibitionImageManager({
  exhibitionId,
  onImagesChange,
  allowedTypes = ['poster', 'artwork', 'installation', 'detail', 'opening', 'space'],
  maxImagesPerType = 10,
  showStats = true
}: ExhibitionImageManagerProps) {
  const [images, setImages] = useState<ExhibitionImage[]>([]);
  const [groupedImages, setGroupedImages] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedType, setSelectedType] = useState(allowedTypes[0]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingImage, setEditingImage] = useState<ExhibitionImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'grouped'>('grouped');

  // Form for editing image metadata
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ExhibitionImageFormData>({
    resolver: zodResolver(exhibitionImageFormSchema)
  });

  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, [exhibitionId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const [allImages, grouped] = await Promise.all([
        exhibitionImageService.getByExhibitionId({ 
          exhibition_id: exhibitionId,
          sort_by: 'image_type'
        }),
        exhibitionImageService.getGroupedByType(exhibitionId)
      ]);
      
      setImages(allImages);
      setGroupedImages(grouped);
      onImagesChange?.(allImages);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Upload images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload files to storage
      const uploadResults = await uploadFiles(
        selectedFiles,
        STORAGE_BUCKETS.EXHIBITIONS,
        `exhibition_${exhibitionId}/${selectedType}`,
        (completed, total) => {
          setUploadProgress((completed / total) * 100);
        }
      );

      // Create image records for successful uploads
      const successfulUploads = uploadResults.filter(result => result.success);
      const imagePromises = successfulUploads.map(async (upload, index) => {
        if (upload.publicUrl) {
          return await exhibitionImageService.create({
            exhibition_id: exhibitionId,
            image_url: upload.publicUrl,
            alt_text: `${EXHIBITION_IMAGE_TYPE_LABELS[selectedType as keyof typeof EXHIBITION_IMAGE_TYPE_LABELS]} ${index + 1}`,
            image_type: selectedType as any,
            display_order: (groupedImages[selectedType]?.length || 0) + index
          });
        }
      });

      await Promise.all(imagePromises);

      // Reload images
      await loadImages();
      setSelectedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete image
  const handleDeleteImage = async (image: ExhibitionImage) => {
    if (!confirm(`"${image.alt_text || '이미지'}"를 삭제하시겠습니까?`)) return;

    try {
      await exhibitionImageService.deleteImageWithStorage(image.id);
      await loadImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  // Start editing image
  const startEditImage = (image: ExhibitionImage) => {
    setEditingImage(image);
    setValue('alt_text', image.alt_text || '');
    setValue('display_order', image.display_order);
    setValue('image_type', image.image_type as any);
  };

  // Save image edits
  const saveImageEdits = async (data: ExhibitionImageFormData) => {
    if (!editingImage) return;

    try {
      await exhibitionImageService.update(editingImage.id, data);
      await loadImages();
      setEditingImage(null);
      reset();
    } catch (error) {
      console.error('Failed to update image:', error);
      alert('이미지 수정 중 오류가 발생했습니다.');
    }
  };

  // Move image order
  const moveImage = async (image: ExhibitionImage, direction: 'up' | 'down') => {
    const typeImages = groupedImages[image.image_type] || [];
    const currentIndex = typeImages.findIndex((img: ExhibitionImage) => img.id === image.id);
    
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === typeImages.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetImage = typeImages[targetIndex];

    try {
      // Swap display orders
      await Promise.all([
        exhibitionImageService.update(image.id, { display_order: targetImage.display_order }),
        exhibitionImageService.update(targetImage.id, { display_order: image.display_order })
      ]);

      await loadImages();
    } catch (error) {
      console.error('Failed to reorder images:', error);
      alert('이미지 순서 변경 중 오류가 발생했습니다.');
    }
  };

  // Set as poster image
  const setPosterImage = async (image: ExhibitionImage) => {
    if (!confirm('이 이미지를 전시 포스터로 설정하시겠습니까?')) return;

    try {
      await exhibitionImageService.setPosterImage(exhibitionId, image.id);
      await loadImages();
    } catch (error) {
      console.error('Failed to set poster image:', error);
      alert('포스터 이미지 설정 중 오류가 발생했습니다.');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const filteredTypeOptions = imageTypeOptions.filter(option => 
    allowedTypes.includes(option.value)
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">전시 이미지 관리</h3>
            <p className="text-sm text-gray-600">
              전시의 다양한 이미지를 카테고리별로 관리하세요.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 text-xs rounded ${viewMode === 'grouped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
            >
              그룹별
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
            >
              그리드
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
            >
              목록
            </button>
          </div>
        </div>

        {/* Stats */}
        {showStats && groupedImages.count && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <div className="text-lg font-semibold text-gray-900">
                {groupedImages.count.total}
              </div>
              <div className="text-xs text-gray-600">전체</div>
            </div>
            {Object.entries(groupedImages.count).map(([type, count]) => {
              if (type === 'total') return null;
              const label = EXHIBITION_IMAGE_TYPE_LABELS[type as keyof typeof EXHIBITION_IMAGE_TYPE_LABELS];
              return (
                <div key={type} className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-lg font-semibold text-gray-900">{count as number}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Image Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 타입
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filteredTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 선택
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Upload Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                업로드
              </label>
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '업로드 중...' : `업로드 (${selectedFiles.length}개)`}
              </button>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                선택된 파일 ({selectedFiles.length}개)
              </h4>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                업로드 진행률: {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Images Display */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          {filteredTypeOptions.map(typeOption => {
            const typeImages = groupedImages[typeOption.value] || [];
            return (
              <div key={typeOption.value} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {typeOption.label} ({typeImages.length}개)
                    </h4>
                    <p className="text-sm text-gray-600">{typeOption.description}</p>
                  </div>
                  
                  {typeImages.length >= maxImagesPerType && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      최대 {maxImagesPerType}개
                    </span>
                  )}
                </div>

                {typeImages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <PhotoIcon className="mx-auto h-12 w-12 mb-2" />
                    <p>등록된 {typeOption.label} 이미지가 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {typeImages.map((image: ExhibitionImage) => (
                      <ImageCard
                        key={image.id}
                        image={image}
                        onDelete={() => handleDeleteImage(image)}
                        onEdit={() => startEditImage(image)}
                        onMoveUp={() => moveImage(image, 'up')}
                        onMoveDown={() => moveImage(image, 'down')}
                        onSetPoster={() => setPosterImage(image)}
                        canMoveUp={image.display_order > 0}
                        canMoveDown={image.display_order < typeImages.length - 1}
                        isPoster={image.image_type === 'poster'}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">이미지 정보 수정</h3>
            
            <form onSubmit={handleSubmit(saveImageEdits)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 타입
                </label>
                <select
                  {...register('image_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {filteredTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.image_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.image_type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt 텍스트
                </label>
                <input
                  type="text"
                  {...register('alt_text')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이미지 설명을 입력하세요"
                />
                {errors.alt_text && (
                  <p className="mt-1 text-sm text-red-600">{errors.alt_text.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  표시 순서
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('display_order')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.display_order && (
                  <p className="mt-1 text-sm text-red-600">{errors.display_order.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingImage(null);
                    reset();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Image Card Component
interface ImageCardProps {
  image: ExhibitionImage;
  onDelete: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSetPoster: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isPoster: boolean;
}

function ImageCard({
  image,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onSetPoster,
  canMoveUp,
  canMoveDown,
  isPoster
}: ImageCardProps) {
  return (
    <div className="group relative bg-gray-50 rounded-lg overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={image.image_url}
          alt={image.alt_text || '전시 이미지'}
          fill
          className="object-cover"
          sizes="200px"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
              title="수정"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            
            {!isPoster && (
              <button
                onClick={onSetPoster}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                title="포스터로 설정"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={onDelete}
              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
              title="삭제"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isPoster && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              포스터
            </span>
          )}
          <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
            #{image.display_order}
          </span>
        </div>

        {/* Order controls */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
              title="위로 이동"
            >
              <ArrowUpIcon className="h-3 w-3" />
            </button>
          )}
          {canMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
              title="아래로 이동"
            >
              <ArrowDownIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Image info */}
      <div className="p-2">
        <p className="text-xs text-gray-600 truncate">
          {image.alt_text || '이미지'}
        </p>
      </div>
    </div>
  );
}