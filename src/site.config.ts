/**
 * ─────────────────────────────────────────────────────────────
 *  站点内容配置
 *  改这个文件就够了 —— 名字、哲学、项目、链接全在这里。
 *  组件层不需要动。
 * ─────────────────────────────────────────────────────────────
 */

export type ProjectStatus = 'building' | 'maintained';

export interface Project {
  /** 项目名，建议小写单词 */
  name: string;
  /** 一行标语，出现在名称下方 */
  tagline: string;
  /** 2 行以内的描述，超出会被截断 */
  description: string;
  /** 主要语言，显示在卡片右上角 */
  language: string;
  /** 卡片底部的元信息，用 · 分隔 */
  meta: string;
  /** 项目主页；留空则不渲染箭头 */
  href?: string;
  /** 源码地址；留空则不渲染 ↗ */
  repo?: string;
  /** 关键词，2–3 个最佳 */
  tags?: string[];
}

export interface Principle {
  title: string;
  body: string;
}

export interface Action {
  label: string;
  href: string;
  style: 'primary' | 'secondary';
  external?: boolean;
}

export const site = {
  /* ── 基本信息 ─────────────────────────────────────────── */
  meta: {
    title: 'Neonity — 独立开发者',
    description:
      '个人主页：编程哲学，以及正在构建和维护的项目。喜欢小接口、明确的边界，以及三年后还能读懂的代码。',
    /** 部署后换成真实域名 */
    url: 'https://example.com',
    /** 社交分享卡片，由 scripts/og-template.html 生成 */
    ogImage: '/og.png',
    lang: 'zh-CN',
  },

  person: {
    name: 'Neonity',
    /** 头像位置放你的名字首字母，或改成 logo 字符 */
    monogram: 'N',
    handle: '@neonity',
    role: '独立开发者 · 全栈工程师',
    location: '杭州',
    email: 'hi@example.com',
  },

  /* ── 首屏 ─────────────────────────────────────────────── */
  hero: {
    /** 顶部胶囊里的状态文案 */
    status: '正在构建 quarry',
    statusHref: '#building',
    /** 主标题。哲学主张放这里，1–2 句最佳 */
    statement: '用尽可能少的抽象，\n解决尽可能真实的问题。',
    /** 1–2 句自我介绍 */
    lede: '我做工具、基础设施，和一些有点固执的软件。大部分时间在删代码，而不是写代码。',
    /** 建议只留 2 个：手机上刚好一行放得下 */
    actions: <Action[]>[
      { label: '正在构建的项目', href: '#building', style: 'primary' },
      { label: 'GitHub', href: 'https://github.com/Neonity2020', style: 'secondary', external: true },
    ],
    /** 首屏底部的等宽小字数据，3–4 项最佳，数字自己改 */
    facts: [
      { k: '经验', v: '9 年' },
      { k: '主力语言', v: 'TypeScript / Go' },
      { k: '在维护', v: '3 个项目' },
      { k: '所在地', v: '杭州 · UTC+8' },
    ],
  },

  /* ── 编程哲学 ─────────────────────────────────────────── */
  philosophy: {
    index: '01',
    label: 'Philosophy',
    title: '我相信的事',
    desc: '不是格言，是我在真实项目里反复验证过的取舍标准。',
    principles: <Principle[]>[
      {
        title: '先让它正确，再让它快。',
        body: '读不懂的代码无法被优化。可读性是性能的前提，而不是它的代价。慢而正确的东西有机会变快，快而错误的东西没有。',
      },
      {
        title: '抽象是债，不是资产。',
        body: '只在同一件事重复到第三次时才抽象。在那之前，重复的成本远低于一个猜错方向的抽象。删掉一层间接，通常比加一层更能解决问题。',
      },
      {
        title: '边界要显式，错误要吵闹。',
        body: '失败应该发生在离原因最近的地方。把异常吞掉再在远处崩溃，是把调试成本从五分钟变成五小时的最快方式。',
      },
      {
        title: '工具应该消失。',
        body: '最好的基础设施是你在用它时不会想起它。如果一个工具需要持续的解释和配置才能真正发挥作用，那它还没做完。',
      },
    ],
  },

  /* ── 项目 ─────────────────────────────────────────────── */
  projects: {
    building: {
      index: '02',
      label: 'Building',
      title: '正在构建',
      desc: '还没到 1.0，接口可能明天就变。',
      items: <Project[]>[
        {
          name: 'quarry',
          tagline: '把 SQL 当作类型系统的查询层',
          description:
            '在编译期把查询语句推导成精确的返回类型，不需要 codegen，也不需要手写映射。目标是让「数据库返回了什么」不再是运行时才揭晓的答案。',
          language: 'TypeScript',
          meta: 'v0.6 · 3 天前有提交',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['类型推导', 'Postgres'],
        },
        {
          name: 'relay',
          tagline: '本地优先的同步引擎',
          description:
            '离线是默认状态，联网只是加速。冲突解决策略用可执行的代码描述，而不是写在文档里等某天被误解。',
          language: 'Rust',
          meta: 'v0.2 · 2 周前有提交',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['CRDT', '离线优先'],
        },
        {
          name: 'atlas',
          tagline: '把任意仓库变成可查询的知识图谱',
          description:
            '索引代码结构与跨文件引用，让「这个函数还有谁在用」这类问题用一条查询回答，而不是靠全局搜索加肉眼确认。',
          language: 'Go',
          meta: '实验阶段 · 本周有提交',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['静态分析', '索引'],
        },
      ],
    },

    maintaining: {
      index: '03',
      label: 'Maintaining',
      title: '长期维护',
      desc: '已经稳定，接口冻结，主要收 bug 修复和小幅改进。',
      items: <Project[]>[
        {
          name: 'grain',
          tagline: '极简状态机运行时',
          description:
            '压缩后 1.4 kB，零依赖。只做状态转移和副作用调度这一件事，其余交给调用方决定。',
          language: 'TypeScript',
          meta: 'v4.2 · 1.2k stars',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['零依赖', '1.4 kB'],
        },
        {
          name: 'inkwell',
          tagline: 'Markdown 到任意格式的编译管线',
          description:
            '解析一次，输出多种。为文档站点构建，支持自定义 AST 变换，插件只有一个函数签名。',
          language: 'TypeScript',
          meta: 'v2.8 · 稳定',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['AST', '插件'],
        },
        {
          name: 'dotfiles',
          tagline: '用了 7 年的终端配置',
          description: '一次 clone 到位的开发环境。跨 macOS 与 Linux，无框架，只有符号链接和一个安装脚本。',
          language: 'Shell',
          meta: '持续更新',
          href: '#',
          repo: 'https://github.com/Neonity2020',
          tags: ['Neovim', 'zsh'],
        },
      ],
    },
  },

  /* ── 工具链 ───────────────────────────────────────────── */
  stack: {
    index: '04',
    label: 'Toolchain',
    title: '日常工具',
    /** 分组，每组一行 */
    groups: [
      { k: '语言', v: ['TypeScript', 'Go', 'Rust', 'SQL'] },
      { k: '运行时', v: ['Node', 'Bun', 'Postgres', 'Redis'] },
      { k: '界面', v: ['Astro', 'Svelte', 'CSS', '无框架优先'] },
      { k: '环境', v: ['Neovim', 'tmux', 'Ghostty', 'macOS / Linux'] },
    ],
  },

  /* ── 页脚 ─────────────────────────────────────────────── */
  footer: {
    note: '用 Astro 构建，部署在 Vercel。没有追踪脚本。',
    socials: [
      { label: 'GitHub', href: 'https://github.com/Neonity2020' },
      { label: 'X', href: 'https://x.com/' },
      { label: 'Email', href: 'mailto:hi@example.com' },
    ],
  },
} as const;
