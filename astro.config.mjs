import { defineConfig } from 'astro/config';

// 极简静态站：无 UI 框架、无客户端运行时。
// 部署到 Vercel 时零配置即可（Vercel 会自动识别 Astro）。
export default defineConfig({
  // 换成你自己的域名，用于生成 canonical / sitemap
  site: 'https://example.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
