'use client';

import { createContext, useContext, useState, useEffect, ReactNode, startTransition } from 'react';

export type Language = 'en' | 'kr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Export the context for direct usage
export { LanguageContext };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference from localStorage without blocking UI
    const initLanguage = () => {
      const savedLanguage = localStorage.getItem('preferred-language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'kr')) {
        startTransition(() => {
          setLanguageState(savedLanguage);
        });
      }
    };

    // Use startTransition to prevent suspense during initialization
    startTransition(() => {
      initLanguage();
    });
  }, []);

  const setLanguage = (newLanguage: Language) => {
    startTransition(() => {
      setLanguageState(newLanguage);
      localStorage.setItem('preferred-language', newLanguage);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Safe fallback when no LanguageProvider is present
    return {
      language: 'en' as Language,
      setLanguage: (lang: Language) => {
        console.warn('LanguageProvider not found. Language change ignored.');
      }
    };
  }
  return context;
}

// Translation helper function
export const translations = {
  en: {
    home: 'Home',
    exhibitions: 'Exhibitions',
    artists: 'Artists',
    videos: 'Videos',
    news: 'News',
    about: 'About',
    currentExhibition: 'Current Exhibition',
    galleryVisit: 'Gallery Visit',
    hours: 'Hours',
    contact: 'Contact',
    subscribeNewsletter: 'Subscribe to Newsletter',
    enterEmail: 'Enter your email',
    subscribe: 'Subscribe',
    visitHours: 'Tuesday - Sunday: 10:00 AM - 6:00 PM',
    closed: 'Monday: Closed',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    interviewVideo: 'Artist Interview',
    companyInfo: 'Contemporary art gallery dedicated to showcasing emerging and established artists.',
  },
  kr: {
    home: '홈',
    exhibitions: '전시',
    artists: '작가',
    videos: '영상',
    news: '소식',
    about: '소개',
    currentExhibition: '현재 전시',
    galleryVisit: '갤러리 관람',
    hours: '운영시간',
    contact: '연락처',
    subscribeNewsletter: '뉴스레터 구독',
    enterEmail: '이메일을 입력하세요',
    subscribe: '구독',
    visitHours: '화요일 - 일요일: 오전 10:00 - 오후 6:00',
    closed: '월요일: 휴관',
    phone: '전화',
    email: '이메일',
    address: '주소',
    interviewVideo: '작가 인터뷰',
    companyInfo: '신진 및 기성 작가들을 소개하는데 전념하는 현대미술갤러리입니다.',
  },
};

export function useTranslation() {
  const { language } = useLanguage();
  return translations[language];
}