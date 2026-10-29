"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import shell from "highlight.js/lib/languages/shell";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import nginx from "highlight.js/lib/languages/nginx";
import sql from "highlight.js/lib/languages/sql";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import makefile from "highlight.js/lib/languages/makefile";
import plaintext from "highlight.js/lib/languages/plaintext";
import { X } from "lucide-react";
import { parseTimelines } from "@/lib/timeline";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("svg", xml);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("makefile", makefile);
hljs.registerLanguage("text", plaintext);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("console", shell);
hljs.registerLanguage("ini", plaintext);

marked.use({ async: false });
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";
import { getPostBySlug, likePost, type PostDetail } from "@/app/api";
import ReadingProgress from "@/components/ui/ReadingProgress";
import PostComments from "@/components/posts/PostComments";

export default function PostDetailPage() {
  const params = useParams<{ slug: string }>();
  const [resolvedSlug, setResolvedSlug] = useState<string>(() => {
    if (params?.slug && params.slug !== "_fallback") return params.slug;
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get("slug");
      if (s) return s;
    }
    return "";
  });
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("liked_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (params?.slug && params.slug !== "_fallback") {
      setResolvedSlug(params.slug);
    } else if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get("slug");
      if (s) setResolvedSlug(s);
    }
  }, [params?.slug]);

  useEffect(() => {
    if (typeof window !== "undefined" && resolvedSlug && window.location.pathname.includes("_fallback")) {
      window.history.replaceState(null, "", `/posts/${resolvedSlug}`);
    }
  }, [resolvedSlug]);

  useEffect(() => {
    if (!resolvedSlug) return;
    let active = true;
    setLoading(true);
    setError(false);
    getPostBySlug(resolvedSlug)
      .then((data) => {
        if (active) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, [resolvedSlug]);

  // 代码高亮
  useEffect(() => {
    if (!post) return;
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".post-content pre code[class*=language-]").forEach((el) => {
        hljs.highlightElement(el);
      });
    });
  }, [post]);

  async function handleLike() {
    if (!post) return;
    const alreadyLiked = likedPosts.has(post.id);
    try {
      const result = await likePost(post.id, alreadyLiked);
      setLikedPosts((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) next.delete(post.id);
        else next.add(post.id);
        localStorage.setItem("liked_posts", JSON.stringify([...next]));
        return next;
      });
      setPost((prev) => prev ? { ...prev, likes: result.likes } : prev);
    } catch {}
  }

  // 事件委托：点击文章内容中的图片打开灯箱
  function handleContentClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      setLightboxSrc((target as HTMLImageElement).src);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm md:text-base text-slate-500 hover:text-sky-500 transition-colors mb-4 md:mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          返回文章列表
        </Link>
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-slate-400">
          <p className="text-base md:text-lg">文章不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <ReadingProgress contentRef={contentRef} />
      {/* 返回按钮 */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/posts"
          className="inline-flex items-center gap-1.5 text-sm md:text-base text-slate-500 hover:text-sky-500 transition-colors mb-4 md:mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          返回文章列表
        </Link>
      </motion.div>

      {/* 文章卡片 */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl shadow-2xl overflow-hidden bg-white/60 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/30 dark:border-white/10"
      >
        {/* 封面图 */}
        {post.cover && (
          <div className="relative w-full h-40 sm:h-56 md:h-72 overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="px-4 sm:px-6 md:px-12 py-5 sm:py-8 md:py-10">
          {/* 标题 */}
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-3 md:mb-4">
            {post.title}
          </h1>

          {/* 描述 */}
          {post.description && (
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 md:mb-6 leading-relaxed">
              {post.description}
            </p>
          )}

          {/* 元信息 + 标签 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 pb-5 sm:mb-8 sm:pb-8 border-b border-slate-200/60 dark:border-white/10">
            {dateStr && (
              <span className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {dateStr}
              </span>
            )}
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {post.reading_time} 分钟阅读
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {post.views} 次浏览
            </span>
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 sm:gap-1.5 transition-colors ${
                likedPosts.has(post.id)
                  ? "text-pink-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-pink-500"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                likedPosts.has(post.id) ? "fill-pink-500 scale-110" : ""
              }`} />
              {post.likes} 个点赞
            </button>
          </div>

          {/* 文章内容 */}
          <div className="relative" ref={contentRef}>
            <style>{`
              .post-content ul {
                list-style-type: disc !important;
                padding-left: 1.5rem !important;
                margin: 1rem 0 !important;
              }
              .post-content ol {
                list-style-type: decimal !important;
                padding-left: 1.5rem !important;
                margin: 1rem 0 !important;
              }
              .post-content li {
                margin: 0.25rem 0 !important;
                line-height: 1.75 !important;
              }
              .post-content pre {
                background-color: #1e293b !important;
                color: #e2e8f0 !important;
                padding: 1.25rem !important;
                border-radius: 0.75rem !important;
                overflow-x: auto !important;
                margin: 1.5rem 0 !important;
                border: 1px solid rgba(255,255,255,0.08) !important;
                font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace !important;
                line-height: 1.6 !important;
                white-space: pre !important;
                word-break: normal !important;
                overflow-wrap: normal !important;
              }
              .post-content pre code {
                background-color: transparent !important;
                padding: 0 !important;
                font-size: 0.9em !important;
                white-space: pre !important;
                word-break: normal !important;
                font-family: inherit !important;
              }
              .post-content code::before, .post-content code::after { content: none !important; }
              .post-content p code, .post-content li code {
                background-color: rgba(99,102,241,0.1) !important;
                color: #6366f1 !important;
                padding: 0.15rem 0.4rem !important;
                border-radius: 0.375rem !important;
                font-weight: 600 !important;
                font-size: 0.88em !important;
              }
              .dark .post-content p code, .dark .post-content li code {
                background-color: rgba(99,102,241,0.2) !important;
                color: #a5b4fc !important;
              }
              .post-content blockquote {
                border-left: 4px solid #6366f1 !important;
                padding-left: 1rem !important;
                margin: 1.5rem 0 !important;
                color: #475569 !important;
                font-style: italic !important;
              }
              .dark .post-content blockquote {
                color: #94a3b8 !important;
              }
              .post-content img {
                display: block !important;
                margin: 2rem auto !important;
                border-radius: 1rem !important;
                max-width: 100% !important;
                height: auto !important;
                cursor: zoom-in !important;
              }
              .post-content a {
                color: #6366f1 !important;
                text-decoration: underline !important;
                text-underline-offset: 3px !important;
              }
              .dark .post-content a {
                color: #818cf8 !important;
              }
              .post-content h2 {
                font-size: 1.5rem !important;
                font-weight: 700 !important;
                margin-top: 2rem !important;
                margin-bottom: 0.75rem !important;
              }
              .post-content h3 {
                font-size: 1.25rem !important;
                font-weight: 600 !important;
                margin-top: 1.5rem !important;
                margin-bottom: 0.5rem !important;
              }
              .post-content table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin: 1.5rem 0 !important;
                border: 2px solid #cbd5e1 !important;
                border-radius: 0.5rem !important;
                overflow: hidden !important;
              }
              .post-content th, .post-content td {
                border: 1px solid #cbd5e1 !important;
                padding: 0.6rem 1rem !important;
                text-align: left !important;
              }
              .dark .post-content table {
                border-color: #475569 !important;
              }
              .dark .post-content th, .dark .post-content td {
                border-color: #475569 !important;
              }
              .post-content th {
                background-color: #f1f5f9 !important;
                font-weight: 600 !important;
              }
              .dark .post-content th {
                background-color: #1e293b !important;
              }

              /* ========== Markdown Timelines 样式 ========== */
              .post-content .timeline {
                position: relative !important;
                margin: 2.5rem 0 !important;
                width: 100% !important;
              }
              .post-content .timeline .wrapper-timeline {
                display: flex !important;
                flex-direction: column !important;
                position: relative !important;
                gap: 1.5rem !important;
              }
              .post-content .timeline .wrapper-item {
                display: grid !important;
                grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1fr) !important;
                align-items: flex-start !important;
                position: relative !important;
              }
              .post-content .timeline .wrapper-item > * {
                min-width: 0 !important;
                width: 100% !important;
                box-sizing: border-box !important;
              }
              .post-content .timeline.squish-left .wrapper-item {
                grid-template-columns: 140px 40px minmax(0, 1fr) !important;
              }
              .post-content .timeline.squish-right .wrapper-item {
                grid-template-columns: minmax(0, 1fr) 40px 140px !important;
              }
              .post-content .timeline .divider {
                position: relative !important;
                display: flex !important;
                justify-content: center !important;
                align-items: flex-start !important;
                min-height: 100% !important;
                height: 100% !important;
              }
              .post-content .timeline .divider::before {
                content: "" !important;
                position: absolute !important;
                top: 0 !important;
                bottom: -1.5rem !important;
                left: 50% !important;
                width: 2px !important;
                transform: translateX(-50%) !important;
                background-color: #bae6fd !important;
              }
              .dark .post-content .timeline .divider::before {
                background-color: #334155 !important;
              }
              .post-content .timeline .wrapper-item:last-child .divider::before {
                bottom: 0 !important;
              }
              .post-content .timeline .dot {
                position: relative !important;
                z-index: 2 !important;
                width: 14px !important;
                height: 14px !important;
                margin-top: 0.5rem !important;
                border-radius: 50% !important;
                background-color: #ffffff !important;
                border: 3px solid #0ea5e9 !important;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2) !important;
                transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
              }
              .dark .post-content .timeline .dot {
                background-color: #0f172a !important;
                border-color: #38bdf8 !important;
                box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
              }
              .post-content .timeline .wrapper-item:hover .dot {
                transform: scale(1.25) !important;
                border-color: #0284c7 !important;
                box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.35) !important;
              }
              .dark .post-content .timeline .wrapper-item:hover .dot {
                border-color: #7dd3fc !important;
                box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.4) !important;
              }
              .post-content .timeline .year-item {
                display: flex !important;
                align-items: flex-start !important;
                padding-top: 0.25rem !important;
              }
              .post-content .timeline .wrapper-item > .year-item:first-child {
                justify-content: flex-end !important;
                text-align: right !important;
                padding-right: 0.75rem !important;
              }
              .post-content .timeline .wrapper-item > .year-item:last-child {
                justify-content: flex-start !important;
                text-align: left !important;
                padding-left: 0.75rem !important;
              }
              .post-content .timeline .year {
                font-size: 1.15rem !important;
                font-weight: 700 !important;
                color: #0f172a !important;
                letter-spacing: -0.01em !important;
              }
              .dark .post-content .timeline .year {
                color: #f8fafc !important;
              }
              .post-content .timeline .timeline-item {
                position: relative !important;
                width: 100% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
                padding: 0.25rem 0.5rem !important;
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
              }
              .dark .post-content .timeline .timeline-item {
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
              }
              .post-content .timeline .timeline-item:hover {
                transform: none !important;
                border: none !important;
                box-shadow: none !important;
              }
              .dark .post-content .timeline .timeline-item:hover {
                border: none !important;
                box-shadow: none !important;
              }
              .post-content .timeline .item-header {
                display: flex !important;
                flex-direction: column !important;
                width: fit-content !important;
                max-width: 100% !important;
                margin-bottom: 0.35rem !important;
              }
              .post-content .timeline .item-right .item-header {
                align-items: flex-start !important;
              }
              .post-content .timeline .item-right .item-header .toc-header {
                order: 1 !important;
              }
              .post-content .timeline .item-right .item-header .item-date {
                order: 2 !important;
                align-self: flex-end !important;
                font-size: 0.75rem !important;
                margin: 0.15rem 0 0.25rem 0 !important;
              }
              .post-content .timeline .item-left .item-header {
                align-items: flex-start !important;
              }
              .post-content .timeline .item-left .item-header .toc-header {
                order: 1 !important;
              }
              .post-content .timeline .item-left .item-header .item-date {
                order: 2 !important;
                align-self: flex-start !important;
                font-size: 0.75rem !important;
                margin: 0.15rem 0 0.25rem 0 !important;
              }
              .post-content .timeline.squish-left .item-left .item-header .item-date {
                order: 1 !important;
                align-self: flex-start !important;
                margin: 0 0 0.25rem 0 !important;
              }
              .post-content .timeline.squish-left .item-left .item-header .toc-header {
                order: 2 !important;
              }
              .post-content .timeline .timeline-item .toc-header,
              .post-content .timeline .timeline-item h3 {
                position: relative !important;
                display: inline-block !important;
                width: fit-content !important;
                margin: 0.2rem 0 0.35rem 0 !important;
                padding-bottom: 0.5rem !important;
                font-size: 1.15rem !important;
                font-weight: 700 !important;
                color: #0f172a !important;
                line-height: 1.4 !important;
              }
              .dark .post-content .timeline .timeline-item .toc-header,
              .dark .post-content .timeline .timeline-item h3 {
                color: #f8fafc !important;
              }
              .post-content .timeline .timeline-item .toc-header::after,
              .post-content .timeline .timeline-item h3::after {
                content: "" !important;
                position: absolute !important;
                left: 0 !important;
                bottom: -2px !important;
                width: 100% !important;
                height: 10px !important;
                background-repeat: no-repeat !important;
                background-size: 100% 100% !important;
                background-position: center bottom !important;
                pointer-events: none !important;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 16' preserveAspectRatio='none'%3E%3Cpath d='M2 10 C 25 4, 55 13, 78 7 C 88 4.5, 95 8, 98 8.5' stroke='%230ea5e9' stroke-width='3.5' stroke-linecap='round' fill='none'/%3E%3Cpath d='M4 12 C 28 7, 62 13.5, 96 9' stroke='%230284c7' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.85'/%3E%3C/svg%3E") !important;
              }
              .dark .post-content .timeline .timeline-item .toc-header::after,
              .dark .post-content .timeline .timeline-item h3::after {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 16' preserveAspectRatio='none'%3E%3Cpath d='M2 10 C 25 4, 55 13, 78 7 C 88 4.5, 95 8, 98 8.5' stroke='%2338bdf8' stroke-width='3.5' stroke-linecap='round' fill='none'/%3E%3Cpath d='M4 12 C 28 7, 62 13.5, 96 9' stroke='%237dd3fc' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.85'/%3E%3C/svg%3E") !important;
              }
              .post-content .timeline .timeline-item p {
                margin: 0.35rem 0 !important;
                font-size: 0.925rem !important;
                line-height: 1.6 !important;
                color: #475569 !important;
              }
              .dark .post-content .timeline .timeline-item p {
                color: #cbd5e1 !important;
              }
              .post-content .timeline .item-date {
                display: inline-block !important;
                font-size: 0.75rem !important;
                font-weight: 600 !important;
                letter-spacing: 0.025em !important;
                padding: 0 !important;
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                color: #0284c7 !important;
              }
              .dark .post-content .timeline .item-date {
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                color: #38bdf8 !important;
              }
              .post-content .timeline .break {
                position: relative !important;
                text-align: center !important;
                margin: 1.5rem 0 !important;
                padding: 0 1rem !important;
              }
              .post-content .timeline .break hr {
                border: 0 !important;
                border-top: 1px dashed #bae6fd !important;
                margin: 0 !important;
              }
              .dark .post-content .timeline .break hr {
                border-top-color: #334155 !important;
              }
              .post-content .timeline .break .title {
                position: relative !important;
                top: -0.65rem !important;
                display: inline-block !important;
                padding: 0.25rem 1rem !important;
                font-size: 0.85rem !important;
                font-weight: 700 !important;
                letter-spacing: 0.05em !important;
                border-radius: 9999px !important;
                background-color: #f0f9ff !important;
                border: 1px solid #bae6fd !important;
                color: #0284c7 !important;
              }
              .dark .post-content .timeline .break .title {
                background-color: #1e293b !important;
                border-color: #334155 !important;
                color: #38bdf8 !important;
              }

              @media (max-width: 767px) {
                .post-content .timeline .wrapper-item {
                  display: flex !important;
                  flex-direction: column !important;
                  position: relative !important;
                  padding-left: 2rem !important;
                  gap: 0.5rem !important;
                }
                .post-content .timeline .divider {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  bottom: 0 !important;
                  width: 24px !important;
                  min-height: 100% !important;
                }
                .post-content .timeline .divider::before {
                  left: 11px !important;
                  bottom: -1rem !important;
                }
                .post-content .timeline .dot {
                  margin-top: 0.35rem !important;
                }
                .post-content .timeline .year-item {
                  justify-content: flex-start !important;
                  text-align: left !important;
                  padding: 0 !important;
                }
                .post-content .timeline .timeline-item {
                  width: 100% !important;
                }
              }
            `}</style>
            <div
              className="post-content prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed"
              onClick={handleContentClick}
              dangerouslySetInnerHTML={{ __html: marked.parse(parseTimelines(post.content)) as string }}
            />
          </div>
        </div>
      </motion.article>

      {/* 评论区域 */}
      <PostComments postId={post.id} />

      {/* 图片灯箱 */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${lightboxSrc ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setLightboxSrc(null)}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
        <button
          type="button"
          onClick={() => setLightboxSrc(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        {lightboxSrc && (
          <img
            src={lightboxSrc}
            alt=""
            className="relative z-10 max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}
