# PipeGallery Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
The `.env.local` file has been configured with local development settings:
```bash
# Local Supabase Development (default)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Development Server
```bash
npm run dev
```
- Server will run on http://localhost:3000 (or 3001 if 3000 is busy)
- Environment variables are automatically loaded from `.env.local`

## 📋 Setup Options

### Option A: Local Development with Mock Data
**Current Setup** - Ready to use immediately:
- Environment variables configured for local URLs
- No external dependencies required
- Perfect for UI development and testing

### Option B: Local Supabase with Docker
For full database functionality:

1. **Install Docker Desktop**
2. **Start Local Supabase**:
   ```bash
   npx supabase start
   ```
3. **Run Migrations**:
   ```bash
   npx supabase migration up
   ```
4. **Development Server**:
   ```bash
   npm run dev
   ```

### Option C: Production Supabase Project
For production or cloud development:

1. **Create Supabase Project**: https://supabase.com/dashboard
2. **Get API Credentials**: Go to Settings → API
3. **Update `.env.local`**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
4. **Run Migrations** (optional):
   ```bash
   # Connect to your project first
   npx supabase link --project-ref your-project-id
   npx supabase db push
   ```

## 🛠 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database (when using local Supabase)
npx supabase start   # Start local Supabase
npx supabase stop    # Stop local Supabase
npx supabase status  # Check services status
```

## 🔧 Troubleshooting

### Issue: "Your project's URL and Key are required"
**Solution**: Ensure `.env.local` exists with proper values (✅ **Already Fixed**)

### Issue: Docker daemon not running
**Solution**: 
1. Install Docker Desktop
2. Start Docker
3. Run `npx supabase start`

### Issue: Port already in use
**Solution**: Next.js automatically finds available port (3001, 3002, etc.)

## 📁 Project Structure

```
├── .env.local           # Environment variables (✅ Created)
├── .env.example         # Template for environment vars
├── docs/
│   ├── Claude.md        # Claude assistant context
│   ├── PRD.md          # Product requirements
│   ├── Planning.md     # Technical architecture
│   ├── Tasks.md        # Development tasks
│   └── SETUP.md        # This file
├── supabase/           # Database configuration
│   ├── config.toml     # Local Supabase settings
│   ├── migrations/     # Database migrations
│   └── seed.sql        # Sample data
└── src/                # Application source code
```

## 🎯 Current Status

- ✅ Environment configured for local development
- ✅ Development server working
- ✅ All TypeScript issues resolved
- ✅ Build process successful
- 🏗️ Ready for feature development

## 📞 Next Steps

1. **Start Development**: `npm run dev` (✅ **Working**)
2. **Access Application**: http://localhost:3001
3. **Begin Feature Work**: See Tasks.md for next priorities
4. **Optional**: Set up local Supabase for database features