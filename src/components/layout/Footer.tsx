'use client';

import Link from 'next/link';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { translations } from '@/contexts/LanguageContext';

export default function Footer() {
  // Use English translations as default since providers are not currently active
  const t = translations['en'];
  
  const navigation = {
    main: [
      { name: t.exhibitions, href: '/exhibitions' },
      { name: t.artists, href: '/artists' },
      { name: t.videos, href: '/videos' },
      { name: t.news, href: '/news' },
      { name: t.about, href: '/about' },
    ],
    social: [
      {
        name: 'Instagram',
        href: 'https://instagram.com/pipegallery_official',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.017 0C8.396 0 7.929.01 6.71.048 5.493.087 4.73.222 4.058.42a5.916 5.916 0 0 0-2.134 1.396A5.916 5.916 0 0 0 .42 4.058C.222 4.73.087 5.493.048 6.71.01 7.929 0 8.396 0 12.017c0 3.624.01 4.09.048 5.309.039 1.217.174 1.98.372 2.652a5.916 5.916 0 0 0 1.396 2.134 5.916 5.916 0 0 0 2.134 1.396c.672.198 1.435.333 2.652.372 1.219.038 1.685.048 5.309.048 3.624 0 4.09-.01 5.309-.048 1.217-.039 1.98-.174 2.652-.372a5.916 5.916 0 0 0 2.134-1.396 5.916 5.916 0 0 0 1.396-2.134c.198-.672.333-1.435.372-2.652.038-1.219.048-1.685.048-5.309 0-3.624-.01-4.09-.048-5.309-.039-1.217-.174-1.98-.372-2.652a5.916 5.916 0 0 0-1.396-2.134A5.916 5.916 0 0 0 19.898.42C19.226.222 18.463.087 17.246.048 16.027.01 15.56 0 11.936 0h.081zm-.081 1.802c3.55 0 3.974.01 5.378.048 1.297.059 2.003.277 2.473.46.622.242 1.067.532 1.533.998.466.466.756.911.998 1.533.183.47.401 1.176.46 2.473.038 1.404.048 1.828.048 5.378 0 3.55-.01 3.974-.048 5.378-.059 1.297-.277 2.003-.46 2.473a4.114 4.114 0 0 1-.998 1.533 4.114 4.114 0 0 1-1.533.998c-.47.183-1.176.401-2.473.46-1.404.038-1.828.048-5.378.048-3.55 0-3.974-.01-5.378-.048-1.297-.059-2.003-.277-2.473-.46a4.114 4.114 0 0 1-1.533-.998 4.114 4.114 0 0 1-.998-1.533c-.183-.47-.401-1.176-.46-2.473-.038-1.404-.048-1.828-.048-5.378 0-3.55.01-3.974.048-5.378.059-1.297.277-2.003.46-2.473.242-.622.532-1.067.998-1.533a4.114 4.114 0 0 1 1.533-.998c.47-.183 1.176-.401 2.473-.46 1.404-.038 1.828-.048 5.378-.048z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'YouTube',
        href: 'https://youtube.com/@pipegallery',
        icon: (props: any) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    ],
  };
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              PipeGallery
            </Link>
            <p className="text-sm text-gray-600 max-w-md">
              {t.companyInfo}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>{t.address}:</strong> 서울특별시 종로구 삼청로 123</p>
              <p><strong>{t.phone}:</strong> +82-2-1234-5678</p>
              <p><strong>{t.email}:</strong> info@pipegallery.com</p>
            </div>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation & Contact */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:col-span-2 xl:mt-0">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Quick Links
              </h3>
              <ul role="list" className="mt-4 space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Visit Info */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                {t.subscribeNewsletter}
              </h3>
              <div className="mb-6">
                <NewsletterForm />
              </div>
              
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                {t.galleryVisit}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>{t.hours}:</strong></p>
                <p>{t.visitHours}</p>
                <p>{t.closed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} PipeGallery. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}