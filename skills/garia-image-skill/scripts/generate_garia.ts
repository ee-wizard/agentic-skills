#!/usr/bin/env node

/**
 * Garia AI 图片生成脚本 (TypeScript)
 * ====================================
 * 读取 images.json 中的提示词，调用 Garia 绘图 API 批量生成教学图片，
 * 自动下载并保存到指定的图片目录。
 *
 * 使用方法:
 *   1. 在项目根目录创建 .env 文件（参考 scripts/.env.example）
 *   2. 编辑 .env 填入 Garia API 密钥
 *   3. 编译并运行:
 *      npx ts-node skills/garia-image-skill/scripts/generate_garia.ts \
 *          --input C2-光现象/images.json \
 *          --output C2-光现象/c2-images
 *
 *   4. 仅生成缺失的图片（已有图片自动跳过）:
 *      npx ts-node skills/garia-image-skill/scripts/generate_garia.ts \
 *          --input C2-光现象/images.json \
 *          --output C2-光现象/c2-images \
 *          --skip-existing
 *
 *   5. 单张图片生成:
 *      npx ts-node skills/garia-image-skill/scripts/generate_garia.ts \
 *          --single \
 *          --prompt "阳光明媚的公园湖景" \
 *          --filename "park.png"
 */

import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import axios, { AxiosError } from "axios";
import * as dotenv from "dotenv";

// ── 类型定义 ────────────────────────────────────────

interface ImageEntry {
  filename?: string;
  prompt_zh?: string;
  prompt_en?: string;
  章节?: string;
  用途?: string;
  [key: string]: unknown;
}

interface ImagesData {
  图片列表?: ImageEntry[];
  [key: string]: unknown;
}

interface GariaResponse {
  code?: number;
  msg?: string;
  message?: string;
  data?: GariaData | GariaResultItem[];
  id?: string;
  task_id?: string;
  url?: string;
  status?: string;
  progress?: number;
  results?: Array<{ url?: string }>;
}

interface GariaData {
  id?: string;
  status?: string;
  progress?: number;
  results?: Array<{ url?: string }>;
  url?: string;
  failure_reason?: string;
  error?: string;
}

interface GariaResultItem {
  url?: string;
}

// ── 日志工具 ────────────────────────────────────────

function logInfo(message: string): void {
  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });
  console.log(`${time} [INFO] ${message}`);
}

function logWarn(message: string): void {
  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });
  console.warn(`${time} [WARN] ${message}`);
}

function logError(message: string): void {
  const now = new Date();
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });
  console.error(`${time} [ERROR] ${message}`);
}

// ── 默认配置 ────────────────────────────────────────

const DEFAULT_GARIA_HOST = "https://api.garia.com";
const GARIA_DRAW_ENDPOINT = "/v1/images/generations";
const GARIA_RESULT_ENDPOINT = "/v1/images/result";

const ASPECT_RATIO_MAP: Record<string, string> = {
  "16:9": "1792x1024",
  "1:1": "1024x1024",
  "3:2": "1536x1024",
  "4:3": "1368x1024",
  "21:9": "2016x864",
};

// ── 核心函数 ────────────────────────────────────────

function loadImages(jsonPath: string): ImageEntry[] {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data: ImagesData = JSON.parse(raw);
  const images = data["图片列表"] || [];
  logInfo(`✅ 从 ${jsonPath} 加载了 ${images.length} 个图片条目`);
  return images;
}

function getExistingFiles(outputDir: string): Set<string> {
  if (!fs.existsSync(outputDir)) {
    return new Set();
  }
  const files = fs.readdirSync(outputDir);
  return new Set(files.filter((f) => f.endsWith(".png")));
}

