// siteConfig.ts - 全站配置中心

export const siteConfig = {
  // 网站标题与博主信息
  title: "FjiNekoの小站",
  url: "https://fjineko.github.io",
  authorName: "FjiNeko",
  bio: "Stay curious, keep smiling, and write code that makes you happy.",

  // 头像设置
  avatarUrl: "https://avatars.githubusercontent.com/u/151485147?v=4",

  // 背景设置
  useGradient: false,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
  bgImages: [
    "/images/1.webp",
    "/images/42.webp",
    "/images/20.webp",
    "/images/36.webp",
    "/images/39.webp",
    "/images/41.webp",
  ],

  // 默认封面图
  defaultPostCover: "/images/default-cover.jpg",

  // 照片墙预览图
  photoWallImage: "/images/photo-wall.jpg",

  // 云音乐配置（网易云音乐）
  // 填歌单 ID 则自动拉取整个歌单，填歌曲 ID 列表则只播放指定歌曲
  cloudMusicPlaylistId: "17943739323",  // 歌单 ID（优先）
  cloudMusicIds: [],                     // 歌曲 ID 列表（歌单为空时使用）

  // 后端 API 地址（留空则同源相对路径；部署到 GitHub Pages 时可通过 NEXT_PUBLIC_API_URL 指向 Cloudflare Worker）
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "https://kirameku-worker.murdermobai0605.workers.dev",

  // GitHub OAuth App Client ID（配置后前台登录直跳 GitHub 官方授权许可页，无需 Worker 中转）
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23lidsdGIEDz3sTMD0",

  // 社交链接
  social: {
    github: "https://github.com/FjiNeko",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },

  // 站点信息
  buildDate: "2026-09-07T10:50:44",
  footerBadges: [
    { name: "Next.js 15", color: "text-sky-500" },
    { name: "React 19", color: "text-cyan-400" },
    { name: "Tailwind 4", color: "text-teal-400" },
  ],
  icpConfig: {
    name: "",
    link: "",
  },
  moeIcpConfig: {
    name: "",
    link: "",
  },

  // 分类标题
  chatterTitle: "留言",
  chatterDescription: "生活、技术、随想的碎片记录",
};
