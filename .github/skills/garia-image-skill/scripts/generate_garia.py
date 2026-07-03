#!/usr/bin/env python3
"""
Garia AI 图片生成脚本
=======================
读取 images.json 中的提示词，调用 Garia 绘图 API 批量生成教学图片，
自动下载并保存到指定的图片目录。

使用方法:
    1. 在项目根目录创建 .env 文件（参考 scripts/.env.example）
    2. 编辑 .env 填入 Garia API 密钥
    3. 运行脚本:
       python .github/skills/garia-image-skill/scripts/generate_garia.py \
           --input C2-光现象/images.json \
           --output C2-光现象/c2-images

    4. 仅生成缺失的图片（已有图片自动跳过）:
       python .github/skills/garia-image-skill/scripts/generate_garia.py \
           --input C2-光现象/images.json \
           --output C2-光现象/c2-images \
           --skip-existing

    5. 单张图片生成:
       python .github/skills/garia-image-skill/scripts/generate_garia.py \
           --single \
           --prompt "阳光明媚的公园湖景" \
           --filename "park.png"
"""

import os
import sys
import json
import time
import argparse
import logging
import requests
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# ── 日志配置 ──────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("garia_image")


# ── 默认配置 ──────────────────────────────────────────
DEFAULT_GARIA_HOST = "https://api.garia.com"
GARIA_DRAW_ENDPOINT = "/v1/images/generations"
GARIA_RESULT_ENDPOINT = "/v1/images/result"

# 画面比例 → Garia 支持的分辨率映射
ASPECT_RATIO_MAP = {
    "16:9": "1792x1024",
    "1:1": "1024x1024",
    "3:2": "1536x1024",
    "4:3": "1368x1024",
    "21:9": "2016x864",
}


def load_images(json_path: str) -> list[dict]:
    """加载 images.json 文件，返回图片条目列表"""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    images = data.get("图片列表", [])
    log.info("✅ 从 %s 加载了 %d 个图片条目", json_path, len(images))
    return images


def get_existing_files(output_dir: str) -> set:
    """获取输出目录中已存在的文件名集合"""
    if not os.path.isdir(output_dir):
        return set()
    return {f for f in os.listdir(output_dir) if f.endswith(".png")}


def call_garia_draw(
    api_host: str,
    api_key: str,
    model: str,
    prompt: str,
    aspect_ratio: str,
    quality: str = "high",
    max_retries: int = 3,
) -> Optional[str]:
    """
    调用 Garia 绘图 API 生成图片。

    Garia API 使用异步任务模式：
    1. 提交任务，获取任务 ID
    2. 轮询任务结果，直到生成完成
    返回生成图片的 URL，失败返回 None。
    """
    url = f"{api_host.rstrip('/')}{GARIA_DRAW_ENDPOINT}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": model,
        "prompt": prompt,
        "size": aspect_ratio,  # Garia 使用 size 参数指定分辨率
        "quality": quality,
        "n": 1,  # 每次生成 1 张
        "response_format": "url",  # 返回 URL 格式
    }

    for attempt in range(1, max_retries + 1):
        try:
            log.info("  ⏳ 提交任务 (尝试 %d/%d)...", attempt, max_retries)
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            resp.raise_for_status()
            data = resp.json()

            # Garia 标准返回格式：{"code": 0, "data": {"id": "..."}}
            if data.get("code") != 0:
                log.warning(
                    "  ⚠️  提交失败: %s",
                    data.get("msg", data.get("message", "未知错误")),
                )
                if attempt < max_retries:
                    time.sleep(3)
                continue

            # 尝试多种可能的返回结构
            response_data = data.get("data", data)

            # 情况 1：直接返回图片 URL（同步模式）
            if isinstance(response_data, list) and len(response_data) > 0:
                image_url = response_data[0].get("url")
                if image_url:
                    log.info("  ✅ 直接获取到图片 URL")
                    return image_url

            # 情况 2：返回任务 ID（异步模式），需要轮询
            task_id = response_data.get("id") or data.get("id") or data.get("task_id")
            if task_id:
                log.info("  ✅ 任务提交成功，ID: %s", task_id)
                return poll_garia_result(api_host, api_key, task_id)

            # 情况 3：兼容 OpenAI 格式
            if isinstance(data, dict):
                image_url = (
                    data.get("data", [{}])[0].get("url")
                    if isinstance(data.get("data"), list)
                    else None
                )
                if image_url:
                    log.info("  ✅ 获取到图片 URL（OpenAI 格式）")
                    return image_url

            log.warning("  ⚠️  无法解析返回数据: %s", str(data)[:200])
            if attempt < max_retries:
                time.sleep(3)
                continue

        except requests.exceptions.Timeout:
            log.warning("  ⏰ 请求超时")
            if attempt < max_retries:
                time.sleep(5)
        except requests.exceptions.RequestException as e:
            log.warning("  ⚠️  请求失败: %s", e)
            if attempt < max_retries:
                time.sleep(5)

    log.error("  ❌ 提交失败（已重试 %d 次）", max_retries)
    return None


