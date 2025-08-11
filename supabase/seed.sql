-- Insert sample site settings
insert into site_settings (key, value) values
  ('gallery_info', '{
    "name": "Contemporary Art Gallery",
    "address": "서울특별시 강남구 테헤란로 123",
    "phone": "02-1234-5678",
    "email": "info@gallery.com",
    "hours": {
      "weekdays": "10:00 - 18:00",
      "weekends": "10:00 - 17:00",
      "closed": "월요일"
    }
  }'::jsonb),
  ('social_links', '{
    "instagram": "https://instagram.com/gallery",
    "youtube": "https://youtube.com/@gallery",
    "facebook": "https://facebook.com/gallery"
  }'::jsonb),
  ('seo_settings', '{
    "meta_description": "현대 미술관에서 다양한 전시회와 작가들의 작품을 만나보세요.",
    "keywords": ["현대미술", "갤러리", "전시회", "작가", "예술"]
  }'::jsonb);

-- Insert sample artists
insert into artists (name, biography, slug, education, exhibitions, awards) values
  ('김현대', '현대 미술의 새로운 시각을 제시하는 작가', 'kim-hyundae', 
   '[{"school": "서울대학교 미술대학", "degree": "학사", "year": "2015"}, {"school": "뉴욕 파슨스 디자인 스쿨", "degree": "석사", "year": "2017"}]'::jsonb,
   '[{"title": "도시의 흔적", "year": "2023", "venue": "서울시립미술관"}, {"title": "기억의 파편", "year": "2022", "venue": "국립현대미술관"}]'::jsonb,
   '[{"title": "올해의 신진작가상", "year": "2023", "organization": "한국문화예술위원회"}]'::jsonb),
  ('박모던', '설치 미술과 미디어 아트를 결합한 독창적 작품 활동', 'park-modern',
   '[{"school": "홍익대학교 미술대학", "degree": "학사", "year": "2014"}, {"school": "독일 뒤셀도르프 예술대학", "degree": "석사", "year": "2016"}]'::jsonb,
   '[{"title": "디지털 네이처", "year": "2023", "venue": "아트센터 나비"}, {"title": "가상과 실재", "year": "2021", "venue": "갤러리 현대"}]'::jsonb,
   '[{"title": "미디어아트 페스티벌 대상", "year": "2022", "organization": "서울미디어시티비엔날레"}]'::jsonb);

-- Insert sample exhibitions
insert into exhibitions (title, artist_name, description, start_date, end_date, status, slug) values
  ('도시의 기억', '김현대', '현대 도시인의 삶과 기억을 조각과 회화로 표현한 개인전', '2024-07-01', '2024-09-30', 'ongoing', 'memory-of-city'),
  ('디지털 자연', '박모던', '자연과 기술의 경계를 탐구하는 미디어 아트 설치전', '2024-10-15', '2024-12-20', 'upcoming', 'digital-nature'),
  ('시간의 층위', '김현대, 박모던', '시간의 흐름을 다양한 매체로 해석한 2인전', '2024-03-01', '2024-05-31', 'past', 'layers-of-time');

-- Insert sample videos
insert into videos (title, description, youtube_url, youtube_id, category, is_visible) values
  ('김현대 작가 인터뷰: 도시의 기억을 말하다', '작가가 직접 설명하는 작품의 배경과 의미', 'https://youtube.com/watch?v=example1', 'example1', 'artist_interview', true),
  ('전시 투어: 디지털 자연 전시회 현장', '박모던 작가의 미디어 아트 설치 과정', 'https://youtube.com/watch?v=example2', 'example2', 'exhibition_tour', true),
  ('갤러리 토크: 현대 미술의 방향성', '큐레이터와 함께하는 현대 미술 담론', 'https://youtube.com/watch?v=example3', 'example3', 'gallery_talk', true);

-- Insert sample news posts
insert into news_posts (instagram_post_id, caption, image_urls, instagram_url, post_date, is_visible) values
  ('post_001', '김현대 작가의 새로운 작품이 전시장에 설치되었습니다. #현대미술 #전시회', 
   array['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], 
   'https://instagram.com/p/example1', '2024-08-01 10:00:00+00', true),
  ('post_002', '다음 주 박모던 작가와의 아티스트 토크가 진행됩니다. #아티스트토크 #미디어아트',
   array['https://example.com/image3.jpg'],
   'https://instagram.com/p/example2', '2024-08-03 15:30:00+00', true);

-- Update exhibition-artist relationships
insert into exhibition_artists (exhibition_id, artist_id) 
select e.id, a.id 
from exhibitions e, artists a 
where (e.slug = 'memory-of-city' and a.slug = 'kim-hyundae')
   or (e.slug = 'digital-nature' and a.slug = 'park-modern')
   or (e.slug = 'layers-of-time' and a.slug in ('kim-hyundae', 'park-modern'));