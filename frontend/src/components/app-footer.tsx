export function AppFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              App Review Sentiment Analyzer
            </span>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Using Express.js, React, and OpenAI-powered sentiment analysis
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              This tool fetches data from Google Play Store via google-play-scraper
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
