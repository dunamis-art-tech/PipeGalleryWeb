'use client';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  type?: 'poster' | 'video' | 'artist' | 'studio';
}

export default function PlaceholderImage({ 
  width = 400, 
  height = 300, 
  text, 
  className = "",
  type = 'poster'
}: PlaceholderImageProps) {
  const aspectRatio = width / height;
  
  const getPlaceholderContent = () => {
    switch (type) {
      case 'poster':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Abstract poster design inspired by "Heun (慣)" */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              {/* Top section with blurred text effect */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded blur-sm opacity-60"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 blur-sm opacity-40"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 blur-sm opacity-40"></div>
              </div>
              
              {/* Central exhibition title */}
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2 tracking-wider">
                    {text || 'Heun'}
                  </h2>
                  <div className="text-lg text-gray-600 font-light tracking-widest">
                    (慣)
                  </div>
                </div>
              </div>
              
              {/* Bottom section with more blurred elements */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3 blur-sm opacity-40"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 blur-sm opacity-40"></div>
                <div className="h-4 bg-gray-300 rounded w-full blur-sm opacity-60 mt-4"></div>
              </div>
            </div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  #000 20px,
                  #000 21px
                )`
              }}></div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600">{text || 'Artist Interview'}</p>
              <p className="text-sm text-gray-400 mt-1">Video Content</p>
            </div>
          </div>
        );
      case 'studio':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
            {/* Studio background with paintings */}
            <div className="absolute inset-0 p-4">
              {/* Background paintings/artworks */}
              <div className="absolute top-4 left-4 w-16 h-20 bg-gradient-to-br from-orange-200 to-red-300 opacity-80 rounded-sm transform rotate-3"></div>
              <div className="absolute top-8 right-6 w-12 h-16 bg-gradient-to-br from-blue-200 to-purple-300 opacity-70 rounded-sm transform -rotate-6"></div>
              <div className="absolute bottom-20 left-8 w-20 h-14 bg-gradient-to-br from-yellow-200 to-orange-300 opacity-60 rounded-sm transform rotate-1"></div>
              
              {/* Artist figure */}
              <div className="absolute bottom-8 left-1/3 transform -translate-x-1/2">
                {/* Head */}
                <div className="w-8 h-8 bg-orange-200 rounded-full mb-2"></div>
                {/* Body */}
                <div className="w-12 h-16 bg-white rounded-sm relative">
                  {/* Arms */}
                  <div className="absolute -left-2 top-2 w-3 h-8 bg-orange-100 rounded-full transform rotate-12"></div>
                  <div className="absolute -right-2 top-2 w-3 h-8 bg-orange-100 rounded-full transform -rotate-12"></div>
                </div>
                {/* Legs */}
                <div className="flex gap-1 justify-center">
                  <div className="w-2 h-8 bg-gray-600 rounded-full"></div>
                  <div className="w-2 h-8 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              
              {/* Studio furniture/easel */}
              <div className="absolute bottom-6 right-1/3 transform translate-x-1/2">
                <div className="w-6 h-12 bg-amber-800 rounded-sm"></div>
                <div className="absolute top-0 -left-1 w-8 h-10 bg-gray-100 border border-gray-300 rounded-sm"></div>
              </div>
              
              {/* Paint palette */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-4 bg-gray-200 rounded-full relative">
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-red-400 rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-0.5 left-2 w-1 h-1 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Soft lighting overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center">
            <p className="text-gray-500">{text || 'Image Placeholder'}</p>
          </div>
        );
    }
  };

  return (
    <div 
      className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspectRatio }}
    >
      {getPlaceholderContent()}
    </div>
  );
}