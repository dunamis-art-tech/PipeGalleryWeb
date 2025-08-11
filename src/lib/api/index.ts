// API Services
export { ExhibitionService, exhibitionService } from './exhibitions';
export { ArtistService, artistService } from './artists';
export { ArtworkService, artworkService } from './artworks';
export { NewsletterService, newsletterService } from './newsletter';
export { VideoService, videoService } from './videos';
export { NewsPostService, newsService } from './news';

// Types
export type {
  ExhibitionFormData,
  ExhibitionUpdateData,
  ExhibitionSearchData,
  ExhibitionImageData,
} from '@/lib/validations/exhibition';

export type {
  ArtistFormData,
  ArtistUpdateData,
  ArtistSearchData,
} from '@/lib/validations/artist';

export type {
  ArtworkFormData,
  ArtworkUpdateData,
  ArtworkSearchData,
  ArtworkImageData,
  ArtworkImageUpdateData,
  ExhibitionArtworkData,
} from '@/lib/validations/artwork';

export type {
  NewsletterSubscriptionData,
  NewsletterUnsubscribeData,
} from '@/lib/validations/newsletter';

export type {
  VideoFormData,
  VideoUpdateData,
  VideoSearchData,
} from './videos';

export type {
  NewsPostFormData,
  NewsPostUpdateData,
  NewsPostSearchData,
} from './news';