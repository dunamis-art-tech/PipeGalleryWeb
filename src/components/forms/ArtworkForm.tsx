'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artworkCreateSchema, type ArtworkFormData } from '@/lib/validations/artwork';
import { artworkService } from '@/lib/api/artworks';
import { artistService } from '@/lib/api/artists';
import { uploadFiles, STORAGE_BUCKETS } from '@/lib/utils/upload';
import type { Database } from '@/types/database';

type Artist = Database['public']['Tables']['artists']['Row'];
type Artwork = Database['public']['Tables']['artworks']['Row'];

interface ArtworkFormProps {
  artwork?: Artwork;
  onSuccess?: (artwork: Artwork) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export default function ArtworkForm({ 
  artwork, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: ArtworkFormProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkCreateSchema),
    defaultValues: {
      artist_id: artwork?.artist_id || '',
      title: artwork?.title || '',
      year: artwork?.year || undefined,
      materials: artwork?.materials || '',
      dimensions: artwork?.dimensions || '',
      description: artwork?.description || '',
      is_featured: artwork?.is_featured || false
    }
  });

  const selectedArtistId = watch('artist_id');

  // Load artists on component mount
  useEffect(() => {
    async function loadArtists() {
      try {
        const artistList = await artistService.getAll({ sort_by: 'name' });
        setArtists(artistList);
      } catch (error) {
        console.error('Failed to load artists:', error);
      }
    }
    loadArtists();
  }, []);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: ArtworkFormData) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Create or update artwork
      let artworkResult: Artwork;
      
      if (isEditing && artwork) {
        artworkResult = await artworkService.update(artwork.id, data);
      } else {
        artworkResult = await artworkService.create(data);
      }

      // Upload images if any were selected
      if (selectedFiles.length > 0) {
        const uploadResults = await uploadFiles(
          selectedFiles,
          STORAGE_BUCKETS.ARTWORKS,
          `artwork_${artworkResult.id}`,
          (completed, total) => {
            setUploadProgress((completed / total) * 100);
          }
        );

        // Save successful uploads to database
        const successfulUploads = uploadResults.filter(result => result.success);
        
        for (let i = 0; i < successfulUploads.length; i++) {
          const upload = successfulUploads[i];
          if (upload.publicUrl) {
            await artworkService.createImageRecord(artworkResult.id, {
              image_url: upload.publicUrl,
              alt_text: `${artworkResult.title} - Image ${i + 1}`,
              is_primary: i === 0, // First image is primary
              display_order: i
            });
          }
        }
      }

      // Reset form and call success callback
      reset();
      setSelectedFiles([]);
      onSuccess?.(artworkResult);

    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('작품 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const selectedArtist = artists.find(artist => artist.id === selectedArtistId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? '작품 수정' : '새 작품 등록'}
        </h2>
        <p className="text-gray-600 mt-1">
          작품의 기본 정보를 입력하고 이미지를 업로드하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Artist Selection */}
        <div>
          <label htmlFor="artist_id" className="block text-sm font-medium text-gray-700 mb-2">
            작가 선택 *
          </label>
          <select
            {...register('artist_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">작가를 선택하세요</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          {errors.artist_id && (
            <p className="mt-1 text-sm text-red-600">{errors.artist_id.message}</p>
          )}
        </div>

        {/* Selected Artist Info */}
        {selectedArtist && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center space-x-3">
              {selectedArtist.profile_image_url && (
                <img
                  src={selectedArtist.profile_image_url}
                  alt={selectedArtist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{selectedArtist.name}</p>
                {selectedArtist.biography && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {selectedArtist.biography}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Artwork Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            작품 제목 *
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="작품 제목을 입력하세요"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Year and Dimensions Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              제작연도
            </label>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 2024"
              min="1800"
              max={new Date().getFullYear()}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
              크기
            </label>
            <input
              type="text"
              {...register('dimensions')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 100 x 80 cm"
            />
            {errors.dimensions && (
              <p className="mt-1 text-sm text-red-600">{errors.dimensions.message}</p>
            )}
          </div>
        </div>

        {/* Materials */}
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
            재료/기법
          </label>
          <input
            type="text"
            {...register('materials')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="예: Oil on canvas, Mixed media"
          />
          {errors.materials && (
            <p className="mt-1 text-sm text-red-600">{errors.materials.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            작품 설명
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="작품에 대한 상세한 설명을 입력하세요"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Featured Checkbox */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('is_featured')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">추천 작품으로 설정</span>
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            작품 이미지
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="artwork-images"
            />
            <label
              htmlFor="artwork-images"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                클릭하여 이미지를 업로드하거나 드래그앤드롭하세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP, GIF 파일, 최대 50MB
              </p>
            </label>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                선택된 파일 ({selectedFiles.length}개)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {file.name}
                    </p>
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        대표 이미지
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
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

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : isEditing ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}