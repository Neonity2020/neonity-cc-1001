// 生成 public/og.png —— 把 scripts/og-template.html 渲染成 1200×630 的分享卡
//
// 用法:  node scripts/generate-og.mjs
//        node scripts/generate-og.mjs --name="张三" --statement="第一行|第二行"
//
// 需要本机装有 Chrome。文案改了之后重跑一次即可。
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/* ── 默认文案（与 site.config.ts 保持一致即可） ─────────── */
const DEFAULTS = {
  name: '你的名字',
  monogram: 'N',
  role: '独立开发者 · 全栈工程师',
  handle: 'github.com/Neonity',
  statement: '用尽可能少的抽象，|解决尽可能真实的问题。',
};

const ROOT = resolve(import.meta.dirname, '..');
const PORT = 4399;
const DEBUG_PORT = 9333;

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

/* ── 1. 起一个静态服务，让模板能加载 node_modules 里的字体 ── */
const MIME = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = join(ROOT, path);
    if (!file.startsWith(ROOT)) throw new Error('越界');
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': MIME[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

/* ── 2. 合并命令行参数与默认文案 ───────────────────────── */
const cli = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => arg.match(/^--([^=]+)=?(.*)$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]])
);
const args = new URLSearchParams({ ...DEFAULTS, ...cli });

/* ── 3. 启动 Chrome ───────────────────────────────────── */
const chromePath = CHROME_CANDIDATES.find(existsSync);
if (!chromePath) {
  console.error('找不到 Chrome。可以手动打开 scripts/og-template.html 截图 1200×630。');
  server.close();
  process.exit(1);
}

const profile = await mkdtemp(join(tmpdir(), 'og-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu-sandbox',
    '--in-process-gpu',
    '--disable-breakpad',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    '--hide-scrollbars',
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let up = false;
for (let i = 0; i < 40 && !up; i++) {
  try {
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
    up = true;
  } catch {
    await sleep(250);
  }
}

const cleanup = async (code) => {
  chrome.kill();
  server.close();
  await rm(profile, { recursive: true, force: true });
  process.exit(code);
};

if (!up) {
  console.error('Chrome 没能启动');
  await cleanup(1);
}

/* ── 4. 用 CDP 截图 ───────────────────────────────────── */
const target = await (
  await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: 'PUT' })
).json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const msgId = ++id;
    pending.set(msgId, { res, rej });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
ws.addEventListener('message', (raw) => {
  const msg = JSON.parse(raw.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  }
});
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1200,
  height: 630,
  deviceScaleFactor: 1,
  mobile: false,
});

const loaded = new Promise((r) => {
  const h = (raw) => {
    if (JSON.parse(raw.data).method === 'Page.loadEventFired') {
      ws.removeEventListener('message', h);
      r();
    }
  };
  ws.addEventListener('message', h);
});

await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/scripts/og-template.html?${args}` });
await loaded;
await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
await sleep(300);

const { data } = await send('Page.captureScreenshot', { format: 'png' });
await writeFile(join(ROOT, 'public', 'og.png'), Buffer.from(data, 'base64'));

console.log('已生成 public/og.png (1200×630)');
ws.close();
await cleanup(0);
