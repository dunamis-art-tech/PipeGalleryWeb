# Contemporary Art Gallery Website PRD (Product Requirements Document)

## 1. Project Overview

### 1.1 Project Purpose
Build a website that strengthens the contemporary art gallery's online presence and effectively delivers exhibition, artist, and gallery information to visitors

### 1.2 Technology Stack
- **Frontend**: Next.js 15 with TypeScript and App Router
- **Backend/Database**: Supabase (PostgreSQL, Authentication, Real-time subscriptions, Storage)
- **State Management**: Zustand for client state, React Context for UI state
- **Styling**: Tailwind CSS with PostCSS compilation (CRITICAL: postcss.config.js required)
- **Image Processing**: Next.js Image Optimization + Supabase Storage
- **Form Handling**: React Hook Form with Zod validation
- **External APIs**: YouTube API v3, Instagram Basic Display API, Google Maps JavaScript API
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Monitoring**: Vercel Analytics, Google Analytics 4

### 1.3 Target Users
- General visitors interested in contemporary art
- Art collectors and professionals
- Media and press personnel
- Gallery administrators (Admin)

---

## 2. Functional Requirements

### 2.1 Public User Pages

#### 2.1.1 Home Page
**Essential Components:**
- **Hero Exhibition Section**: Large typography display (text-8xl) with current exhibition info and poster
- **Post Section**: Artist interview content with studio imagery
- **Visit Section**: Gallery operating hours and visitor information
- **Contact Section**: Phone, email, and location details
- **Footer**: Integrated newsletter subscription, social media, gallery info

**Design Implementation:**
- **Wireframe-based Design**: Large scale typography matching provided wireframe
- **Typography Scale**: text-6xl to text-8xl for exhibition titles
- **Responsive Grid**: 2-column layouts on desktop, single column on mobile
- **PlaceholderImage System**: Temporary content simulation for posters and media
- **Modern Gallery Aesthetic**: Clean layouts with generous white space

**Features:**
- Responsive layout with mobile-first approach
- Newsletter subscription with email validation and Supabase storage
- Multi-language support (EN/KR) with safe fallback patterns
- SEO optimized with metadata API and structured data
- Real-time content updates via Supabase integration

#### 2.1.2 Exhibitions Page
**Essential Components:**
- **Exhibition List**: Categorized as ongoing/upcoming/past exhibitions
- **Exhibition Filtering**: Sort by date and status
- **Exhibition Detail Page**:
  - Exhibition title, artist name, exhibition period
  - Exhibition poster/artwork images
  - Exhibition description
  - Related artist information links
  - Related video links

**Features:**
- Exhibition search functionality
- Automatic categorization by exhibition status
- Image gallery view with lightbox
- SEO optimized individual exhibition pages

#### 2.1.3 Artists Page
**Essential Components:**
- **Artist List**: Gallery-affiliated/collaborative artist roster
- **Artist Detail CV Page**:
  - Artist profile image
  - Career information (education, solo exhibitions, group exhibitions, awards)
  - Artwork image gallery
  - Related exhibition information

**Features:**
- Artist name search functionality
- Alphabetical sorting
- Integration with related exhibitions
- SEO optimized artist profile pages

#### 2.1.4 Video Page
**Essential Components:**
- **Video List**: Thumbnail list of exhibition-related interview videos
- **Video Playback Page**:
  - YouTube embedded player
  - Video title and description
  - Related exhibition/artist information

**Features:**
- YouTube API integration
- Video categorization
- Video search functionality
- SEO optimized video pages

#### 2.1.5 News Page
**Essential Components:**
- **Instagram Post List**: Gallery official account post list
- **Post Detail View**:
  - Post images/videos
  - Caption content
  - Original Instagram link

**Features:**
- Instagram API integration
- Automatic latest post updates
- Chronological post sorting

#### 2.1.6 About Page
**Essential Components:**
- **Gallery Description**: Gallery history, vision, mission
- **Google Maps**: Gallery location information
- **Detailed Information**: Operating hours, closed days, admission fees, parking info
- **Contact Information**: Phone number, email, address

**Features:**
- Google Maps API integration
- Directions and accessibility information

### 2.2 Admin Panel (Content Management System)

#### 2.2.1 CMS Dashboard Philosophy
**Design Approach:**
- Clean, gallery-inspired interface prioritizing visual content management
- Workflow mirrors curatorial process from concept to publication
- Art-first design with generous whitespace and sophisticated typography
- Mobile-friendly admin interface for on-site content updates

**Dashboard Features:**
- Visual content overview with thumbnail previews
- Exhibition, artist, video, and news status summary
- Newsletter subscriber analytics with growth trends
- Recent activity feed with user-friendly timestamps
- Quick action buttons for common tasks

