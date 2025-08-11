'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Exhibition', href: '/exhibitions' },
    { name: 'Artist', href: '/artists' },
    { name: 'Video', href: '/videos' },
    { name: 'About', href: '/about' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/pipegallery_official',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
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
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <header className="w-full h-20 bg-white border-b border-gray-300">
      <div className="px-10 flex items-center justify-between h-full">
        {/* Left Navigation */}
        <nav className="flex items-center space-x-20">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-black text-xl font-extralight tracking-tight hover:opacity-70 transition-opacity ${
                  isActive ? 'opacity-100' : ''
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Centered Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-black text-2xl font-bold tracking-wide">
            PIPE GALLERY
          </Link>
        </div>

        {/* Right Side - Language & Social */}
        <div className="flex items-center space-x-6">
          {/* Language Toggle */}
          <div className="flex items-center space-x-1">
            <button className="text-black text-xl font-medium tracking-tight">EN</button>
            <span className="text-black text-xl font-extralight tracking-tight">/</span>
            <button className="text-black text-xl font-extralight tracking-tight hover:font-medium transition-all cursor-pointer">KR</button>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {/* Instagram Icon */}
            <a
              href="https://instagram.com/pipegallery_official"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              aria-label="Instagram"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </a>
            
            {/* YouTube Icon */}
            <a
              href="https://youtube.com/@pipegallery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-6 bg-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
              aria-label="YouTube"
            >
              <div className="w-3 h-3 bg-white transform rotate-45"></div>
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-black hover:opacity-70"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-300">
          <div className="px-10 py-4 space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-black text-lg font-extralight tracking-tight hover:opacity-70 transition-opacity ${
                    isActive ? 'opacity-100' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}