async function callGariaDraw(
  apiHost: string,
  apiKey: string,
  model: string,
  prompt: string,
  aspectRatio: string,
  quality: string = "high",
  maxRetries: number = 3,
): Promise<string | null> {
  const url = `${apiHost.replace(/\/+$/, "")}${GARIA_DRAW_ENDPOINT}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const payload = {
    model,
    prompt,
    size: aspectRatio,
    quality,
    n: 1,
    response_format: "url",
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logInfo(`  ⏳ 提交任务 (尝试 ${attempt}/${maxRetries})...`);
      const resp = await axios.post<GariaResponse>(url, payload, {
        headers,
        timeout: 60000,
      });
      const data = resp.data;

      // Garia 标准返回格式：{ code: 0, data: { id: "..." } }
      if (data.code !== undefined && data.code !== 0) {
        logWarn(`  ⚠️  提交失败: ${data.msg || data.message || "未知错误"}`);
        if (attempt < maxRetries) {
          await sleep(3000);
        }
        continue;
      }

      // 情况 1：直接返回图片 URL（同步模式）
      if (Array.isArray(data.data)) {
        const imageUrl = data.data[0]?.url;
        if (imageUrl) {
          logInfo("  ✅ 直接获取到图片 URL");
          return imageUrl;
        }
      }

      // 情况 2：返回任务 ID（异步模式），需要轮询
      const responseData = data.data as GariaData | undefined;
      const taskId = responseData?.id || data.id || data.task_id;
      if (taskId) {
        logInfo(`  ✅ 任务提交成功，ID: ${taskId}`);
        return await pollGariaResult(apiHost, apiKey, taskId);
      }

      // 情况 3：兼容 OpenAI 格式
      const openaiData = (data as unknown as { data?: Array<{ url?: string }> })
        .data;
      if (Array.isArray(openaiData) && openaiData[0]?.url) {
        logInfo("  ✅ 获取到图片 URL（OpenAI 格式）");
        return openaiData[0].url;
      }

      logWarn(`  ⚠️  无法解析返回数据: ${JSON.stringify(data).slice(0, 200)}`);
      if (attempt < maxRetries) {
        await sleep(3000);
      }
    } catch (err) {
      if (err instanceof AxiosError && err.code === "ECONNABORTED") {
        logWarn("  ⏰ 请求超时");
      } else {
        logWarn(
          `  ⚠️  请求失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      if (attempt < maxRetries) {
        await sleep(5000);
      }
    }
  }

  logError(`  ❌ 提交失败（已重试 ${maxRetries} 次）`);
  return null;
}

async function pollGariaResult(
  apiHost: string,
  apiKey: string,
  taskId: string,
  maxWait: number = 300,
  pollInterval: number = 5,
): Promise<string | null> {
  const url = `${apiHost.replace(/\/+$/, "")}${GARIA_RESULT_ENDPOINT}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const startTime = Date.now();
  let lastProgress = -1;

  while (Date.now() - startTime < maxWait * 1000) {
    try {
      // 尝试 POST 方式查询
      let resp;
      try {
        resp = await axios.post<GariaResponse>(
          url,
          { id: taskId },
          { headers, timeout: 30000 },
        );
      } catch {
        // 尝试 GET 方式
        resp = await axios.get<GariaResponse>(`${url}?id=${taskId}`, {
          headers,
          timeout: 30000,
        });
      }

      const data = resp.data;
      const code = data.code ?? 0;

      if (code !== 0 && code !== -22) {
        logWarn(`  ⚠️  查询结果异常: ${data.msg || data.message || ""}`);
        await sleep(pollInterval * 1000);
        continue;
      }

      if (code === -22) {
        logWarn("  ⚠️  任务不存在（可能已过期）");
        return null;
      }

      const result = (data.data || data) as GariaData;
      const status = result.status || data.status || "running";
      const progress = result.progress ?? 0;

      if (progress !== lastProgress) {
        logInfo(`  📊 进度: ${progress}%  |  状态: ${status}`);
        lastProgress = progress;
      }

      // ── 成功 ──
      if (["succeeded", "success", "completed", "done"].includes(status)) {
        let imageUrl: string | undefined;

        if (Array.isArray(result.results)) {
          imageUrl = result.results[0]?.url;
        }
        imageUrl = imageUrl || result.url || data.url;

        // OpenAI 兼容格式
        if (!imageUrl) {
          const openaiData = (
            data as unknown as { data?: Array<{ url?: string }> }
          ).data;
          if (Array.isArray(openaiData)) {
            imageUrl = openaiData[0]?.url;
          }
        }

        if (imageUrl) {
          logInfo("  ✅ 生成完成!");
          return imageUrl;
        }
        logWarn("  ⚠️  生成成功但未找到图片 URL");
        return null;
      }

      // ── 失败 ──
      if (["failed", "error", "failure"].includes(status)) {
        const reason = result.failure_reason || result.error || "unknown";
        logError(`  ❌ 生成失败: ${reason}`);
        return null;
      }

      await sleep(pollInterval * 1000);
    } catch (err) {
      if (err instanceof AxiosError && err.code === "ECONNABORTED") {
        logWarn("  ⏰ 轮询超时，继续等待...");
      } else {
        logWarn(
          `  ⚠️  轮询失败: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      await sleep(pollInterval * 1000);
    }
  }

  logError(`  ❌ 轮询超时（已等待 ${maxWait} 秒）`);
  return null;
}

async function downloadImage(
  imageUrl: string,
  savePath: string,
  _apiKey?: string,
  maxRetries: number = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logInfo(`  ⬇️  下载图片 (尝试 ${attempt}/${maxRetries})...`);
      const resp = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 120000,
      });

      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, Buffer.from(resp.data));

      const fileSize = Buffer.from(resp.data).length;
      logInfo(`  ✅ 已保存: ${savePath} (${Math.round(fileSize / 1024)} KB)`);
      return true;
    } catch (err) {
      logWarn(
        `  ⚠️  下载失败: ${err instanceof Error ? err.message : String(err)}`,
      );
      if (attempt < maxRetries) {
        await sleep(3000);
      }
    }
  }
  return false;
}

