import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AppAnalysis } from "../../../shared/schema";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

interface SearchHistoryProps {
  historyItems: AppAnalysis[];
  onLoadHistoryItem: (id: number) => void;
  onClearHistory: () => void;
}

export function SearchHistory({ historyItems, onLoadHistoryItem, onClearHistory }: SearchHistoryProps) {
  if (historyItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            Recent Analyses
          </h2>
          <Button 
            variant="ghost" 
            className="text-sm text-gray-500 dark:text-gray-400 h-auto p-0"
            onClick={onClearHistory}
          >
            Clear History
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {historyItems.map((item) => (
          <div key={item.id} className="border-b border-gray-100 dark:border-gray-800 py-3 last:border-0 px-6">
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-1 rounded-md"
              onClick={() => onLoadHistoryItem(item.id)}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mr-3 overflow-hidden">
                  {item.appIcon ? (
                    <img src={item.appIcon} alt={item.appName} className="h-full w-full object-cover" />
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-500 dark:text-gray-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {item.appName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 mr-2">
                  {item.averageSentiment}%
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