#### 2.2.2 Enhanced Exhibition Management
**Core CMS Features:**
- **Visual Content Management**: Drag-and-drop image uploads with automatic optimization
- **Real-time Preview**: Live preview of exhibition pages during editing
- **Advanced Status Control**: Draft → Scheduled → Live → Archived workflow
- **Auto-save**: Prevent content loss during editing sessions
- **Multi-Image Upload System**: Comprehensive image management beyond poster images

**Curator-Friendly Interface:**
- **WYSIWYG Rich Text Editor**: Visual editing for exhibition descriptions
- **Advanced Image Gallery Manager**: Reorderable image galleries with metadata and categorization
- **Artist Association**: Text-based artist attribution for exhibitions
- **Publication Scheduling**: Set future publication dates and times

**Enhanced Image Management:**
- **Image Categories**: Poster, artwork, installation views, detail shots, opening reception, gallery space
- **Batch Upload**: Multiple image upload with progress indicators
- **Image Reordering**: Drag-and-drop interface for image sequence management
- **Smart Cropping**: Automatic and manual cropping tools for different display contexts
- **Alt Text Management**: Accessibility-focused image descriptions
- **Display Priority**: Featured images and gallery highlight selection

**Input Fields & UX:**
- Exhibition title with live URL preview
- Artist selection with autocomplete and multi-artist support
- Exhibition period with calendar picker and validation
- Rich text description editor with image embedding
- **Multi-Image Upload Interface**:
  - Drag-and-drop zone for batch uploads
  - Image type selection (poster, artwork, installation, detail, opening, space)
  - Thumbnail preview grid with reorder functionality
  - Individual image metadata editing
  - Primary/poster image designation
- Artwork association with exhibition catalog preview
- SEO metadata with character count and preview

**Simplified Exhibition Model:**
- **Independent Exhibitions**: Exhibitions are self-contained entities with their own content
- **Single Poster Image**: Each exhibition has exactly one main poster image
- **Exhibition Gallery**: Multiple additional images (installation views, details, opening reception, space views)
- **Artist Attribution**: Text-based artist attribution without database linkage

#### 2.2.3 Enhanced Artist Management
**Advanced Artist Features:**
- **Portfolio Management**: Visual portfolio builder with drag-and-drop reordering
- **CV Builder**: Structured data entry with templates for education, exhibitions, awards
- **Representation Status**: Categorize as Represented, Exhibited, or Emerging artists
- **Career Tracking**: Timeline view of artist's career progression
- **Artwork Management**: Comprehensive artwork catalog with detailed metadata

**User Experience Enhancements:**
- **Profile Image Cropping**: Built-in image cropping and optimization
- **Bio Editor**: Rich text editor with formatting options
- **Achievement Timeline**: Chronological career milestone organization
- **Exhibition History**: Auto-populated from exhibition data

**Input Fields & Workflow:**
- Artist name with slug generation
- Profile image upload with cropping interface
- Structured CV data entry with validation
- Portfolio image management with metadata
- Artist statement rich text editor
- Representation status selection

#### 2.2.3.1 Artwork Management System
**Core Artwork Features:**
- **Artwork Creation**: Title, year, materials, dimensions, description, pricing
- **Image Management**: Multiple high-quality images per artwork with primary image selection
- **Featured Artwork**: Highlight important pieces for gallery promotion
- **Independent Artwork Management**: Artworks exist independently under artists

**Artwork Input Fields:**
- Artwork title with auto-generated slug
- Creation year (integer field)
- Materials and technique description
- Dimensions (flexible text field for various formats)
- Detailed artwork description with rich text
- Multiple image upload with drag-and-drop interface
- Primary image designation

**Artwork Display Features:**
- Artist portfolio integration
- Featured artwork showcase
- Search and filtering by title, year, materials, artist

#### 2.2.4 Enhanced Video Management
**Video CMS Features:**
- **YouTube Integration**: Auto-fetch metadata from YouTube URLs
- **Thumbnail Management**: Custom thumbnail upload with YouTube fallback
- **Video Categories**: Flexible categorization system
- **Content Association**: Link videos to exhibitions and artists
- **Visibility Controls**: Public/private/scheduled publishing

**User Experience:**
- **URL Validation**: Real-time YouTube URL validation and preview
- **Metadata Override**: Edit fetched titles and descriptions
- **Preview Player**: Embedded player for content review

#### 2.2.5 Enhanced News Management
**Instagram Integration:**
- **OAuth Authentication**: Streamlined Instagram account connection
- **Post Synchronization**: Automatic post fetching with manual override
- **Content Filtering**: Show/hide specific posts with bulk operations
- **Manual Post Addition**: Add posts not from Instagram

