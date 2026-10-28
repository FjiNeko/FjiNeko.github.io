import PostDetailClient from "./PostDetailClient";

export async function generateStaticParams() {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:19010";
    const res = await fetch(`${api}/api/posts?status=published&size=100`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const posts = await res.json();
      if (Array.isArray(posts) && posts.length > 0) {
        return posts.map((p: { slug: string }) => ({ slug: p.slug }));
      }
    }
  } catch {
    // ignore
  }
  return [{ slug: "_fallback" }];
}

export const dynamicParams = false;

export default function PostPage() {
  return <PostDetailClient />;
}
