'use client';

import { useState } from 'react';
import { StorageService, STORAGE_BUCKETS } from '@/lib/storage';

interface BucketHealth {
  exhibitions: boolean;
  artists: boolean;
  artworks: boolean;
  general: boolean;
}

export default function StorageTest() {
  const [bucketHealth, setBucketHealth] = useState<BucketHealth | null>(null);
  const [testing, setTesting] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');

  const testBucketHealth = async () => {
    setTesting(true);
    try {
      const health = await StorageService.checkBucketHealth();
      setBucketHealth(health);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const testFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadResult('업로드 중...');

    try {
      // Validate file first
      const validation = StorageService.validateFile(file);
      if (!validation.valid) {
        setUploadResult(`검증 실패: ${validation.error}`);
        return;
      }

      // Upload to general bucket for testing
      const result = await StorageService.uploadGeneralFile(file, 'test');
      
      if (result.success) {
        setUploadResult(`업로드 성공! URL: ${result.publicUrl}`);
      } else {
        setUploadResult(`업로드 실패: ${result.error}`);
      }
    } catch (error) {
      setUploadResult(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }

    // Reset file input
    event.target.value = '';
  };

  const getBucketStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getBucketStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Storage System Test</h2>
      
      {/* Bucket Health Check */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Bucket Health Check</h3>
          <button
            onClick={testBucketHealth}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? 'Testing...' : 'Test Buckets'}
          </button>
        </div>

        {bucketHealth && (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(bucketHealth).map(([bucket, status]) => (
              <div key={bucket} className="flex items-center justify-between p-3 border rounded-md">
                <span className="capitalize font-medium text-gray-700">{bucket}</span>
                <span className={`flex items-center gap-2 ${getBucketStatusColor(status)}`}>
                  {getBucketStatusIcon(status)}
                  <span>{status ? 'Healthy' : 'Error'}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Upload Test */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">File Upload Test</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an image file to test upload:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={testFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {uploadResult && (
            <div className="p-3 bg-gray-50 rounded-md border">
              <p className="text-sm text-gray-800">{uploadResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Storage Configuration Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration Info</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>Max File Size:</strong> 50MB</div>
          <div><strong>Supported Types:</strong> JPEG, PNG, WebP, GIF</div>
          <div><strong>Buckets:</strong> {Object.values(STORAGE_BUCKETS).join(', ')}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Ensure Supabase project is running</li>
          <li>Run the storage_setup.sql script in your Supabase SQL editor</li>
          <li>Click "Test Buckets" to verify setup</li>
          <li>Test file upload with a sample image</li>
        </ol>
      </div>
    </div>
  );
}