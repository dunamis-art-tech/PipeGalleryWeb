# PipeGallery Development Setup

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📋 Environment Configuration

### Local Development (Default)
```bash
# .env.local - No Supabase connection needed
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

### Production Setup
1. Create Supabase project: https://supabase.com/dashboard
2. Update environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```
3. Run database migrations:
```bash
npx supabase db push
```

## 🛠 Available Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
npm run type-check   # TypeScript validation
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js 15 App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utilities and services
└── types/               # TypeScript definitions
```

## 🎯 Current Status

- ✅ Build successful
- ✅ All pages working
- ✅ Ready for deployment
- 📦 Deployed: [GitHub Repository](https://github.com/dunamis-art-tech/PipeGalleryWeb)

For detailed setup instructions, see STORAGE_SETUP.md