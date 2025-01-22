export interface YTResponse<T> {
  status: boolean;
  data: T | undefined;
}

export interface YTVideoDetail {
  embed: Embed;
  title: string;
  description: string;
  lengthSeconds: string;
  ownerProfileUrl: string;
  externalChannelId: string;
  isFamilySafe: boolean;
  availableCountries: string[];
  isUnlisted: boolean;
  hasYpcMetadata: boolean;
  viewCount: string;
  category: string;
  publishDate: Date;
  ownerChannelName: string;
  uploadDate: Date;
  isShortsEligible: boolean;
  videoId: string;
  keywords: string[];
  channelId: string;
  isOwnerViewing: boolean;
  isCrawlable: boolean;
  allowRatings: boolean;
  author: Author;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  isLiveContent: boolean;
  media: Media;
  likes: number;
  age_restricted: boolean;
  video_url: string;
  storyboards: Storyboard[];
  chapters: unknown[];
  thumbnails: Thumbnail[];
}

export interface Author {
  id: string;
  name: string;
  user: string;
  channel_url: string;
  external_channel_url: string;
  user_url: string;
  thumbnails: Thumbnail[];
  verified: boolean;
  subscriber_count: number;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Embed {
  iframeUrl: string;
  width: number;
  height: number;
}

export type Media = object;

export interface Storyboard {
  templateUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailCount: number;
  interval: number;
  columns: number;
  rows: number;
  storyboardCount: number;
}
