'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  UserGroupIcon, 
  PhotoIcon, 
  CameraIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

interface RecentActivity {
  type: string;
  message: string;
  time: string;
}

interface Stats {
  artists: number;
  artworks: number;
  exhibitions: number;
  recentActivity: RecentActivity[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    artists: 0,
    artworks: 0,
    exhibitions: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Mock data for demo
    setStats({
      artists: 12,
      artworks: 48,
      exhibitions: 6,
      recentActivity: [
        { type: 'artwork', message: '새 작품 "Spring Garden"이 등록되었습니다.', time: '2시간 전' },
        { type: 'exhibition', message: '전시 "Modern Art Showcase"가 수정되었습니다.', time: '5시간 전' },
        { type: 'artist', message: '작가 "김예술"이 추가되었습니다.', time: '1일 전' },
      ]
    });
  }, []);

  const quickActions = [
    {
      title: '새 작품 등록',
      description: '갤러리에 새로운 작품을 추가합니다.',
      href: '/admin/artworks/new',
      icon: PhotoIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: '새 작가 등록',
      description: '새로운 작가를 등록합니다.',
      href: '/admin/artists/new',
      icon: UserGroupIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: '새 전시 등록',
      description: '새로운 전시를 계획하고 등록합니다.',
      href: '/admin/exhibitions/new',
      icon: CameraIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">갤러리의 전체 현황을 확인하고 관리하세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">등록된 작가</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.artists}명</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/artists" className="text-sm text-blue-600 hover:text-blue-500">
              작가 관리 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PhotoIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">등록된 작품</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.artworks}개</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/artworks" className="text-sm text-green-600 hover:text-green-500">
              작품 관리 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CameraIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">진행 중인 전시</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.exhibitions}개</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/exhibitions" className="text-sm text-purple-600 hover:text-purple-500">
              전시 관리 →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">월간 방문자</dt>
                <dd className="text-lg font-medium text-gray-900">1,234명</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600">
              통계 보기 →
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${action.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">최근 활동</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentActivity.map((activity, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== stats.recentActivity.length - 1 && (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center ring-8 ring-white">
                            {activity.type === 'artwork' && <PhotoIcon className="h-5 w-5 text-white" />}
                            {activity.type === 'exhibition' && <CameraIcon className="h-5 w-5 text-white" />}
                            {activity.type === 'artist' && <UserGroupIcon className="h-5 w-5 text-white" />}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">시스템 상태</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">데이터베이스</span>
                <span className="text-sm font-medium text-green-600">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">스토리지</span>
                <span className="text-sm font-medium text-green-600">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">마지막 백업</span>
                <span className="text-sm text-gray-900">2시간 전</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">디스크 사용량</span>
                <span className="text-sm text-gray-900">45%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}