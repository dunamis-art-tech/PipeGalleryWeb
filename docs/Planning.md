# Planning.md - Contemporary Art Gallery Website Project Planning

## Project Overview
Contemporary art gallery website with public viewing interface and admin content management system.

## Technology Stack & Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router with TypeScript)
- **Language**: TypeScript (type safety and better developer experience)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **State Management**: Zustand (lightweight, less boilerplate than Redux)
- **Form Handling**: React Hook Form + Zod (performance + validation)
- **Image Optimization**: Next.js Image component (automatic WebP/AVIF conversion)
- **SEO**: Built-in Next.js SSR/SSG capabilities

### Backend & Database
- **BaaS**: Supabase
  - PostgreSQL database with real-time subscriptions
  - Built-in authentication and authorization (RLS)
  - File storage with CDN
  - Edge Functions for server-side logic
- **API Architecture**: RESTful with real-time subscriptions
- **File Storage**: Supabase Storage (images, documents)

### External APIs & Services
- **YouTube API v3**: Video metadata and embedding
- **Instagram Basic Display API**: Social media integration
- **Google Maps JavaScript API**: Location services
- **Email Service**: Supabase Auth + Custom SMTP (newsletter)

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest + React Testing Library
- **Version Control**: Git with conventional commits
- **CI/CD**: Vercel (automatic deployments)

### Deployment & Monitoring
- **Frontend Hosting**: Vercel (optimized for Next.js)
- **Backend**: Supabase Cloud
- **Monitoring**: Vercel Analytics (performance tracking)
- **Analytics**: Google Analytics 4
- **Performance**: Lighthouse CI + Vercel Speed Insights

## System Architecture

### Data Flow Architecture
```
User Interface (Next.js App Router)
    ↓
State Management (Zustand)
    ↓
API Layer (Supabase Client + Next.js API Routes)
    ↓
Database (PostgreSQL) + Storage + Auth
    ↓
External APIs (YouTube, Instagram, Maps)
```

### Security Architecture
- **Authentication**: Supabase Auth (JWT tokens)
- **Authorization**: Row Level Security (RLS) policies
- **Data Validation**: Zod schemas on client + database constraints
- **API Security**: Rate limiting, CORS, input sanitization
- **File Upload**: Type validation, size limits, secure storage

### Performance Architecture
- **Caching Strategy**:
  - Server-side: Next.js built-in caching (ISR, Static Generation)
  - Client-side: Automatic React Query integration with Supabase
  - CDN: Vercel Edge Network for static assets
  - Database: Proper indexing and query optimization
- **Image Optimization**: Next.js Image component with automatic formats
- **Code Splitting**: Route-based lazy loading (built-in with App Router)
- **Bundle Optimization**: Tree shaking and dead code elimination

## Database Design

### Core Entity Relationships
```
exhibitions (1:N) → exhibition_images
exhibitions (M:N) → artists (through exhibition_artists)
artists (1:N) → artist_images
videos (M:1) → exhibitions (optional)
videos (M:1) → artists (optional)
news_posts (Instagram integration)
newsletter_subscribers (email management)
site_settings (configuration)
```

### Storage Strategy
- **Images**: Supabase Storage with automatic optimization
- **Videos**: YouTube embedding (no local storage)
- **Backups**: Automated daily backups via Supabase
- **CDN**: Global distribution through Supabase CDN + Vercel Edge

## Scalability Planning

### Performance Scalability
- **Database**: Connection pooling, read replicas if needed
- **Frontend**: Static generation for public pages (SSG)
- **Images**: Next.js automatic optimization and lazy loading
- **Caching**: Multi-level caching strategy (Vercel + Supabase)

### Content Scalability
- **Multiple Galleries**: Database structure supports multi-tenancy
- **Internationalization**: i18n-ready structure (Korean primary)
- **Rich Media**: Support for various file types and formats
- **API Limits**: Proper error handling and fallbacks

### User Scalability
- **Admin Users**: Role-based access control ready
- **Public Traffic**: CDN and caching for high traffic
- **Mobile Users**: Progressive Web App capabilities