**Content Publishing:**
- **Post Categories**: Press Releases, Features, External News
- **Rich Media Support**: Images, videos, and document attachments
- **Publication Scheduling**: Schedule posts for future publication

**User-Friendly Features:**
- **Visual Post Manager**: Grid view of all posts with thumbnails
- **Bulk Operations**: Select multiple posts for batch actions

#### 2.2.6 Enhanced Content Management
**Page Management System:**
- **Flexible Page Builder**: Modular content blocks for About, Visit pages
- **Visual Editor**: WYSIWYG editing with live preview
- **Media Library**: Centralized asset management with tagging and search

**Site-wide Settings:**
- **Gallery Information**: Contact details, hours, location with Google Maps integration
- **Social Media**: Link management for all social platforms
- **Newsletter Management**: Subscriber analytics and export functionality
- **SEO Settings**: Global meta tags and structured data configuration

**Advanced CMS Features:**
- **User Role Management**: Curator, Editor, Admin permission levels
- **Audit Trail**: Track who made changes and when
- **Content Search**: Global search across all content types

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements
- Page loading time: Under 3 seconds
- Image optimization: Next.js automatic optimization with WebP/AVIF
- Mobile responsiveness: Smooth operation on all devices
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Image lazy loading implementation

### 3.2 Security Requirements
- Admin panel authentication system (Supabase Auth)
- Row Level Security (RLS) policies in Supabase
- HTTPS enforcement
- Input data validation and sanitization
- Rate limiting for API endpoints
- CORS configuration

### 3.3 Compatibility Requirements
- **Browsers**: Chrome, Safari, Firefox, Edge (latest versions)
- **Devices**: Desktop, tablet, mobile
- **Screen Resolution**: 320px ~ 2560px
- **iOS/Android**: Support for mobile browsers

### 3.4 Accessibility Requirements
- WCAG 2.1 AA level compliance
- Keyboard navigation support
- Screen reader compatibility
- Alt text for all images
- Color contrast ratio compliance

### 3.5 SEO Requirements
- Server-side rendering (SSR) with Next.js
- Static Site Generation (SSG) for public pages
- Meta tags optimization
- Open Graph and Twitter Card support
- Structured data markup (JSON-LD)
- XML sitemap generation
- Automatic robots.txt

---

## 4. Database Schema (Supabase)

### 4.1 Core Tables

