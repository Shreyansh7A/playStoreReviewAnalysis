'use client';

import { useState } from "react";
import { AppHeader } from "../components/app-header";
import { SearchForm } from "../components/search-form";
import { LoadingState } from "../components/loading-state";
import { ErrorState } from "../components/error-state";
import { ResultsCard } from "../components/results-card";
import { SearchHistory } from "../components/search-history";
import { AppFooter } from "../components/app-footer";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  analyzeAppReviews,
  getAnalysisHistory,
  getAnalysisById,
  clearAnalysisHistory
} from "../lib/apiClient";
import { queryClient } from "../lib/queryClient";
import { AnalysisResult } from "../../../shared/schema";
import { useToast } from "../hooks/use-toast";

export default function HomePage() {
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const {
    data: historyData = [],
    isLoading: isHistoryLoading,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['/api/reviews/history'],
    queryFn: getAnalysisHistory
  });

  const { mutate: analyzeReviews, isPending: isAnalyzing } = useMutation({
    mutationFn: analyzeAppReviews,
    onSuccess: (data) => {
      setCurrentAnalysis(data);
      setShowResults(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/history'] });
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to analyze app reviews. Please try again.");
      setShowResults(false);
      toast({
        title: "Error",
        description: err.message || "Failed to analyze app reviews",
        variant: "destructive",
      });
    }
  });

  const { mutate: clearHistory } = useMutation({
    mutationFn: clearAnalysisHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/history'] });
      toast({
        title: "Success",
        description: "Analysis history cleared",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to clear history",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (values: { appName: string }) => {
    setShowResults(false);
    setError(null);
    analyzeReviews(values.appName);
  };

  const handleLoadHistoryItem = async (id: number) => {
    try {
      const result = await getAnalysisById(id);
      setCurrentAnalysis(result);
      setShowResults(true);
      setError(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load analysis from history",
        variant: "destructive",
      });
    }
  };

  const handleNewAnalysis = () => {
    setShowResults(false);
    setError(null);
    setCurrentAnalysis(null);
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults && !isAnalyzing && !error && (
          <SearchForm onSubmit={handleSubmit} isLoading={isAnalyzing} />
        )}

        {isAnalyzing && <LoadingState />}

        {error && <ErrorState errorMessage={error} onDismiss={handleDismissError} />}

        {showResults && currentAnalysis && (
          <ResultsCard result={currentAnalysis} onNewAnalysis={handleNewAnalysis} />
        )}

        {!showResults && !isAnalyzing && historyData.length > 0 && (
          <SearchHistory
            historyItems={historyData}
            onLoadHistoryItem={handleLoadHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      <AppFooter />
    </div>
  );
}
