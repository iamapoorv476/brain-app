
import { useEffect, useState, useCallback } from "react";
import axios from 'axios';

interface Content {
  _id: string;
  title: string;
  links: string; 
  type: 'youtube' | 'twitter';
  user: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const response = await axios.get('/api/v1/contents/find', {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      
      console.log('Full API response:', response.data);
      
      /* @ts-ignore */
      const fetchedContents = response.data.data || [];
      
      console.log('Extracted contents:', fetchedContents);
      setContents(fetchedContents);
      
    } catch (err: any) {
      console.error('Error fetching contents:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to fetch contents');
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    
    
    let interval = setInterval(() => {
      refresh();
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  return {
    contents,
    loading,
    error,
    refresh
  };
}