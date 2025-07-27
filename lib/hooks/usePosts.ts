import { useEffect, useState } from "react";
import {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  PostListReponse,
  PostQueryParams,
} from "@/types/posts";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  hidePost,
  unhidePost,
} from "@/apis/posts";

/**
 * 게시글 목록 조회, 검색 훅
 * @param params 게시글 조회 파라미터
 */
export function usePostList(params: PostQueryParams) {
  const [data, setData] = useState<PostListReponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPosts(params);
        setData(response);
      } catch (err: any) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [
    params.sort,
    params.concept,
    params.size,
    params.cursor,
    params.page,
    params.keyword,
  ]);

  return { data, loading, error };
}

/**
 * 게시글 상세 조회 훅
 * @param postId 게시글 ID
 */
export function usePost({ postId }: { postId: number }) {
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);

        const response = await getPost(postId);
        setData(response);
      } catch (err: any) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  return { data, loading, error };
}

/**
 * 게시글 생성 훅
 * @param body 게시글 생성 데이터
 */
export function useCreatePost(body: CreatePostRequest) {
  const [data, setData] = useState<CreatePostResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPostHook = async (
    postData: Post,
  ): Promise<CreatePostResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      // 여기에 게시글 생성 API 호출 로직을 추가해야 합니다.
      const response = await createPost(body);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPost: createPostHook, data, loading, error };
}

/**
 * 게시글 삭제 훅
 * @param postId 삭제할 게시글 ID
 */
export function useDeletePost(postId: number) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePostHook = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      // 여기에 게시글 삭제 API 호출 로직을 추가해야 합니다.
      const response = await deletePost(postId);
      setData(response);
      // TODO 삭제 성공 시 추가 로직 고민 - 삭제된 게시글을 목록에서 제거 / 목록으로 이동 등
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deletePost: deletePostHook, data, loading, error };
}

/**
 * 게시글 숨김 훅
 * @param postId 숨길 게시글 ID
 */
export function useHidePost(postId: number) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const hidePostHook = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      // 여기에 게시글 숨김 API 호출 로직을 추가해야 합니다.
      const response = await hidePost(postId);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { hidePost: hidePostHook, data, loading, error };
}

/**
 * 게시글 숨김 해제(공개) 훅
 * @param postId 숨김 해제할 게시글 ID
 */
export function useUnhidePost(postId: number) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unhidePostHook = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      // 여기에 게시글 공개 API 호출 로직을 추가해야 합니다.
      const response = await unhidePost(postId); // false로 설정하여 공개
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { unhidePost: unhidePostHook, data, loading, error };
}
