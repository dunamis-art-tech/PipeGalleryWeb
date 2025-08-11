import { Metadata } from 'next';
import StorageTest from '@/components/ui/StorageTest';

export const metadata: Metadata = {
  title: 'Storage Test | PipeGallery Admin',
  description: 'Test Supabase Storage bucket functionality',
};

export default function StorageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Storage System Test</h1>
          <p className="text-gray-600 mt-2">
            Test and verify Supabase Storage bucket functionality for PipeGallery
          </p>
        </div>
        
        <StorageTest />
      </div>
    </div>
  );
}