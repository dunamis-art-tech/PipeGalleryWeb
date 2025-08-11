-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create exhibitions table
create table exhibitions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  artist_name text not null,
  description text,
  start_date date not null,
  end_date date not null,
  status text check (status in ('ongoing', 'upcoming', 'past')) default 'upcoming',
  poster_image_url text,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create artists table
create table artists (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  profile_image_url text,
  biography text,
  education jsonb default '[]'::jsonb,
  exhibitions jsonb default '[]'::jsonb,
  awards jsonb default '[]'::jsonb,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create videos table
create table videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  youtube_url text not null,
  youtube_id text not null,
  thumbnail_url text,
  category text,
  related_exhibition_id uuid references exhibitions(id) on delete set null,
  related_artist_id uuid references artists(id) on delete set null,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create news_posts table (Instagram posts)
create table news_posts (
  id uuid default uuid_generate_v4() primary key,
  instagram_post_id text unique,
  caption text,
  image_urls text[] default array[]::text[],
  instagram_url text,
  post_date timestamp with time zone,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create newsletter_subscribers table
create table newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- Create site_settings table
create table site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exhibition_images junction table
create table exhibition_images (
  id uuid default uuid_generate_v4() primary key,
  exhibition_id uuid references exhibitions(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create artist_images junction table
create table artist_images (
  id uuid default uuid_generate_v4() primary key,
  artist_id uuid references artists(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exhibition_artists junction table for many-to-many relationship
create table exhibition_artists (
  id uuid default uuid_generate_v4() primary key,
  exhibition_id uuid references exhibitions(id) on delete cascade not null,
  artist_id uuid references artists(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(exhibition_id, artist_id)
);

-- Create indexes for performance
create index idx_exhibitions_status on exhibitions(status);
create index idx_exhibitions_dates on exhibitions(start_date, end_date);
create index idx_exhibitions_slug on exhibitions(slug);
create index idx_artists_slug on artists(slug);
create index idx_videos_visibility on videos(is_visible);
create index idx_videos_youtube_id on videos(youtube_id);
create index idx_news_posts_visibility on news_posts(is_visible);
create index idx_news_posts_date on news_posts(post_date);
create index idx_newsletter_subscribers_email on newsletter_subscribers(email);
create index idx_newsletter_subscribers_active on newsletter_subscribers(is_active);
create index idx_site_settings_key on site_settings(key);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_exhibitions_updated_at before update on exhibitions
  for each row execute function update_updated_at_column();

create trigger update_artists_updated_at before update on artists
  for each row execute function update_updated_at_column();

create trigger update_videos_updated_at before update on videos
  for each row execute function update_updated_at_column();

create trigger update_news_posts_updated_at before update on news_posts
  for each row execute function update_updated_at_column();

create trigger update_site_settings_updated_at before update on site_settings
  for each row execute function update_updated_at_column();