import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { AnalysisResult, Review } from "../../../shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ResultsCardProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export function ResultsCard({ result, onNewAnalysis }: ResultsCardProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { appInfo, sentimentData, reviewSamples } = result;
  
  const displayedReviews = showAllReviews ? reviewSamples : reviewSamples.slice(0, 3);
  
  const getSentimentBadgeProps = (sentiment: string | null) => {
    switch (sentiment) {
      case 'positive':
        return { variant: 'outline' as const, className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-200 dark:border-green-800' };
      case 'negative':
        return { variant: 'outline' as const, className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-200 dark:border-red-800' };
      case 'neutral':
      default:
        return { variant: 'outline' as const, className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800' };
    }
  };
  
  // Helper function to check if a date string is valid
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Format date with error handling
  const formatDate = (dateString: string | null): string => {
    if (!dateString || !isValidDate(dateString)) {
      return 'Unknown date';
    }
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  const renderStars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={i < score ? "currentColor" : "none"}
        stroke="currentColor"
        className={`h-3 w-3 ${i < score ? "text-yellow-400" : "text-gray-300"}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };
  
  // Calculate left position for sentiment indicator based on average score
  const indicatorLeftPosition = `${sentimentData.averageScore}%`;

  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {appInfo.icon ? (
              <img 
                src={appInfo.icon} 
                alt={`${appInfo.name} icon`} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="16" height="16" x="4" y="4" rx="2" />
                <path d="M12 4v16" />
                <path d="M4 12h16" />
              </svg>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
              {appInfo.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {appInfo.developer || 'Unknown Developer'}
            </p>
            {appInfo.rating && (
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {renderStars(parseFloat(appInfo.rating))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {appInfo.rating} overall on Google Play
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 py-5">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sentiment Score Card */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Average Sentiment Score
            </h3>
            <div className="flex items-end">
              <span className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {sentimentData.averageScore}%
              </span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400 mb-1">
                positive
              </span>
            </div>
            <div className="mt-6 relative">
              <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
              <div 
                className="w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-3 border-primary absolute top-[-6px]"
                style={{ left: indicatorLeftPosition, transform: 'translateX(-50%)' }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-red-500 dark:text-red-400">Negative</span>
              <span className="text-yellow-500 dark:text-yellow-400">Neutral</span>
              <span className="text-green-500 dark:text-green-400">Positive</span>
            </div>
          </div>
          
          {/* Review Stats Card */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Review Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reviews Analyzed</p>
                <p className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                  {sentimentData.reviewCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analysis Date</p>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {sentimentData.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Positive</p>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-green-500 dark:text-green-400 mr-1">
                    {sentimentData.positivePercentage}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({Math.round(sentimentData.reviewCount * sentimentData.positivePercentage / 100)})
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Negative</p>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-red-500 dark:text-red-400 mr-1">
                    {sentimentData.negativePercentage}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({Math.round(sentimentData.reviewCount * sentimentData.negativePercentage / 100)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Sentiment Distribution
          </h3>
          <div className="h-5 flex rounded-full overflow-hidden">
            <div 
              className="bg-green-500" 
              style={{ width: `${sentimentData.positivePercentage}%` }}
            ></div>
            <div 
              className="bg-yellow-400" 
              style={{ width: `${sentimentData.neutralPercentage}%` }}
            ></div>
            <div 
              className="bg-red-500" 
              style={{ width: `${sentimentData.negativePercentage}%` }}
            ></div>
          </div>
          <div className="flex flex-wrap text-xs mt-1 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Positive ({sentimentData.positivePercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
              <span>Neutral ({sentimentData.neutralPercentage}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Negative ({sentimentData.negativePercentage}%)</span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sample Reviews Analyzed
            </h3>
            {reviewSamples.length > 3 && (
              <Button 
                variant="link" 
                className="text-primary dark:text-blue-400 text-sm p-0 h-auto"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show Less" : "View All"}
              </Button>
            )}
          </div>
          
          {displayedReviews.map((review, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-3 last:mb-0">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    {review.userName ? review.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                      {review.userName || "Anonymous User"}
                    </h4>
                    <div className="flex items-center">
                      <Badge {...getSentimentBadgeProps(review.sentiment ?? null)}>
                        {review.sentiment 
                          ? review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1) 
                          : "Neutral"}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {formatDate(review.at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1 mb-2">
                    {renderStars(review.score)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Powered by </span>
            <span className="font-medium">Express.js + OpenAI Sentiment Analysis</span>
          </div>
          <Button 
            variant="outline"
            onClick={onNewAnalysis}
            className="inline-flex items-center"
          >
            New Analysis
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
