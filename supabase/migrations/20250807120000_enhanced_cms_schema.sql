-- Enhanced CMS Schema Updates based on PRD v2.0
-- This migration adds improved status management and CMS features

-- Update exhibitions table with enhanced status management
alter table exhibitions 
  drop constraint if exists exhibitions_status_check,
  add constraint exhibitions_status_check check (status in ('draft', 'scheduled', 'live', 'archived'));

-- Add new columns for enhanced CMS features
alter table exhibitions 
  add column if not exists images text[] default array[]::text[],
  add column if not exists created_by uuid,
  add column if not exists published_at timestamp with time zone;

-- Update artists table with enhanced features
alter table artists
  add column if not exists artist_statement text,
  add column if not exists representation_status text check (representation_status in ('represented', 'exhibited', 'emerging')) default 'exhibited',
  add column if not exists social_links jsonb default '{}'::jsonb;

-- Update videos table with enhanced management
alter table videos
  add column if not exists publish_date timestamp with time zone default timezone('utc'::text, now()),
  add column if not exists status text check (status in ('draft', 'published', 'archived')) default 'published';

-- Update news_posts table with categorization
alter table news_posts
  add column if not exists category text check (category in ('press_release', 'feature', 'external')) default 'feature',
  add column if not exists is_featured boolean default false,
  add column if not exists publish_date timestamp with time zone default timezone('utc'::text, now());

-- Create pages table for flexible content management
create table if not exists pages (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  content text,
  meta_title text,
  meta_description text,
  template_type text default 'default',
  is_published boolean default false,
  created_by uuid,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create media_library table for centralized asset management
create table if not exists media_library (
  id uuid default uuid_generate_v4() primary key,
  filename text not null,
  original_name text not null,
  file_path text not null,
  file_size integer not null,
  mime_type text not null,
  alt_text text,
  tags text[] default array[]::text[],
  uploaded_by uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_roles table for enhanced permission system
create table if not exists user_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  role text check (role in ('admin', 'curator', 'editor')) not null,
  permissions jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, role)
);

-- Create content_audit table for tracking changes
create table if not exists content_audit (
  id uuid default uuid_generate_v4() primary key,
  table_name text not null,
  record_id uuid not null,
  action text check (action in ('create', 'update', 'delete')) not null,
  changes jsonb,
  user_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for new columns and tables
create index if not exists idx_exhibitions_created_by on exhibitions(created_by);
create index if not exists idx_exhibitions_published_at on exhibitions(published_at);
create index if not exists idx_artists_representation_status on artists(representation_status);
create index if not exists idx_videos_status on videos(status);
create index if not exists idx_videos_publish_date on videos(publish_date);
create index if not exists idx_news_posts_category on news_posts(category);
create index if not exists idx_news_posts_featured on news_posts(is_featured);
create index if not exists idx_pages_slug on pages(slug);
create index if not exists idx_pages_published on pages(is_published);
create index if not exists idx_media_library_tags on media_library using gin(tags);
create index if not exists idx_media_library_mime_type on media_library(mime_type);
create index if not exists idx_user_roles_user_id on user_roles(user_id);
create index if not exists idx_content_audit_table_record on content_audit(table_name, record_id);

-- Add triggers for updated_at on new tables
create trigger if not exists update_pages_updated_at before update on pages
  for each row execute function update_updated_at_column();

create trigger if not exists update_media_library_updated_at before update on media_library
  for each row execute function update_updated_at_column();

create trigger if not exists update_user_roles_updated_at before update on user_roles
  for each row execute function update_updated_at_column();

-- Insert some default pages
insert into pages (slug, title, content, is_published) values
  ('about', 'About PipeGallery', 'Welcome to PipeGallery, a contemporary art gallery...', true),
  ('visit', 'Visit Information', 'Gallery hours, location, and visitor information...', true)
on conflict (slug) do nothing;

-- Insert default site settings for CMS configuration
insert into site_settings (key, value) values
  ('gallery_name', '"PipeGallery"'),
  ('gallery_description', '"Contemporary art gallery showcasing exhibitions, artists, and cultural events"'),
  ('contact_email', '"info@pipegallery.com"'),
  ('contact_phone', '"+82-2-XXXX-XXXX"'),
  ('operating_hours', '{"tuesday_sunday": "10:00 AM - 6:00 PM", "monday": "Closed"}'),
  ('social_media', '{"instagram": "#", "youtube": "#"}'),
  ('gallery_address', '"Seoul, South Korea"'),
  ('seo_keywords', '["contemporary art", "gallery", "exhibitions", "artists", "Seoul", "Korea"]')
on conflict (key) do nothing;