#### exhibitions
```sql
- id (uuid, primary key)
- title (text)
- artist_name (text)
- description (text)
- start_date (date)
- end_date (date)
- status (enum: draft, scheduled, live, archived)
- poster_image_url (text)
- images (text[])
- created_by (uuid, foreign key)
- published_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### artworks
```sql
- id (uuid, primary key)
- artist_id (uuid, foreign key to artists)
- title (text)
- year (integer)
- materials (text)
- dimensions (text)
- description (text)
- price (numeric, optional)
- availability_status (enum: available, sold, not_for_sale, on_exhibition)
- is_featured (boolean)
- slug (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

#### artwork_images
```sql
- id (uuid, primary key)
- artwork_id (uuid, foreign key to artworks)
- image_url (text)
- alt_text (text)
- is_primary (boolean)
- display_order (integer)
- created_at (timestamp)
```

#### artists
```sql
- id (uuid, primary key)
- name (text)
- profile_image_url (text)
- biography (text)
- artist_statement (text)
- education (jsonb)
- exhibitions (jsonb)
- awards (jsonb)
- representation_status (enum: represented, exhibited, emerging)
- social_links (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

#### videos
```sql
- id (uuid, primary key)
- title (text)
- description (text)
- youtube_url (text)
- youtube_id (text)
- thumbnail_url (text)
- category (text)
- related_exhibition_id (uuid, foreign key)
- related_artist_id (uuid, foreign key)
- is_visible (boolean)
- created_at (timestamp)
```

#### news_posts
```sql
- id (uuid, primary key)
- instagram_post_id (text)
- caption (text)
- image_urls (text[])
- instagram_url (text)
- post_date (timestamp)
- is_visible (boolean)
- created_at (timestamp)
```

#### newsletter_subscribers
```sql
- id (uuid, primary key)
- email (text, unique)
- subscribed_at (timestamp)
- is_active (boolean)
```

#### site_settings
```sql
- id (uuid, primary key)
- key (text, unique)
- value (jsonb)
- updated_at (timestamp)
```

### 4.2 Storage Buckets
- **exhibitions**: Exhibition posters, installation views, opening reception photos, gallery space images
- **artists**: Artist profile photos and portfolio images
- **artworks**: High-resolution artwork images with multiple views and details
- **general**: Site assets, logos, etc.

### 4.3 Enhanced Table Relationships
```
Artists (1) → (N) Artworks (1) → (N) Artwork_Images
Artists (1) → (N) Artist_Images (profiles/portfolios)
Exhibitions (1) → (N) Exhibition_Images (with image_type categorization)
Exhibitions (M) ↔ (N) Artists (through exhibition_artists junction table)
**Note: Exhibitions and Artworks are independent entities - no direct database relationship**
```

### 4.4 Exhibition Images Enhancement
The `exhibition_images` table includes an `image_type` field with the following categories:
- **poster**: Main exhibition poster/promotional image
- **artwork**: Individual artwork documentation
- **installation**: Gallery installation views
- **detail**: Close-up detail shots of artworks or installations
- **opening**: Opening reception and event photos
- **space**: Gallery space and architectural documentation

---

## 5. Technical Considerations

### 5.1 External API Integrations
- **YouTube API v3**: Video information and playback functionality
- **Instagram Basic Display API**: Post data collection with refresh tokens
- **Google Maps JavaScript API**: Maps and location information
- **Supabase Edge Functions**: Server-side API integrations and webhooks

### 5.2 Content Management System Features
- **Image Upload & Compression**: Next.js automatic image optimization
- **Rich Text Editor**: For descriptions and content editing
- **Drag & Drop**: File upload interfaces
- **Real-time Updates**: Supabase real-time subscriptions for admin updates

### 5.3 Caching Strategy
- **Static Assets**: Vercel Edge Network caching
- **API Responses**: Next.js built-in caching with ISR
- **Database Queries**: Supabase query optimization and indexing
- **Images**: Next.js Image component with automatic optimization

### 5.4 Error Handling & Monitoring
- **Vercel Analytics**: Performance and user behavior tracking
- **Next.js Error Boundaries**: Client-side error handling
- **Custom Error Pages**: 404, 500 error handling
- **Offline Support**: Service worker for basic offline functionality

---

## 6. Development Phases & Timeline

### Phase 1: Foundation Setup (3 weeks) ✅ COMPLETED
- Next.js project setup and configuration
- Supabase database schema creation
- Basic UI components and navigation with wireframe-based design
- Authentication system implementation
- **PostCSS Configuration**: Critical fix for TailwindCSS compilation
- **React Context Architecture**: Safe fallback patterns implemented

### Phase 2: Core Features Development (5 weeks) 🔄 IN PROGRESS
- Public pages development (Home ✅, Exhibitions, Artists)
- External API integrations (YouTube, Instagram, Google Maps)
- Image upload and management system
- Basic admin panel structure
- **Current Focus**: Storage buckets setup and Exhibitions page development

### Phase 3: Advanced Features (4 weeks)
- Complete admin panel functionality
- Video and news management systems
- Newsletter subscription system
- Search and filtering capabilities

### Phase 4: Testing & Optimization (2 weeks)
- End-to-end testing
- Performance optimization
- SEO implementation
- Vercel deployment and monitoring setup

---

## 7. Success Metrics (KPIs)

### 7.1 User Experience
- Average session duration: 3+ minutes
- Bounce rate: Under 50%
- Mobile usability score: 90+ points
- Page speed score: 90+ (Google PageSpeed Insights)

### 7.2 Content Engagement
- Video play rate: 30%+ 
- Newsletter subscription rate: 50+ monthly signups
- Instagram link click-through rate: 10%+
- Exhibition page views: Track popularity

### 7.3 Technical Performance
- Content update time: Average under 10 minutes
- Admin system onboarding: Under 1 hour
- System uptime: 99.9%
- API response time: Under 500ms

---

## 8. Risk Assessment & Mitigation

### 8.1 Technical Risks
- **External API Dependencies**: 
  - Risk: YouTube/Instagram API changes or outages
  - Mitigation: Implement fallback mechanisms and data caching
- **Image Storage Costs**: 
  - Risk: High storage costs with image-heavy content
  - Mitigation: Next.js image optimization and Supabase storage optimization

### 8.2 Content Management Risks
- **Instagram API Policy Changes**: 
  - Risk: API access restrictions
  - Mitigation: Manual post upload backup system
- **Copyright Issues**: 
  - Risk: Unauthorized image usage
  - Mitigation: Clear usage rights documentation and watermarking

### 8.3 User Experience Risks
- **Mobile Performance**: 
  - Risk: Poor mobile experience affecting user engagement
  - Mitigation: Next.js optimization and extensive mobile testing
- **Loading Speed**: 
  - Risk: Slow loading affecting SEO and user retention
  - Mitigation: Performance monitoring and Next.js built-in optimizations