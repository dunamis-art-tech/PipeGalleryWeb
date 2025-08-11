'use client';

import { useTranslation } from '@/contexts/LanguageContext';

export default function GalleryVisitInfo() {
  const t = useTranslation();

  const visitInfo = [
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t.hours,
      details: [t.visitHours, t.closed],
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t.contact,
      details: [
        `${t.email}: info@pipegallery.com`,
        `${t.phone}: +82-2-1234-5678`,
      ],
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t.address,
      details: [
        '서울특별시 종로구 삼청로 123',
        'Seoul, South Korea',
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {visitInfo.map((info, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-blue-600">
              {info.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {info.title}
            </h3>
          </div>
          <div className="space-y-1">
            {info.details.map((detail, detailIndex) => (
              <p key={detailIndex} className="text-gray-600 text-sm">
                {detail}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}