def poll_garia_result(
    api_host: str,
    api_key: str,
    task_id: str,
    max_wait: int = 300,
    poll_interval: int = 5,
) -> Optional[str]:
    """
    轮询 Garia 任务结果，直到生成完成或超时。
    兼容多种返回格式。
    """
    url = f"{api_host.rstrip('/')}{GARIA_RESULT_ENDPOINT}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    # 尝试多种查询方式
    query_methods = [
        {"id": task_id},  # POST body
        {"task_id": task_id},  # 替代字段名
    ]

    start_time = time.time()
    last_progress = -1

    while time.time() - start_time < max_wait:
        try:
            # 尝试 POST 方式查询
            resp = None
            for params in query_methods:
                try:
                    resp = requests.post(url, headers=headers, json=params, timeout=30)
                    resp.raise_for_status()
                    break
                except requests.exceptions.RequestException:
                    continue

            if resp is None:
                # 尝试 GET 方式
                get_url = f"{url}?id={task_id}"
                resp = requests.get(get_url, headers=headers, timeout=30)
                resp.raise_for_status()

            data = resp.json()

            # 解析返回数据
            code = data.get("code", 0)
            if code != 0 and code != -22:
                log.warning(
                    "  ⚠️  查询结果异常: %s", data.get("msg", data.get("message", ""))
                )
                time.sleep(poll_interval)
                continue

            if code == -22:
                log.warning("  ⚠️  任务不存在（可能已过期）")
                return None

            # 提取结果数据
            result = data.get("data", data)
            status = result.get("status", "") or data.get("status", "running")
            progress = result.get("progress", 0)

            # 进度显示
            if progress != last_progress:
                log.info("  📊 进度: %d%%  |  状态: %s", progress, status)
                last_progress = progress

            # ── 成功 ──
            if status in ("succeeded", "success", "completed", "done"):
                # 尝试多种结果路径
                image_url = None
                results = result.get("results", [])
                if results and isinstance(results, list):
                    image_url = results[0].get("url")
                if not image_url:
                    image_url = result.get("url")
                if not image_url:
                    image_url = data.get("url")
                if not image_url:
                    # OpenAI 兼容格式
                    data_list = data.get("data", [])
                    if isinstance(data_list, list) and data_list:
                        image_url = data_list[0].get("url")

                if image_url:
                    log.info("  ✅ 生成完成!")
                    return image_url
                log.warning("  ⚠️  生成成功但未找到图片 URL")
                return None

            # ── 失败 ──
            elif status in ("failed", "error", "failure"):
                reason = result.get("failure_reason", result.get("error", "unknown"))
                log.error("  ❌ 生成失败: %s", reason)
                return None

            time.sleep(poll_interval)

        except requests.exceptions.Timeout:
            log.warning("  ⏰ 轮询超时，继续等待...")
            time.sleep(poll_interval)
        except requests.exceptions.RequestException as e:
            log.warning("  ⚠️  轮询失败: %s", e)
            time.sleep(poll_interval)

    log.error("  ❌ 轮询超时（已等待 %d 秒）", max_wait)
    return None