function resolveAspectRatio(aspectRatioStr: string): string {
  const ratio = aspectRatioStr.trim().replace("：", ":");

  if (ratio in ASPECT_RATIO_MAP) {
    return ASPECT_RATIO_MAP[ratio];
  }

  if (ratio.includes("竖版") || ratio === "9:16") {
    return "1024x1792";
  }

  if (ratio.toLowerCase().includes("x") && /^\d/.test(ratio)) {
    return ratio;
  }

  return ASPECT_RATIO_MAP["16:9"];
}

function extractAspectRatioFromPrompt(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (
    lower.includes("16:9") ||
    lower.includes("16：9") ||
    prompt.includes("横版")
  ) {
    return ASPECT_RATIO_MAP["16:9"];
  }
  if (
    lower.includes("1:1") ||
    lower.includes("1：1") ||
    prompt.includes("方形")
  ) {
    return ASPECT_RATIO_MAP["1:1"];
  }
  if (prompt.includes("竖版") || prompt.includes("纵向")) {
    return "1024x1792";
  }
  return ASPECT_RATIO_MAP["16:9"];
}

async function generateSingle(
  apiHost: string,
  apiKey: string,
  model: string,
  prompt: string,
  filename: string,
  aspectRatio: string,
  quality: string,
  outputDir: string,
  maxRetries: number,
): Promise<boolean> {
  const savePath = path.join(outputDir, filename);
  fs.mkdirSync(outputDir, { recursive: true });

  logInfo(`🖼️  单张生成: ${filename}`);
  logInfo(`   提示词: ${prompt.slice(0, 80)}...`);
  logInfo(`   分辨率: ${aspectRatio}`);

  const imageUrl = await callGariaDraw(
    apiHost,
    apiKey,
    model,
    prompt,
    aspectRatio,
    quality,
    maxRetries,
  );

  if (!imageUrl) {
    logError("    ❌ 生成失败");
    return false;
  }

  return await downloadImage(imageUrl, savePath, apiKey);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── 入口 ────────────────────────────────────────────

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("generate_garia")
    .description("Garia AI 教学图片生成工具")
    .option("--input <path>", "images.json 的路径（批量模式）")
    .option("--output <dir>", "图片输出目录", "images")
    .option("--single", "单张交互模式")
    .option("--prompt <text>", "单张模式的提示词")
    .option("--filename <name>", "单张模式的输出文件名", "output.png")
    .option(
      "--aspect-ratio <ratio>",
      "画面比例 (16:9, 1:1, 3:2, 4:3, 21:9)",
      "16:9",
    )
    .option("--model <name>", "AI 模型名称", "garia-pro")
    .option("--quality <level>", "图片质量", "high")
    .option("--skip-existing", "跳过已存在的图片")
    .option("--max-retries <n>", "每张图片的最大重试次数", "3")
    .option("--interval <n>", "每张图片生成间隔（秒）", "10")
    .option("--dry-run", "仅列出需要生成的图片，不实际调用 API")
    .parse(process.argv);

  const opts = program.opts();

  // ── 加载 .env 配置文件 ──────────────────────────
  const scriptDir = path.resolve(__dirname, "..");
  const projectRoot = path.resolve(scriptDir, "..", "..", "..");

  // 优先从项目根目录加载 .env
  let envPath = path.join(projectRoot, ".env");
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
    logInfo(`📄 已加载配置: ${envPath}`);
  } else {
    // 尝试从 skill 目录加载
    envPath = path.join(scriptDir, "..", ".env");
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: true });
      logInfo(`📄 已加载配置: ${envPath}`);
    } else {
      logWarn("⚠️  未找到 .env 文件，请在项目根目录创建");
    }
  }

  // ── 读取配置 ─────────────────────────────────────
  const apiKey = process.env.GARIA_API_KEY || process.env.API_KEY || "";
  const apiHost =
    process.env.GARIA_API_HOST || process.env.API_HOST || DEFAULT_GARIA_HOST;
  const maxRetries = parseInt(opts.maxRetries, 10) || 3;
  const interval = parseInt(opts.interval, 10) || 10;

  if (!apiKey && !opts.dryRun) {
    logError(
      "❌ 未配置 GARIA_API_KEY！\n" +
        "   请在项目根目录创建 .env 文件，内容如下:\n" +
        "   GARIA_API_KEY=your-garia-api-key-here\n" +
        "   GARIA_API_HOST=https://api.garia.com\n" +
        "   参考 skills/garia-image-skill/scripts/.env.example",
    );
    process.exit(1);
  }

  // ── 单张模式 ──────────────────────────────────────
  if (opts.single) {
    let prompt = opts.prompt;
    if (!prompt) {
      logInfo("📝 请输入图片描述:");
      const lines: string[] = [];
      // 使用 readline
      const readline = await import("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const question = (query: string): Promise<string> =>
        new Promise((resolve) => rl.question(query, resolve));

      while (true) {
        const line = await question("");
        if (!line) break;
        lines.push(line);
      }
      rl.close();
      prompt = lines.join("\n");
      if (!prompt) {
        logError("❌ 提示词不能为空");
        process.exit(1);
      }
    }

    const aspectRatio = resolveAspectRatio(opts.aspectRatio);
    const outputDir = path.resolve(opts.output);

    const ok = await generateSingle(
      apiHost,
      apiKey,
      opts.model,
      prompt,
      opts.filename,
      aspectRatio,
      opts.quality,
      outputDir,
      maxRetries,
    );
    process.exit(ok ? 0 : 1);
  }

  // ── 批量模式 ──────────────────────────────────────
  if (!opts.input) {
    logError("❌ 批量模式需要指定 --input 参数");
    logInfo(
      "   使用方式: npx ts-node generate_garia.ts --input C2-光现象/images.json --output C2-光现象/c2-images",
    );
    logInfo("   或者使用 --single 单张模式");
    process.exit(1);
  }

  const inputPath = path.resolve(opts.input);
  const outputDir = path.resolve(opts.output);

  if (!fs.existsSync(inputPath)) {
    logError(`❌ 找不到 ${inputPath}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  // ── 加载图片列表 ──────────────────────────────────
  const images = loadImages(inputPath);
  const existing = getExistingFiles(outputDir);

  const pending: ImageEntry[] = [];
  let skipped = 0;

  for (const img of images) {
    const filename = img.filename;
    if (!filename) continue;
    if (opts.skipExisting && existing.has(filename)) {
      skipped++;
      continue;
    }
    pending.push(img);
  }

  // ── 打印概要 ──────────────────────────────────────
  logInfo(`📊 图片总数: ${images.length}`);
  logInfo(`⏭️  跳过已有: ${skipped}`);
  logInfo(`🆕 待生成: ${pending.length}`);
  logInfo(`📁 输出目录: ${outputDir}`);

  if (opts.dryRun) {
    logInfo("🔍 [Dry Run] 将生成以下图片:");
    for (const img of pending) {
      logInfo(`   • ${img.filename}  [${img["用途"] || ""}]`);
    }
    return;
  }

  if (pending.length === 0) {
    logInfo("✅ 所有图片已存在，无需生成！");
    return;
  }

  // ── 开始生成 ──────────────────────────────────────
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pending.length; i++) {
    const img = pending[i];
    const filename = img.filename || "";
    const prompt = img.prompt_zh || img.prompt_en || "";
    const chapter = img["章节"] || "";
    const usage = img["用途"] || "";

    logInfo("─".repeat(60));
    logInfo(`🖼️  [${i + 1}/${pending.length}] ${filename}`);
    logInfo(`   章节: ${chapter}`);
    logInfo(`   用途: ${usage}`);

    if (!prompt) {
      logWarn("    ⚠️  无提示词，跳过");
      failCount++;
      continue;
    }

    const aspectRatio = extractAspectRatioFromPrompt(prompt);
    logInfo(`   提示词: ${prompt.slice(0, 80)}...`);
    logInfo(`   分辨率: ${aspectRatio}`);

    const imageUrl = await callGariaDraw(
      apiHost,
      apiKey,
      opts.model,
      prompt,
      aspectRatio,
      opts.quality,
      maxRetries,
    );

    if (!imageUrl) {
      logError(`    ❌ 生成失败: ${filename}`);
      failCount++;
      continue;
    }

    const savePath = path.join(outputDir, filename);
    const ok = await downloadImage(imageUrl, savePath, apiKey);

    if (ok) {
      successCount++;
    } else {
      logError(`    ❌ 下载失败: ${filename}`);
      failCount++;
    }

    if (i < pending.length - 1) {
      logInfo(`    ⏳ 等待 ${interval} 秒...`);
      await sleep(interval * 1000);
    }
  }

  // ── 完成报告 ──────────────────────────────────────
  logInfo("");
  logInfo("=".repeat(60));
  logInfo("📊 生成完成!");
  logInfo(`   ✅ 成功: ${successCount}`);
  logInfo(`   ❌ 失败: ${failCount}`);
  logInfo(`   ⏭️  跳过: ${skipped}`);
  logInfo("=".repeat(60));
}

main().catch((err) => {
  logError(
    `❌ 运行时错误: ${err instanceof Error ? err.message : String(err)}`,
  );
  process.exit(1);
});
