import { request, qs, BASE_URL } from "./client";
import type { GitHubUser } from "./types";

export interface MessageItem {
  id: number;
  github_user_id: number | null;
  parent_id: number | null;
  content: string;
  status: string;
  likes: number;
  created_at: string;
  github_user: GitHubUser | null;
  replies: MessageItem[];
}

export function getMessages(params?: { page?: number; size?: number }) {
  return request<MessageItem[]>(`/api/messages${qs(params)}`);
}

export function getMessagesCount() {
  return request<{ count: number }>("/api/messages/count");
}

export function createMessage(data: {
  content: string;
  parent_id?: number;
}) {
  return request<MessageItem>("/api/messages", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function likeMessage(msgId: number, unlike = false) {
  return request<MessageItem>(`/api/messages/${msgId}/${unlike ? "unlike" : "like"}`, {
    method: "POST",
  });
}

export async function getGithubUser(token: string): Promise<GitHubUser> {
  try {
    const res = await request<GitHubUser>(
      "/api/auth/github/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res && res.login) return res;
  } catch {
    // 后端如果未单独提供 /api/auth/github/me，则直接通过 GitHub API 获取用户信息
  }

  const ghRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (ghRes.ok) {
    const data = await ghRes.json();
    return {
      id: data.id,
      login: data.login,
      avatar: data.avatar_url,
      bio: data.bio || "",
    };
  }
  throw new Error("Failed to fetch GitHub user");
}

export function loginWithGithub() {
  if (typeof window === "undefined") return;
  const redirectPath = window.location.pathname + window.location.search + window.location.hash;
  sessionStorage.setItem("github_redirect", redirectPath);
  const base = BASE_URL.replace(/\/+$/, "");
  const returnUrl = encodeURIComponent(window.location.origin + "/auth/callback");
  const target = base
    ? `${base}/api/auth/github/login?redirect=${returnUrl}`
    : `/api/auth/github/login?redirect=${returnUrl}`;
  window.location.href = target;
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("github_token") || "";
}
