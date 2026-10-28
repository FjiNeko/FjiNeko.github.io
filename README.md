# FjiNeko.github.io

> 基于 Next.js 16 + Cloudflare (D1 & R2) 的个人博客前端，通过 GitHub Actions 自动化持续集成并发布到 GitHub Pages。

## 架构说明

- **前端框架**：Next.js 16 (App Router) + React 19 + Tailwind CSS
- **托管平台**：GitHub Pages（由 `.github/workflows/deploy-pages.yml` 自动编译并部署）
- **数据库**：Cloudflare D1 (SQLite)
- **媒体存储**：Cloudflare R2
- **写作同步**：Obsidian Markdown 一键发布

## 自动化持续部署 (CI/CD)

本项目配置了 GitHub Actions 自动化工作流：
只要向 `main` 分支提交代码，GitHub Actions 会自动在云端执行：
1. 启动 Ubuntu 虚拟机并配置 Node.js 20 与 pnpm；
2. 安装依赖并自动执行 `pnpm run build`（静态导出为 HTML/CSS/JS 到 `out/` 目录）；
3. 自动将打包产物发布到 GitHub Pages。

访问地址：[https://fjineko.github.io](https://fjineko.github.io)
