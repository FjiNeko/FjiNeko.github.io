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
        if (Array.isArray(data) && data.length > 0) {
          // 对接后台真实数据
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
      <div className="mb-6 md:mb-10 text-center md:text-left">
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3 justify-center md:justify-start">
          <FolderGit2 className="w-5 h-5 md:w-7 md:h-7 text-[#A89573] dark:text-[#D8C99F]" />
          <h1 className="text-xl md:text-4xl font-black text-[#332D25] dark:text-[#F3EBDD] tracking-tight">
            项目工坊
          </h1>
        </div>
        <p className="text-[#514638] dark:text-[#D8D0C2] font-medium text-xs md:text-sm">
          代码沉淀与作品集锦，记录技术思考与工程实践
        </p>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6 md:mb-10 flex justify-center w-full">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="搜索项目名称、介绍、技术栈或状态..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFF9EF]/80 dark:bg-[#2B2822]/80 backdrop-blur-md border border-[#D8C99F]/50 dark:border-[#725D3E]/40 rounded-full px-4 py-2 md:px-6 md:py-3 pl-10 md:pl-12 text-[#332D25] dark:text-[#F3EBDD] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A89573] dark:focus:ring-[#D8C99F] transition-all placeholder-[#514638]/60 dark:placeholder-[#D8D0C2]/50 text-xs md:text-sm"
          />
          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#A89573] dark:text-[#D8C99F]" />
        </div>
      </div>

      {/* 加载指示器 */}
      {loading && (
        <div className="flex items-center justify-center py-6 text-xs text-[#514638] dark:text-[#D8D0C2] gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#A89573]" />
          <span>正在同步最新项目数据...</span>
        </div>
      )}

      {/* 项目网格 */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <AnimatePresence>
          {filtered.map((project) => {
            const isExpanded = expandedIds.has(project.id);
            const hasLongDesc =
              project.long_description &&
              project.long_description.trim() !== "" &&
              project.long_description.trim() !== project.description?.trim();

            const statusText = project.status_label || (
              project.status === "active"
                ? "已上线"
                : project.status === "developing"
                ? "开发中"
                : project.status === "archived"
                ? "已归档"
                : "进行中"
            );

            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="flex flex-col h-full rounded-2xl md:rounded-3xl bg-[#FFF9EF]/85 dark:bg-[#2B2822]/85 backdrop-blur-md border border-[#D8C99F]/60 dark:border-[#383228] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                  {/* 封面图展示 */}
                  {project.cover_image && (
                    <div className="w-full h-36 md:h-44 overflow-hidden bg-[#F3EBDD] dark:bg-[#211F1A] border-b border-[#D8C99F]/40 dark:border-[#383228] relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.cover_image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {project.is_featured && (
                        <div className="absolute top-3 right-3 bg-[#A89573] dark:bg-[#725D3E] text-[#FFF9EF] dark:text-[#F3EBDD] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3" />
                          <span>精选</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* 标题栏与链接组 */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base md:text-xl font-bold text-[#332D25] dark:text-[#F3EBDD]">
                            {project.name}
                          </h2>
                          {/* 精选徽章（无封面图时置于标题旁） */}
                          {!project.cover_image && project.is_featured && (
                            <span className="bg-[#A89573]/20 dark:bg-[#D8C99F]/20 text-[#514638] dark:text-[#D8C99F] border border-[#A89573]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>精选</span>
                            </span>
                          )}
                          {/* 状态TAG */}
                          {statusText && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#D8C99F]/30 dark:bg-[#383228] text-[#514638] dark:text-[#D8D0C2] border border-[#D8C99F]/50 dark:border-[#725D3E]/30">
                              {statusText}
                            </span>
                          )}
                        </div>

                        {/* 四大外链图标组 */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {project.link_github && (
                            <a
                              href={project.link_github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#514638] dark:text-[#D8D0C2] hover:text-[#332D25] dark:hover:text-[#F3EBDD] transition-colors p-1"
                              title="GitHub 仓库"
                            >
                              <GithubIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_gitee && (
                            <a
                              href={project.link_gitee}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#514638] dark:text-[#D8D0C2] hover:text-[#332D25] dark:hover:text-[#F3EBDD] transition-colors p-1"
                              title="Gitee 仓库"
                            >
                              <GiteeIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_live && (
                            <a
                              href={project.link_live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#514638] dark:text-[#D8D0C2] hover:text-[#332D25] dark:hover:text-[#F3EBDD] transition-colors p-1"
                              title="线上体验地址"
                            >
                              <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                          {project.link_docs && (
                            <a
                              href={project.link_docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#514638] dark:text-[#D8D0C2] hover:text-[#332D25] dark:hover:text-[#F3EBDD] transition-colors p-1"
                              title="项目文档"
                            >
                              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* 简介 */}
                      <p className="text-xs md:text-sm text-[#514638] dark:text-[#D8D0C2] font-normal leading-relaxed mb-3">
                        {project.description || "暂无项目简短介绍"}
                      </p>

                      {/* 详细介绍折叠展开区 */}
                      {hasLongDesc && (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => toggleExpand(project.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#A89573] dark:text-[#D8C99F] hover:underline"
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
                                className="mt-2 text-xs leading-relaxed text-[#514638]/90 dark:text-[#D8D0C2]/90 bg-[#F3EBDD]/60 dark:bg-[#211F1A]/60 p-3 rounded-xl border border-[#D8C99F]/40 dark:border-[#383228]"
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
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#D8C99F]/30 dark:border-[#383228]">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] md:text-[11px] font-medium tracking-wide text-[#514638] dark:text-[#D8C99F] bg-[#F3EBDD] dark:bg-[#383228] px-2.5 py-0.5 rounded-md border border-[#D8C99F]/60 dark:border-[#725D3E]/40"
                          >
                            {tech}
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
            className="col-span-full text-center py-12 md:py-20 text-[#514638] dark:text-[#D8D0C2] font-medium text-xs md:text-sm"
          >
            未检索到与 [{searchQuery}] 匹配的项目内容
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
