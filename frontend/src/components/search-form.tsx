import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Search } from "lucide-react";

const formSchema = z.object({
  appName: z.string().min(1, { 
    message: "App name or package ID is required" 
  }).max(255, { 
    message: "App name or package ID must be less than 255 characters" 
  }),
});

type SearchFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
          Analyze App Reviews
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-300">
                    Android App Name or Package ID
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        placeholder="e.g. com.spotify.music or Spotify"
                        className="pl-10"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter the Google Play Store app name or package ID
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex items-center"
              >
                <Search className="mr-2 h-4 w-4" />
                Analyze Sentiment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
