import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const handleSignOut = () => {
    // TODO: Implement proper logout after deployment
    alert('로그아웃 기능은 향후 구현될 예정입니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Gallery Admin
              </h1>
              <span className="text-sm text-gray-500">관리자 페이지</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Admin Navigation */}
              <nav className="flex space-x-6">
                <a 
                  href="/admin" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  대시보드
                </a>
                <a 
                  href="/admin/artists" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  작가 관리
                </a>
                <a 
                  href="/admin/artworks" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  작품 관리
                </a>
                <a 
                  href="/admin/exhibitions" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  전시 관리
                </a>
                <a 
                  href="/" 
                  className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
                >
                  사이트 보기
                </a>
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <div className="text-sm">
                  <span className="text-gray-500">안녕하세요,</span>
                  <span className="text-gray-900 font-medium ml-1">
                    관리자
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}