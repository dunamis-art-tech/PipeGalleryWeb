# PipeGallery - Technical Architecture

## 🎯 Project Overview
Korean Contemporary Art Gallery website with bilingual CMS capabilities.

**Stack**: Next.js 15 + TypeScript + Tailwind CSS + Supabase

## 🏗️ Architecture

### Frontend
- **Next.js 15 App Router** - File-based routing, RSC
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling  
- **React Hook Form + Zod** - Form validation

### Backend
- **Supabase** - Database, auth, storage
- **PostgreSQL** - RLS policies
- **API Routes** - Server-side logic

## 📊 Database Schema

### Core Tables
```sql
-- exhibitions: Gallery exhibitions
-- artists: Artist profiles and portfolios  
-- artworks: Artwork catalog with images
-- exhibition_images: Exhibition media gallery
-- site_settings: Configurable site content
```

## 🌐 Bilingual Support
- Korean (primary) / English (secondary)
- Database-level language columns
- Fallback: ko → en → default

## 📱 Responsive Design
- Mobile-first approach
- Tailwind breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

## ⚡ Performance 
- Next.js Image optimization
- Static generation where possible
- Supabase CDN for media

## 🚀 Deployment
- **Frontend**: Vercel
- **Backend**: Supabase Cloud
- **Repository**: GitHub with auto-deploy

## 📁 Structure
```
src/
├── app/           # Next.js pages
├── components/    # UI components
├── lib/           # Services & utilities
└── types/         # TypeScript definitions
```

## 🎯 Status
- ✅ **Foundation Complete**: UI, database, storage
- ✅ **Deployment Ready**: GitHub + Vercel setup
- 🚧 **Next Phase**: Full CMS implementation