def download_image(
    image_url: str,
    save_path: str,
    api_key: str,
    max_retries: int = 3,
) -> bool:
    """下载图片并保存到本地文件"""
    headers = {}

    for attempt in range(1, max_retries + 1):
        try:
            log.info("  ⬇️  下载图片 (尝试 %d/%d)...", attempt, max_retries)
            resp = requests.get(image_url, headers=headers, timeout=120)
            resp.raise_for_status()

            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "wb") as f:
                f.write(resp.content)

            file_size = len(resp.content)
            log.info("  ✅ 已保存: %s (%d KB)", save_path, file_size // 1024)
            return True

        except requests.exceptions.RequestException as e:
            log.warning("  ⚠️  下载失败: %s", e)
            if attempt < max_retries:
                time.sleep(3)

    return False


def resolve_aspect_ratio(aspect_ratio_str: str) -> str:
    """将画面比例字符串转换为 Garia 支持的分辨率格式"""
    ratio = aspect_ratio_str.strip().replace("：", ":")

    if ratio in ASPECT_RATIO_MAP:
        return ASPECT_RATIO_MAP[ratio]

    # 竖版 16:9
    if "竖版" in ratio or ratio == "9:16":
        return "1024x1792"

    # 尝试直接使用用户指定的分辨率
    if "x" in ratio.lower() and ratio[0].isdigit():
        return ratio

    return ASPECT_RATIO_MAP["16:9"]


def extract_aspect_ratio_from_prompt(prompt: str) -> str:
    """从提示词中提取画面比例信息"""
    prompt_lower = prompt.lower()
    if "16:9" in prompt_lower or "16：9" in prompt_lower or "横版" in prompt:
        return ASPECT_RATIO_MAP["16:9"]
    if "1:1" in prompt_lower or "1：1" in prompt_lower or "方形" in prompt:
        return ASPECT_RATIO_MAP["1:1"]
    if "竖版" in prompt or "纵向" in prompt:
        return "1024x1792"
    return ASPECT_RATIO_MAP["16:9"]


def generate_single(
    api_host: str,
    api_key: str,
    model: str,
    prompt: str,
    filename: str,
    aspect_ratio: str,
    quality: str,
    output_dir: str,
    max_retries: int,
) -> bool:
    """生成单张图片"""
    save_path = os.path.join(output_dir, filename)
    os.makedirs(output_dir, exist_ok=True)

    log.info("🖼️  单张生成: %s", filename)
    log.info("   提示词: %.80s...", prompt)
    log.info("   分辨率: %s", aspect_ratio)

    image_url = call_garia_draw(
        api_host=api_host,
        api_key=api_key,
        model=model,
        prompt=prompt,
        aspect_ratio=aspect_ratio,
        quality=quality,
        max_retries=max_retries,
    )

    if not image_url:
        log.error("    ❌ 生成失败")
        return False

    return download_image(
        image_url=image_url,
        save_path=save_path,
        api_key=api_key,
    )


def main():
    parser = argparse.ArgumentParser(
        description="Garia AI 教学图片生成工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    # 批量模式参数
    parser.add_argument(
        "--input",
        help="images.json 的路径（批量模式）",
    )
    parser.add_argument(
        "--output",
        default="images",
        help="图片输出目录 (默认: images)",
    )

    # 单张模式参数
    parser.add_argument(
        "--single",
        action="store_true",
        help="单张交互模式",
    )
    parser.add_argument(
        "--prompt",
        help="单张模式的提示词",
    )
    parser.add_argument(
        "--filename",
        default="output.png",
        help="单张模式的输出文件名 (默认: output.png)",
    )
    parser.add_argument(
        "--aspect-ratio",
        default="16:9",
        help="画面比例 (16:9, 1:1, 3:2, 4:3, 21:9) (默认: 16:9)",
    )

    # 公共参数
    parser.add_argument(
        "--model",
        default="garia-pro",
        help="AI 模型名称 (默认: garia-pro, 可选: garia-v2, garia-vip)",
    )
    parser.add_argument(
        "--quality",
        default="high",
        choices=["auto", "low", "medium", "high"],
        help="图片质量 (默认: high)",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="跳过已存在的图片（不重新生成）",
    )
    parser.add_argument(
        "--max-retries",
        type=int,
        default=3,
        help="每张图片的最大重试次数 (默认: 3)",
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=10,
        help="每张图片生成之间的等待间隔（秒）(默认: 10)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="仅列出需要生成的图片，不实际调用 API",
    )
    args = parser.parse_args()

    # ── 加载 .env 配置文件 ──────────────────────────
    # 优先从项目根目录加载 .env
    script_dir = Path(__file__).resolve().parent.parent.parent.parent  # 项目根目录
    env_path = script_dir / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=str(env_path), override=True)
        log.info("📄 已加载配置: %s", env_path)
    else:
        # 尝试从 skill 目录加载
        skill_dir = Path(__file__).resolve().parent.parent
        env_path = skill_dir / ".env"
        if env_path.exists():
            load_dotenv(dotenv_path=str(env_path), override=True)
            log.info("📄 已加载配置: %s", env_path)
        else:
            log.warning("⚠️  未找到 .env 文件，请在项目根目录创建")

    # ── 读取配置（优先环境变量，其次 .env 文件）──────
    api_key = os.environ.get("GARIA_API_KEY") or os.environ.get("API_KEY")
    api_host = os.environ.get("GARIA_API_HOST") or os.environ.get(
        "API_HOST", DEFAULT_GARIA_HOST
    )

    if not api_key and not args.dry_run:
        log.error(
            "❌ 未配置 GARIA_API_KEY！\n"
            "   请在项目根目录创建 .env 文件，内容如下:\n"
            "   GARIA_API_KEY=your-garia-api-key-here\n"
            "   GARIA_API_HOST=https://api.garia.com\n"
            "   参考 .github/skills/garia-image-skill/scripts/.env.example"
        )
        sys.exit(1)

    # ── 单张模式 ──────────────────────────────────────
    if args.single:
        if not args.prompt:
            # 交互式输入
            log.info("📝 请输入图片描述（输入空行结束）:")
            lines = []
            while True:
                try:
                    line = input()
                    if not line:
                        break
                    lines.append(line)
                except EOFError:
                    break
            prompt = "\n".join(lines)
            if not prompt:
                log.error("❌ 提示词不能为空")
                sys.exit(1)
        else:
            prompt = args.prompt

        aspect_ratio = resolve_aspect_ratio(args.aspect_ratio)
        output_dir = script_dir / args.output

        ok = generate_single(
            api_host=api_host,
            api_key=api_key,
            model=args.model,
            prompt=prompt,
            filename=args.filename,
            aspect_ratio=aspect_ratio,
            quality=args.quality,
            output_dir=str(output_dir),
            max_retries=args.max_retries,
        )
        sys.exit(0 if ok else 1)

    # ── 批量模式 ──────────────────────────────────────
    if not args.input:
        log.error("❌ 批量模式需要指定 --input 参数")
        log.info(
            "   使用方式: python generate_garia.py --input C2-光现象/images.json --output C2-光现象/c2-images"
        )
        log.info("   或者使用 --single 单张模式")
        sys.exit(1)

    input_path = script_dir / args.input
    output_dir = script_dir / args.output

    if not input_path.exists():
        log.error("❌ 找不到 %s", input_path)
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    # ── 加载图片列表 ──────────────────────────────────
    images = load_images(str(input_path))
    existing = get_existing_files(str(output_dir))

    # 过滤出需要生成的图片
    pending = []
    skipped = 0
    for img in images:
        filename = img.get("filename", "")
        if not filename:
            continue
        if args.skip_existing and filename in existing:
            skipped += 1
            continue
        pending.append(img)

    # ── 打印概要 ──────────────────────────────────────
    total = len(images)
    log.info("📊 图片总数: %d", total)
    log.info("⏭️  跳过已有: %d", skipped)
    log.info("🆕 待生成: %d", len(pending))
    log.info("📁 输出目录: %s", output_dir)
    log.info("")

    if args.dry_run:
        log.info("🔍 [Dry Run] 将生成以下图片:")
        for img in pending:
            log.info("   • %s  [%s]", img["filename"], img.get("用途", ""))
        return

    if not pending:
        log.info("✅ 所有图片已存在，无需生成！")
        return

    # ── 开始生成 ──────────────────────────────────────
    success_count = 0
    fail_count = 0

    for i, img in enumerate(pending, 1):
        filename = img["filename"]
        prompt = img.get("prompt_zh", img.get("prompt_en", ""))
        chapter = img.get("章节", "")
        usage = img.get("用途", "")

        log.info("─" * 60)
        log.info("🖼️  [%d/%d] %s", i, len(pending), filename)
        log.info("   章节: %s", chapter)
        log.info("   用途: %s", usage)

        if not prompt:
            log.warning("    ⚠️  无提示词，跳过")
            fail_count += 1
            continue

        # 确定画面比例
        aspect_ratio = extract_aspect_ratio_from_prompt(prompt)

        # 调用 API
        log.info("   提示词: %.80s...", prompt)
        log.info("   分辨率: %s", aspect_ratio)

        image_url = call_garia_draw(
            api_host=api_host,
            api_key=api_key,
            model=args.model,
            prompt=prompt,
            aspect_ratio=aspect_ratio,
            quality=args.quality,
            max_retries=args.max_retries,
        )

        if not image_url:
            log.error("    ❌ 生成失败: %s", filename)
            fail_count += 1
            continue

        # 下载图片
        save_path = str(output_dir / filename)
        ok = download_image(
            image_url=image_url,
            save_path=save_path,
            api_key=api_key,
        )

        if ok:
            success_count += 1
        else:
            log.error("    ❌ 下载失败: %s", filename)
            fail_count += 1

        # 生成间隔，避免 API 限流
        if i < len(pending):
            log.info("    ⏳ 等待 %d 秒...", args.interval)
            time.sleep(args.interval)

    # ── 完成报告 ──────────────────────────────────────
    log.info("")
    log.info("=" * 60)
    log.info("📊 生成完成!")
    log.info("   ✅ 成功: %d", success_count)
    log.info("   ❌ 失败: %d", fail_count)
    log.info("   ⏭️  跳过: %d", skipped)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
