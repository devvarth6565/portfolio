import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export interface GitHubRepo {
  id: number;
  name: string;      // Changed from title to match API
  full_name: string; // Needed for Readme fetch
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  size: number;
}

export function useGitHubProjects() {
  const [data, setData] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch repositories
    fetch('https://api.github.com/users/devvarth6565/repos?sort=updated&direction=desc&per_page=100')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(repos => {
        // We pass the raw repo object but formatted slightly for easier use
        const formatted = repos.map((repo: any) => ({
          ...repo,
          // We can keep specific formatting logic here if needed, 
          // but passing the raw data allows the UI to decide how to render it.
        }));
        setData(formatted);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { data, isLoading, error };
}