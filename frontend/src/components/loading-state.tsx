import { Card, CardContent } from "../components/ui/card";

export function LoadingState() {
  return (
    <Card className="mb-8 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-2">
            Analyzing Reviews
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            We're fetching and analyzing up to 100 recent reviews from Google Play Store. This may take a moment...
          </p>
          <div className="w-full max-w-md mt-6">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse-slow" style={{ width: "70%" }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Fetching reviews</span>
              <span>Analyzing sentiment</span>
              <span>Generating results</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
