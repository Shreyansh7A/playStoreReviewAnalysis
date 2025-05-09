import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  errorMessage: string;
  onDismiss: () => void;
}

export function ErrorState({ errorMessage, onDismiss }: ErrorStateProps) {
  return (
    <Card className="mb-8 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-2">
            An Error Occurred
          </h3>
          <p className="text-sm text-red-500 dark:text-red-400 text-center max-w-md">
            {errorMessage || "We couldn't find the specified app. Please check the app name or package ID and try again."}
          </p>
          <Button
            onClick={onDismiss}
            variant="outline"
            className="mt-4 text-primary bg-blue-50 dark:bg-blue-900 dark:text-blue-50 border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
