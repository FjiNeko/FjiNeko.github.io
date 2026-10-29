"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
  Loader2,
} from "lucide-react";
import { getProjects, type ProjectItem } from "@/app/api/projects";
import { fallbackProjects } from "./projectsData";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function GiteeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482c0-.326.266-.592.592-.592h6.81c.328 0 .593.266.593.592v3.408a4.74 4.74 0 0 1-4.741 4.74H7.11A4.74 4.74 0 0 1 2.37 14.81V9.186a4.74 4.74 0 0 1 4.74-4.741h10.963v.888z" />
    </svg>
  );
}

export default function ProjectsPage() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let isMounted = true;
    getProjects()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          // 直接使用后端返回的最新项目列表
          setProjectsList(data);
        }
      })
      .catch(() => {
        // 请求失败降级使用本地精选项目
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projectsList;
    const q = searchQuery.trim().toLowerCase();
    return projectsList.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const longDescMatch = p.long_description?.toLowerCase().includes(q);
      const techMatch = Array.isArray(p.tech_stack)
        ? p.tech_stack.some((t) => t.toLowerCase().includes(q))
        : false;
      const statusMatch = (p.status_label || p.status || "").toLowerCase().includes(q);
      return nameMatch || descMatch || longDescMatch || techMatch || statusMatch;
    });
  }, [projectsList, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 relative z-10">
      {/* 页头 */}
      <div className="mb-5 md:mb-10 text-center md:text-left">
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4 justify-center md:justify-start">
          <FolderGit2 className="w-5 h-5 md:w-7 md:h-7 text-sky-500" />
          <h1 className="text-xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            项目
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-xs md:text-sm">
          从零到一，用代码构建的每一份作品
        </p>
      </div>

      {/* 搜索框 */}
      <div className="mb-5 md:mb-10 flex justify-center w-full">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="搜索项目名称、描述或技术栈..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-full px-4 py-2 md:px-6 md:py-3 pl-10 md:pl-12 text-slate-900 dark:text-white font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder-slate-500 dark:placeholder-slate-400 text-xs md:text-sm"
          />
          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
        </div>
      </div>

      {/* 加载中提示 */}
      {loading && (
        <div className="flex items-center justify-center py-4 text-xs text-slate-500 dark:text-slate-400 gap-2 mb-4">
          <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          <span>正在连接后台同步项目数据...</span>
        </div>
      )}

      {/* 项目网格 */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <AnimatePresence>
          {filtered.map((project) => {
            const isExpanded = expandedIds.has(project.id);
            const hasLongDesc =
              project.long_description &&
              project.long_description.trim() !== "" &&
              project.long_description.trim() !== project.description?.trim();

            const statusText =
              project.status_label ||
              (project.status === "active"
                ? "已上线"
                : project.status === "developing"
                ? "开发中"
                : project.status === "archived"
                ? "已归档"
                : "进行中");

            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full"
              >
                <div className="flex flex-col h-full rounded-2xl md:rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.01] relative p-4 md:p-8 group">
                  {/* 装饰性光晕 */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-colors duration-700 pointer-events-none" />

                  {/* 封面图展示 */}
                  {project.cover_image && (
                    <div className="w-full h-36 md:h-44 -mx-4 -mt-4 md:-mx-8 md:-mt-8 mb-4 overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-white/40 dark:border-white/10 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.cover_image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {project.is_featured && (
                        <div className="absolute top-3 right-3 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" />
                          <span>精选</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      {/* 标题栏与链接组 */}
                      <div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
                            {project.name}
                          </h2>
                          {/* 精选徽章（无封面图时置于标题旁） */}
                          {!project.cover_image && project.is_featured && (
                            <span className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>精选</span>
                            </span>
                          )}
                          {/* 状态TAG */}
                          {statusText && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                project.status === "active" || statusText === "已上线"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : project.status === "developing" || statusText === "开发中"
                                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                                  : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                              }`}
                            >
                              {statusText}
                            </span>
                          )}
                        </div>

                        {/* 链接图标组 */}
                        <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
                          {project.link_github && (
                            <a
                              href={project.link_github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 p-1"
                              title="GitHub"
                            >
                              <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_gitee && (
                            <a
                              href={project.link_gitee}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 p-1"
                              title="Gitee"
                            >
                              <GiteeIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_live && (
                            <a
                              href={project.link_live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 p-1"
                              title="在线预览"
                            >
                              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_docs && (
                            <a
                              href={project.link_docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 p-1"
                              title="文档地址"
                            >
                              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* 简介 */}
                      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed line-clamp-3 mb-3 relative min-h-[42px]">
                        {project.description || "暂无项目简短介绍"}
                      </p>

                      {/* 详细介绍折叠展开 */}
                      {hasLongDesc && (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => toggleExpand(project.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            <span>{isExpanded ? "收起详细介绍" : "查看详细介绍"}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-100/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60"
                              >
                                {project.long_description}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* 技术栈标签区 */}
                    {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 md:gap-2 pt-3 border-t border-slate-200/40 dark:border-slate-700/40">
                        {project.tech_stack.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 md:px-3 md:py-1 rounded-md border border-sky-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12 md:py-20 text-slate-600 dark:text-slate-300 font-medium text-xs md:text-sm"
          >
            没有找到匹配 [{searchQuery}] 的项目...
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
