# 个人主页

极简、现代的个人主页：一屏说清**编程哲学**，然后是**正在构建**与**长期维护**的项目。
纯静态 Astro，零客户端框架，零追踪脚本。视觉遵循 Vercel / Geist 的设计语言——单色为主、
1px 描边、紧字距、克制的蓝色点缀。

- 深色 / 浅色主题，跟随系统并可手动切换（记忆在 `localStorage`）
- 单一内容配置文件，改文案不需要碰组件
- 无 JS 框架，整站 JS 加起来不到 1 kB
- 响应式，320px 到 1920px 无横向溢出
- 自带 404 页、robots.txt、社交分享卡

---

## 快速开始

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # 产物在 dist/
pnpm preview    # 本地预览构建产物
```

> **关于 Node**：请用官方 Node（≥ 20）。部分沙箱环境自带的 Node 二进制开启了
> hardened runtime 但缺少 `com.apple.security.cs.disable-library-validation`，
> 会导致 Rollup 的原生模块加载失败。官方发行版没有这个问题。

## 改内容

**只需要编辑一个文件：[`src/site.config.ts`](src/site.config.ts)。**

| 字段 | 作用 |
| --- | --- |
| `meta` | 标题、描述、域名、分享图 |
| `person` | 姓名、首字母缩写、身份、邮箱 |
| `hero` | 首屏状态胶囊、主标题（哲学主张）、导语、按钮、底部数据 |
| `philosophy` | 编程哲学条目，`title` + `body` 成对增删 |
| `projects.building` | 正在构建的项目 |
| `projects.maintaining` | 长期维护的项目 |
| `stack` | 日常工具链，按组分行 |
| `footer` | 页脚说明与社交链接 |

单个项目的字段：

```ts
{
  name: 'quarry',              // 项目名
  tagline: '把 SQL 当作类型系统的查询层',
  description: '2 行以内，超出会截断',
  language: 'TypeScript',      // 卡片右上角
  meta: 'v0.6 · 3 天前有提交',  // 卡片底部
  href: '#',                   // 项目主页，留空则整卡不可点
  repo: 'https://…',           // 源码地址，留空则不显示 Repo
  tags: ['类型推断', 'Postgres'],
}
```

改完之后记得把 `astro.config.mjs` 里的 `site` 换成真实域名。

## 改外观

设计 token 全部集中在 [`src/styles/global.css`](src/styles/global.css) 顶部的 `:root` 里：
颜色、圆角、缓动、字体栈、内容宽度。深色是默认值，`[data-theme='light']` 覆盖浅色。

几个刻意为之的细节：

- `--fg` / `--bg` 会互换使用（主按钮是「前景色底 + 背景色字」），所以改 token 就能整体反色。
- 顶部那条 1px 渐变线是全站唯一的彩色元素，除此之外只有 `--accent` 蓝和 `--live` 青。
- 字号用了 `clamp()`，字距按中文调过（拉丁字母的 `-0.05em` 会把汉字压到粘连）。

## 生成分享卡

[`public/og.png`](public/og.png)（1200×630）由 [`scripts/og-template.html`](scripts/og-template.html) 渲染而来：

```bash
node scripts/generate-og.mjs
node scripts/generate-og.mjs --name="张三" --statement="第一行|第二行"
```

需要本机装有 Chrome。也可以手动打开模板文件截图，文字通过 URL 参数传入。

## 部署到 Vercel

推到 GitHub 后在 Vercel 里 Import，框架会被自动识别为 Astro，无需任何配置。
或者直接用 CLI：

```bash
pnpm dlx vercel
```

构建命令 `astro build`，输出目录 `dist`。

## 目录结构

```
src/
├── site.config.ts          ← 所有内容都在这里
├── styles/global.css       ← 设计 token 与全部样式
├── layouts/Base.astro      ← <head>、主题脚本、背景装饰
├── components/
│   ├── Nav.astro           吸顶导航（滚动后出现毛玻璃底边）
│   ├── ThemeToggle.astro   明暗切换
│   ├── Hero.astro          首屏
│   ├── Philosophy.astro    编程哲学
│   ├── Projects.astro      项目分组
│   ├── ProjectCard.astro   单个项目卡
│   ├── Stack.astro         工具链
│   └── Footer.astro
└── pages/
    ├── index.astro
    └── 404.astro
```
