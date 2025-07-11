import {api} from "./client";
import {PostQueryParams, PostsResult} from "@/types/posts";

export type CreatePostRequest = {
    title: string;
    content: string;
    conceptType: string;
    emotionType: string;
};

export type CreatePostResponse = {
    postId: number;
    title: string;
    afterContent: string;
};

// 게시글 목록 조회
export async function getPosts(params?: PostQueryParams): Promise<PostsResult> {
    try {
        return await api.public.get<PostsResult>("/posts", params);
    } catch (error) {
        console.warn("게시글 목록 조회 실패:", error);
        throw error;
    }
}

// 게시글 상세 조회
export async function getPost(postId: number) {
    try {
        return await api.public.get(`/posts/${postId}`);
    } catch (error) {
        console.warn("게시글 상세 조회 실패:", error);
        throw error;
    }
}

export const createPost = async (
    data: CreatePostRequest,
): Promise<CreatePostResponse> => {
    return api.post<CreatePostResponse>("/posts", data);
};

// 게시글 수정
export async function updatePost(
    postId: number,
    data: {
        beforeTitle?: string;
        beforeContent?: string;
        conceptType?: string;
        imageFile?: File;
    },
) {
    return api.put(`/posts/${postId}`, data);
}

// 게시글 삭제
export async function deletePost(postId: number) {
    return api.delete(`/posts/${postId}`);
}
