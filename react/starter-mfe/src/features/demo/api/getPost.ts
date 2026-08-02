import { apiRoutes } from '@/core/constants/apiRoutes';
import { apiUrl, getJson } from '@/services/httpClient';
import type { Post } from '../types/post';

export function getPost(
  id: number | string,
  options?: { signal?: AbortSignal },
): Promise<Post> {
  return getJson<Post>(apiUrl(apiRoutes.posts.byId(id)), options);
}