## Development Methodology

### Project Phases
1. **Foundation** (Week 1-3): Setup, database, basic navigation
2. **Core Features** (Week 4-8): Public pages, content display
3. **Integrations** (Week 9-12): External APIs, admin panel
4. **Polish** (Week 13-14): Testing, optimization, deployment

### Code Organization Principles
- **App Router Structure**: Next.js 15 file-based routing
- **Feature-based Components**: Group by functionality
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data
- **Reusability**: Component library approach
- **Type Safety**: Comprehensive TypeScript types

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes group
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes (for external API integrations)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── gallery/          # Gallery-specific components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Configuration and utilities
│   ├── supabase.ts       # Supabase client
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
└── types/                # TypeScript type definitions
```

### Testing Strategy
- **Unit Tests**: Utility functions, hooks, business logic
- **Integration Tests**: API services, database operations
- **E2E Tests**: Critical user journeys (admin workflows)
- **Visual Tests**: Component snapshots for UI consistency
- **Performance Tests**: Core Web Vitals monitoring with Vercel

## Third-Party Integration Planning

### YouTube Integration
- **API Quota Management**: 10,000 units/day limit
- **Data Caching**: Store metadata to reduce API calls
- **Fallback Strategy**: Manual video data entry option
- **Auto-sync**: Scheduled updates for channel content

### Instagram Integration
- **OAuth Flow**: Proper token management and refresh
- **Rate Limiting**: Respect API limits (200 requests/hour)
- **Content Filtering**: Admin controls for post visibility
- **Manual Override**: Ability to add posts manually

### Google Maps Integration
- **API Key Security**: Restrict by HTTP referrer
- **Custom Styling**: Match gallery branding
- **Mobile Optimization**: Touch-friendly interactions
- **Accessibility**: Keyboard navigation support

## Security & Privacy Planning

### Data Protection
- **GDPR Compliance**: User consent and data deletion rights
- **Email Privacy**: Newsletter unsubscribe mechanisms
- **Image Rights**: Proper attribution and usage tracking
- **Admin Access**: Multi-factor authentication for sensitive operations

### Content Security
- **Input Validation**: All user inputs sanitized and validated
- **File Upload Security**: Type checking, malware scanning
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Prevention**: Proper output encoding

## Maintenance & Support Planning

### Content Management
- **Regular Updates**: Exhibition data, artist information
- **Media Management**: Image optimization and cleanup
- **Backup Strategy**: Automated daily backups
- **Version Control**: Track changes to critical content

### Technical Maintenance
- **Dependency Updates**: Regular security patches
- **Performance Monitoring**: Monthly performance reviews
- **Error Monitoring**: Real-time error tracking with Vercel
- **API Monitoring**: External service health checks

### Support Documentation
- **Admin Manual**: Step-by-step content management guide
- **Technical Documentation**: API references and deployment guides
- **Troubleshooting Guide**: Common issues and solutions
- **User Feedback System**: Bug reporting and feature requests

## Risk Assessment & Mitigation

### Technical Risks
- **API Dependencies**: Multiple fallback strategies
- **Database Performance**: Monitoring and optimization plans
- **Third-party Changes**: Regular API health checks
- **Security Vulnerabilities**: Automated security scanning

### Business Risks
- **Content Ownership**: Clear licensing agreements
- **Data Loss**: Comprehensive backup strategy
- **Service Interruptions**: Monitoring and alert systems
- **Budget Overruns**: Cost monitoring and optimization

## Future Enhancement Opportunities

### Phase 2 Features (Post-Launch)
- **Multi-language Support**: English, Chinese, Japanese
- **Advanced Search**: Full-text search with filters
- **Social Features**: User accounts, favorites, sharing
- **E-commerce Integration**: Artwork sales platform

### Technical Enhancements
- **Progressive Web App**: Offline capabilities
- **AI Integration**: Automated content tagging
- **Advanced Analytics**: User behavior tracking
- **Mobile App**: Native iOS/Android versions using React Native

This planning document serves as the technical and strategic foundation for the project and should be referenced during major architectural decisions.