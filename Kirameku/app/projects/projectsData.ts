export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  coverImage?: string;
  techStack: string[];
  links: {
    github?: string;
    gitee?: string;
    live?: string;
    docs?: string;
  };
  featured?: boolean;
  status: "active" | "archived" | "developing";
  statusLabel: string;
  sort?: number;
}

export const projects: Project[] = [
  {
    id: "fjineko-github-io",
    name: "FjiNeko.github.io",
    description: "个人主页与技术博客站点",
    longDescription:
      "基于 GitHub Pages / Next.js 构建的个人主页与技术博客，集成作品展示、动态挂件与个人知识库。",
    coverImage: "",
    techStack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    links: {
      github: "https://github.com/FjiNeko/FjiNeko.github.io",
      live: "https://fjineko.github.io/",
    },
    featured: true,
    status: "active",
    statusLabel: "已上线",
    sort: 1,
  },
  {
    id: "cgbgear-server",
    name: "CGBGEAR_SERVER",
    description: "CGBGEAR 论坛原网站后台服务（Flask）",
    longDescription:
      "基于 Python Flask 框架开发的 CGBGEAR 社区论坛后端服务，提供用户鉴权、帖子管理、版块分类、评论互动等 RESTful API 接口。",
    coverImage: "",
    techStack: ["Python", "Flask", "SQLAlchemy", "MySQL", "RESTful API"],
    links: {
      github: "https://github.com/FjiNeko/CGBGEAR_SERVER",
    },
    featured: true,
    status: "active",
    statusLabel: "维护中",
    sort: 2,
  },
  {
    id: "cgbgear-user-interface",
    name: "CGBGEAR_USER_INTERFACE",
    description: "CGBGEAR 论坛原网站用户端（Web）",
    longDescription:
      "CGBGEAR 社区论坛 Web 前端界面，提供响应式布局、实时发帖回帖、用户个人中心及交互式主题体验。",
    coverImage: "",
    techStack: ["JavaScript", "HTML5", "CSS3", "Vue"],
    links: {
      github: "https://github.com/FjiNeko/CGBGEAR_USER_INTERFACE",
    },
    featured: true,
    status: "active",
    statusLabel: "已上线",
    sort: 3,
  },
  {
    id: "co2",
    name: "CO2",
    description: "基于 Vue 构建的碳排放与环保数据可视化平台",
    longDescription:
      "采用 Vue 打造的 CO2 碳排放监测与数据分析交互系统，支持图表可视化与环境指标评估。",
    coverImage: "",
    techStack: ["Vue", "JavaScript", "ECharts", "CSS3"],
    links: {
      github: "https://github.com/FjiNeko/CO2",
    },
    featured: true,
    status: "active",
    statusLabel: "已上线",
    sort: 4,
  },
  {
    id: "iqiyi-scrapy-json",
    name: "IQIYI_Scrapy_Json",
    description: "爱奇艺风云榜榜单数据爬取与分析系统",
    longDescription:
      "基于 Scrapy 框架开发的网络爬虫，定时爬取并解析爱奇艺风云榜榜单数据，清洗后输出标准化 JSON 数据流。",
    coverImage: "",
    techStack: ["Python", "Scrapy", "XPath", "JSON"],
    links: {
      github: "https://github.com/FjiNeko/IQIYI_Scrapy_Json",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 5,
  },
  {
    id: "scrapy-douban-books",
    name: "Scrapy_Douban_Books",
    description: "豆瓣图书高分榜单爬虫与数据提取",
    longDescription:
      "基于 Scrapy 实现的豆瓣图书数据采集爬虫，抓取书名、评分、作者及出版信息，支持结构化存储。",
    coverImage: "",
    techStack: ["Python", "Scrapy", "Data Mining"],
    links: {
      github: "https://github.com/FjiNeko/Scrapy_Douban_Books",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 6,
  },
  {
    id: "scrapy-douban-movie250",
    name: "Scrapy_douban_movie250",
    description: "豆瓣电影 Top 250 数据采集与分析爬虫",
    longDescription:
      "爬取豆瓣电影 Top 250 经典榜单，包括电影评分、导演演员、经典台词与上映年份等多维度信息。",
    coverImage: "",
    techStack: ["Python", "Scrapy", "Requests"],
    links: {
      github: "https://github.com/FjiNeko/Scrapy_douban_movie250",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 7,
  },
  {
    id: "scrapy-guazi-car",
    name: "Scrapy_Guazi_Car",
    description: "瓜子二手车车辆交易信息爬虫",
    longDescription:
      "针对瓜子二手车平台的车辆信息采集与清洗爬虫，获取车型、里程、价格及上牌时间等结构化数据。",
    coverImage: "",
    techStack: ["Python", "Scrapy", "Data Extraction"],
    links: {
      github: "https://github.com/FjiNeko/Scrapy_Guazi_Car",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 8,
  },
  {
    id: "pandas-basic",
    name: "PandasBasic",
    description: "Python Pandas 数据分析与处理实践记录",
    longDescription:
      "系统化整理的 Python Pandas 数据处理与分析学习项目，涵盖 DataFrame 操作、数据清洗与统计分析。",
    coverImage: "",
    techStack: ["Python", "Pandas", "Jupyter"],
    links: {
      github: "https://github.com/FjiNeko/PandasBasic",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 9,
  },
  {
    id: "murder-mystery-datapack",
    name: "Murder-Mystery-DataPack-Downloading",
    description: "Minecraft 密室杀人 / 剧本杀数据包与资源管理",
    longDescription:
      "Minecraft 自定义游戏模式数据包，包含游戏规则、逻辑指令与地图资源管理。",
    coverImage: "",
    techStack: ["Minecraft", "DataPack", "JSON"],
    links: {
      github: "https://github.com/FjiNeko/Murder-Mystery-DataPack-Downloading",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 10,
  },
  {
    id: "server-resource-pack",
    name: "ServerResourePack",
    description: "Minecraft 服务器专用材质包与资源整合",
    longDescription:
      "专为多人联机服务器定制的材质与音效资源包整合配置。",
    coverImage: "",
    techStack: ["Minecraft", "ResourcePack"],
    links: {
      github: "https://github.com/FjiNeko/ServerResourePack",
    },
    featured: false,
    status: "active",
    statusLabel: "已完成",
    sort: 11,
  },
  {
    id: "html-css-js-website",
    name: "html-css-js-website",
    description: "原生前端三件套静态网页设计案例",
    longDescription:
      "基于原生 HTML5、CSS3 和 JavaScript 构建的现代化响应式网页设计与动画实践。",
    coverImage: "",
    techStack: ["HTML5", "CSS3", "JavaScript"],
    links: {
      github: "https://github.com/FjiNeko/html-css-js-website",
    },
    featured: false,
    status: "active",
    statusLabel: "已上线",
    sort: 12,
  },
];
