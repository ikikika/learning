import { useEffect, useState } from 'react';
import { getPost } from '../api/getPost';
import type { Post } from '../types/post';

type UsePostResult = {
  text: string;
  post: Post | null;
  error: string | null;
  loading: boolean;
};

export function usePost(id: number | string): UsePostResult {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getPost(id, { signal: controller.signal })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setPost(null);
        setError(err instanceof Error ? err.message : `Failed to load post ${id}`);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const text = loading
    ? 'Loading…'
    : error
      ? error
      : JSON.stringify(post, null, 2);

  return { text, post, error, loading };
}
