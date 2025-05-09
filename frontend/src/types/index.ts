export interface ReviewResponse {
  id: string;
  userName: string;
  userImage: string | null;
  content: string;
  score: number;
  thumbsUpCount: number;
  reviewCreatedVersion: string | null;
  at: string;
  replyContent: string | null;
  replyAt: string | null;
}

export interface AppInfo {
  name: string;
  packageName: string;
  developer: string;
  icon: string;
  rating: string;
}

export interface SentimentData {
  averageScore: number;
  reviewCount: number;
  date: string;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
}

export interface SentimentReview extends ReviewResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
}

export interface HistoryItem {
  id: number;
  appName: string;
  sentimentScore: number;
  date: string;
  appIcon?: string;
}
