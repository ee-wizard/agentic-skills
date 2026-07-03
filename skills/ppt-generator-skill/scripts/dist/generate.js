#!/usr/bin/env node
"use strict";
/**
 * PPT Generator - 通用 PPT 生成脚本 (TypeScript)
 * 使用 pptxgenjs 生成专业 PPT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OUTLINE = exports.COLOR_PALETTES = exports.PPTGenerator = void 0;
const path = __importStar(require("path"));
const pptxgenjs_1 = __importDefault(require("pptxgenjs"));
// ── 配色方案 ────────────────────────────────────────
const COLOR_PALETTES = {
    "midnight-executive": {
        name: "午夜商务",
        primary: "1E2761",
        secondary: "CADCFC",
        accent: "FFFFFF",
        bgLight: "FFFFFF",
        bgDark: "0D1117",
        text: "1E2761",
        textLight: "6B7280",
    },
    "tech-dark": {
        name: "科技深空",
        primary: "0D1117",
        secondary: "161B22",
        accent: "58A6FF",
        bgLight: "FFFFFF",
        bgDark: "0D1117",
        text: "F0F6FC",
        textLight: "8B949E",
    },
    "coral-energy": {
        name: "珊瑚活力",
        primary: "F96167",
        secondary: "F9E795",
        accent: "2F3C7E",
        bgLight: "FFFFFF",
        text: "1F2937",
        textLight: "6B7280",
    },
    "warm-terracotta": {
        name: "暖陶简约",
        primary: "B85042",
        secondary: "E7E8D1",
        accent: "A7BEAE",
        bgLight: "FDFBF7",
        text: "3D3D3D",
        textLight: "6B7280",
    },
    "ocean-gradient": {
        name: "海洋渐变",
        primary: "065A82",
        secondary: "1C7293",
        accent: "21295C",
        bgLight: "FFFFFF",
        bgDark: "065A82",
        text: "065A82",
        textLight: "6B7280",
    },
    "charcoal-minimal": {
        name: "炭灰极简",
        primary: "36454F",
        secondary: "F2F2F2",
        accent: "212121",
        bgLight: "FFFFFF",
        text: "36454F",
        textLight: "8B949E",
    },
    "teal-trust": {
        name: "青绿信任",
        primary: "028090",
        secondary: "00A896",
        accent: "02C39A",
        bgLight: "FFFFFF",
        text: "065A60",
        textLight: "374151",
    },
    "berry-cream": {
        name: "莓果奶油",
        primary: "6D2E46",
        secondary: "A26769",
        accent: "ECE2D0",
        bgLight: "FDFBF7",
        text: "3D3D3D",
        textLight: "6B7280",
    },
    "sage-calm": {
        name: "鼠尾草静",
        primary: "84B59F",
        secondary: "69A297",
        accent: "50808E",
        bgLight: "F5F9F8",
        text: "3D4F4E",
        textLight: "6B7280",
    },
    "cherry-bold": {
        name: "樱桃大胆",
        primary: "990011",
        secondary: "FCF6F5",
        accent: "2F3C7E",
        bgLight: "FFFFFF",
        text: "1F2937",
        textLight: "6B7280",
        category: "creative",
    },
    // ═══════════════════════════════════════════════════════
    // 以下为新增主题效果 (10套)
    // ═══════════════════════════════════════════════════════
    "sunset-glow": {
        name: "日落暖光",
        primary: "E84855",
        secondary: "F9DC5C",
        accent: "3185FC",
        bgLight: "FFF8F0",
        bgDark: "2D1B2E",
        text: "4A1A2C",
        textLight: "8B6F7A",
        category: "warm",
    },
    "forest-deep": {
        name: "森林深绿",
        primary: "1B4332",
        secondary: "40916C",
        accent: "95D5B2",
        bgLight: "F0F7F4",
        bgDark: "081C15",
        text: "1B4332",
        textLight: "5A7D6A",
        category: "nature",
    },
    "lavender-dream": {
        name: "薰衣草梦幻",
        primary: "5B2C6F",
        secondary: "C77DFF",
        accent: "FF9E5E",
        bgLight: "FDF8FF",
        bgDark: "240B36",
        text: "3C1A4F",
        textLight: "7A5E8F",
        category: "creative",
    },
    "midnight-aurora": {
        name: "午夜极光",
        primary: "0B132B",
        secondary: "1C2541",
        accent: "00E5FF",
        bgLight: "F0F8FF",
        bgDark: "050A1A",
        text: "E0E7FF",
        textLight: "8892B0",
        category: "tech",
    },
    "sunflower-bright": {
        name: "向日葵明亮",
        primary: "F4A300",
        secondary: "FFD166",
        accent: "06D6A0",
        bgLight: "FFFDF0",
        text: "3D3D3D",
        textLight: "7A7A7A",
        category: "warm",
    },
    "steel-blue": {
        name: "钢铁蓝调",
        primary: "2C3E50",
        secondary: "3498DB",
        accent: "1ABC9C",
        bgLight: "F8FAFC",
        bgDark: "1A252F",
        text: "2C3E50",
        textLight: "7F8C9A",
        category: "business",
    },
    "rose-garden": {
        name: "玫瑰花园",
        primary: "A8325A",
        secondary: "F2A7B3",
        accent: "D4A373",
        bgLight: "FFF5F7",
        bgDark: "4A1A2E",
        text: "4A1A2E",
        textLight: "8B5A6E",
        category: "creative",
    },
    "golden-hour": {
        name: "黄金时刻",
        primary: "B8860B",
        secondary: "DAA520",
        accent: "FFF8DC",
        bgLight: "FFFDF5",
        bgDark: "3D2B1F",
        text: "3D2B1F",
        textLight: "7A6B50",
        category: "warm",
    },
    "mineral-gray": {
        name: "矿物灰调",
        primary: "4A4A4A",
        secondary: "D1D5DB",
        accent: "6366F1",
        bgLight: "FAFAFA",
        bgDark: "1F1F1F",
        text: "1F1F1F",
        textLight: "6B7280",
        category: "business",
    },
    "peach-sweet": {
        name: "蜜桃甜心",
        primary: "F4978E",
        secondary: "FBD4C4",
        accent: "B7E4C7",
        bgLight: "FFF8F5",
        text: "5D4037",
        textLight: "8D6E63",
        category: "warm",
    },
};
exports.COLOR_PALETTES = COLOR_PALETTES;
// ── 默认内容结构 ────────────────────────────────────
const DEFAULT_OUTLINE = [
    { type: "cover", title: "封面", subtitle: "演示主题" },
    { type: "toc", title: "目录" },
    { type: "content", title: "内容概览" },
    { type: "content", title: "核心要点 1" },
    { type: "content", title: "核心要点 2" },
    { type: "content", title: "核心要点 3" },
    { type: "content", title: "案例分析" },
    { type: "content", title: "数据展示" },
    { type: "summary", title: "总结" },
    { type: "end", title: "谢谢" },
];
exports.DEFAULT_OUTLINE = DEFAULT_OUTLINE;
// ── PPT Generator 类 ───────────────────────────────
class PPTGenerator {
    pptx;
    options;
    colors;
    constructor(options = {}) {
        this.pptx = new pptxgenjs_1.default();
        this.options = {
            title: options.title || "演示文稿",
            author: options.author || "PPT Generator",
            company: options.company || "",
            subject: options.subject || "",
            palette: options.palette || "midnight-executive",
            language: options.language || "zh",
        };
        this.colors =
            COLOR_PALETTES[this.options.palette] ||
                COLOR_PALETTES["midnight-executive"];
        this.pptx.layout = "LAYOUT_16x9";
    }
    /**
     * 设置演示文稿属性
     */
    setMetadata() {
        this.pptx.author = this.options.author || "";
        this.pptx.title = this.options.title;
        this.pptx.subject = this.options.subject || "";
        this.pptx.company = this.options.company || "";
    }
    /**
     * 添加封面页
     */
    addCoverPage(title, subtitle) {
        const slide = this.pptx.addSlide();
        // 深色背景
        slide.background = { color: this.colors.primary };
        // 装饰元素 - 右上角圆形
        slide.addShape("ellipse", {
            x: 9,
            y: -1.5,
            w: 5,
            h: 5,
            fill: { color: this.colors.accent, transparency: 90 },
        });
        // 装饰元素 - 左下角圆形
        slide.addShape("ellipse", {
            x: -1,
            y: 5,
            w: 4,
            h: 4,
            fill: { color: this.colors.accent, transparency: 90 },
        });
        // 主标题
        slide.addText(title, {
            x: 0.8,
            y: 2.5,
            w: 11.5,
            h: 1.5,
            fontSize: 48,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
            bold: true,
            align: "center",
        });
        // 副标题
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.8,
                y: 4.2,
                w: 11.5,
                h: 0.8,
                fontSize: 20,
                fontFace: "Microsoft YaHei",
                color: this.colors.secondary,
                align: "center",
            });
        }
        // 底部装饰线
        slide.addShape("rect", {
            x: 5.5,
            y: 5.5,
            w: 2.5,
            h: 0.05,
            fill: { color: this.colors.accent },
        });
    }
    /**
     * 添加目录页
     */
    addTOCPage(items) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 页面标题
        slide.addText(this.options.language === "zh" ? "目录" : "Contents", {
            x: 0.8,
            y: 0.5,
            w: 11.5,
            h: 0.8,
            fontSize: 36,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
            bold: true,
        });
        // 左侧装饰条
        slide.addShape("rect", {
            x: 0.8,
            y: 1.5,
            w: 0.1,
            h: 5.5,
            fill: { color: this.colors.primary },
        });
        // 目录项
        const startY = 1.8;
        const itemHeight = 0.9;
        items.forEach((item, index) => {
            // 序号
            slide.addText(String(index + 1).padStart(2, "0"), {
                x: 1.2,
                y: startY + index * itemHeight,
                w: 0.6,
                h: 0.6,
                fontSize: 24,
                fontFace: "Microsoft YaHei",
                color: this.colors.primary,
                bold: true,
            });
            // 标题
            slide.addText(item.title, {
                x: 2.0,
                y: startY + index * itemHeight,
                w: 9,
                h: 0.6,
                fontSize: 18,
                fontFace: "Microsoft YaHei",
                color: this.colors.text || "333333",
            });
            // 分隔线
            if (index < items.length - 1) {
                slide.addShape("rect", {
                    x: 2.0,
                    y: startY + index * itemHeight + 0.7,
                    w: 9,
                    h: 0.01,
                    fill: { color: "E5E5E5" },
                });
            }
        });
    }
    /**
     * 添加内容页
     */
    addContentPage(title, content, _layout = "default") {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 顶部装饰条
        slide.addShape("rect", {
            x: 0,
            y: 0,
            w: 13.33,
            h: 0.15,
            fill: { color: this.colors.primary },
        });
        // 页面标题
        slide.addText(title, {
            x: 0.8,
            y: 0.5,
            w: 11.5,
            h: 0.8,
            fontSize: 32,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
            bold: true,
        });
        // 内容区域
        if (typeof content === "string") {
            slide.addText(content, {
                x: 0.8,
                y: 1.6,
                w: 11.5,
                h: 5,
                fontSize: 16,
                fontFace: "Microsoft YaHei",
                color: this.colors.text || "333333",
                valign: "top",
                lineSpacingMultiple: 1.5,
            });
        }
        else if (Array.isArray(content)) {
            const bulletItems = content.map((item) => ({
                text: item,
                options: { bullet: true, breakLine: true },
            }));
            slide.addText(bulletItems, {
                x: 0.8,
                y: 1.6,
                w: 11.5,
                h: 5,
                fontSize: 16,
                fontFace: "Microsoft YaHei",
                color: this.colors.text || "333333",
                valign: "top",
                paraSpaceAfter: 12,
            });
        }
    }
    /**
     * 添加大数据展示页
     */
    addBigNumberPage(title, numbers) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 页面标题
        slide.addText(title, {
            x: 0.8,
            y: 0.5,
            w: 11.5,
            h: 0.8,
            fontSize: 32,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
            bold: true,
        });
        // 数据卡片
        const cardWidth = 3.5;
        const cardHeight = 2.5;
        const startX = 0.8;
        const startY = 2;
        const gap = 0.5;
        numbers.forEach((item, index) => {
            const x = startX + index * (cardWidth + gap);
            // 卡片背景
            slide.addShape("roundRect", {
                x,
                y: startY,
                w: cardWidth,
                h: cardHeight,
                fill: { color: this.colors.primary },
                rectRadius: 0.1,
            });
            // 数字
            slide.addText(item.value, {
                x,
                y: startY + 0.4,
                w: cardWidth,
                h: 1.2,
                fontSize: 48,
                fontFace: "Microsoft YaHei",
                color: "FFFFFF",
                bold: true,
                align: "center",
            });
            // 标签
            slide.addText(item.label, {
                x,
                y: startY + 1.6,
                w: cardWidth,
                h: 0.6,
                fontSize: 14,
                fontFace: "Microsoft YaHei",
                color: this.colors.secondary,
                align: "center",
            });
        });
    }
    /**
     * 添加总结页
     */
    addSummaryPage(title, points) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.primary };
        // 页面标题
        slide.addText(title || (this.options.language === "zh" ? "总结" : "Summary"), {
            x: 0.8,
            y: 0.5,
            w: 11.5,
            h: 1,
            fontSize: 36,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
            bold: true,
        });
        // 要点
        const startY = 1.8;
        const itemHeight = 1;
        points.forEach((point, index) => {
            // 序号圆点
            slide.addShape("ellipse", {
                x: 0.8,
                y: startY + index * itemHeight + 0.15,
                w: 0.35,
                h: 0.35,
                fill: { color: this.colors.accent },
            });
            // 文字
            slide.addText(point, {
                x: 1.4,
                y: startY + index * itemHeight,
                w: 10.5,
                h: 0.7,
                fontSize: 18,
                fontFace: "Microsoft YaHei",
                color: "FFFFFF",
            });
        });
    }
    /**
     * 添加结束页
     */
    addEndPage(message) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.primary };
        // 装饰圆形
        slide.addShape("ellipse", {
            x: 4,
            y: 1.5,
            w: 5,
            h: 5,
            fill: { color: this.colors.accent, transparency: 92 },
        });
        // 结束语
        slide.addText(message || (this.options.language === "zh" ? "谢谢观看" : "Thank You"), {
            x: 0,
            y: 3,
            w: 13.33,
            h: 1.5,
            fontSize: 48,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
            bold: true,
            align: "center",
        });
    }
    // ═══════════════════════════════════════════════════════
    // 新增排版模式
    // ═══════════════════════════════════════════════════════
    /**
     * 双栏布局 — 左列 + 右列内容
     */
    addTwoColumnPage(title, leftItems, rightItems) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 顶部装饰条
        slide.addShape("rect", {
            x: 0,
            y: 0,
            w: 13.33,
            h: 0.08,
            fill: { color: this.colors.primary },
        });
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        // 中间分割线
        slide.addShape("rect", {
            x: 6.5,
            y: 1.3,
            w: 0.04,
            h: 5.8,
            fill: { color: this.colors.textLight, transparency: 60 },
        });
        // 左列标题
        slide.addShape("rect", {
            x: 0.6,
            y: 1.3,
            w: 5.5,
            h: 0.5,
            fill: { color: this.colors.primary },
        });
        slide.addText("●", {
            x: 0.6,
            y: 1.3,
            w: 5.5,
            h: 0.5,
            fontSize: 14,
            color: "FFFFFF",
            align: "center",
            valign: "middle",
            fontFace: "Microsoft YaHei",
        });
        // 左列内容
        if (leftItems && leftItems.length > 0) {
            const leftBullets = leftItems.map((item) => ({
                text: item,
                options: { bullet: true, breakLine: true },
            }));
            slide.addText(leftBullets, {
                x: 0.6,
                y: 2,
                w: 5.5,
                h: 5,
                fontSize: 14,
                fontFace: "Microsoft YaHei",
                color: this.colors.text,
                valign: "top",
                paraSpaceAfter: 10,
                lineSpacingMultiple: 1.4,
            });
        }
        // 右列标题
        slide.addShape("rect", {
            x: 7,
            y: 1.3,
            w: 5.5,
            h: 0.5,
            fill: { color: this.colors.accent },
        });
        slide.addText("●", {
            x: 7,
            y: 1.3,
            w: 5.5,
            h: 0.5,
            fontSize: 14,
            color: "FFFFFF",
            align: "center",
            valign: "middle",
            fontFace: "Microsoft YaHei",
        });
        // 右列内容
        if (rightItems && rightItems.length > 0) {
            const rightBullets = rightItems.map((item) => ({
                text: item,
                options: { bullet: true, breakLine: true },
            }));
            slide.addText(rightBullets, {
                x: 7,
                y: 2,
                w: 5.5,
                h: 5,
                fontSize: 14,
                fontFace: "Microsoft YaHei",
                color: this.colors.text,
                valign: "top",
                paraSpaceAfter: 10,
                lineSpacingMultiple: 1.4,
            });
        }
    }
    /**
     * 时间轴布局 — 按时间/阶段展示
     */
    addTimelinePage(title, events) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 顶部装饰条
        slide.addShape("rect", {
            x: 0,
            y: 0,
            w: 13.33,
            h: 0.08,
            fill: { color: this.colors.primary },
        });
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        // 中心时间轴线
        slide.addShape("rect", {
            x: 2.2,
            y: 1.3,
            w: 0.06,
            h: 5.5,
            fill: { color: this.colors.primary, transparency: 40 },
        });
        const startY = 1.5;
        const itemH = events.length <= 4 ? 1.3 : 1.0;
        events.forEach((evt, i) => {
            const y = startY + i * itemH;
            // 时间轴节点圆点
            slide.addShape("ellipse", {
                x: 2.05,
                y: y + 0.15,
                w: 0.36,
                h: 0.36,
                fill: { color: i % 2 === 0 ? this.colors.primary : this.colors.accent },
            });
            // 时间段标签
            slide.addText(evt.period, {
                x: 0.2,
                y,
                w: 1.7,
                h: 0.4,
                fontSize: 13,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: this.colors.primary,
                align: "right",
            });
            // 标题
            slide.addText(evt.title, {
                x: 2.8,
                y,
                w: 9.5,
                h: 0.4,
                fontSize: 16,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: this.colors.text,
            });
            // 描述
            slide.addText(evt.desc, {
                x: 2.8,
                y: y + 0.4,
                w: 9.5,
                h: itemH - 0.5,
                fontSize: 12,
                fontFace: "Microsoft YaHei",
                color: this.colors.textLight,
                lineSpacingMultiple: 1.3,
            });
        });
    }
    /**
     * 对比布局 — 左右两侧对比
     */
    addComparisonPage(title, left, right) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        // VS 标记
        slide.addShape("ellipse", {
            x: 5.8,
            y: 2.5,
            w: 1.2,
            h: 1.2,
            fill: { color: this.colors.accent },
        });
        slide.addText("VS", {
            x: 5.8,
            y: 2.5,
            w: 1.2,
            h: 1.2,
            fontSize: 18,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
            align: "center",
            valign: "middle",
        });
        // 左侧卡片
        slide.addShape("roundRect", {
            x: 0.4,
            y: 1.3,
            w: 5.2,
            h: 5.5,
            fill: { color: this.colors.primary, transparency: 92 },
            line: { color: this.colors.primary, width: 1.5 },
            rectRadius: 0.15,
        });
        slide.addText(left.title, {
            x: 0.6,
            y: 1.5,
            w: 4.8,
            h: 0.6,
            fontSize: 18,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        if (left.items) {
            const leftBullets = left.items.map((item) => ({
                text: item,
                options: { bullet: true, breakLine: true },
            }));
            slide.addText(leftBullets, {
                x: 0.6,
                y: 2.3,
                w: 4.8,
                h: 4.3,
                fontSize: 13,
                fontFace: "Microsoft YaHei",
                color: this.colors.text,
                valign: "top",
                paraSpaceAfter: 8,
                lineSpacingMultiple: 1.3,
            });
        }
        // 右侧卡片
        slide.addShape("roundRect", {
            x: 7.2,
            y: 1.3,
            w: 5.2,
            h: 5.5,
            fill: { color: this.colors.accent, transparency: 92 },
            line: { color: this.colors.accent, width: 1.5 },
            rectRadius: 0.15,
        });
        slide.addText(right.title, {
            x: 7.4,
            y: 1.5,
            w: 4.8,
            h: 0.6,
            fontSize: 18,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.text,
        });
        if (right.items) {
            const rightBullets = right.items.map((item) => ({
                text: item,
                options: { bullet: true, breakLine: true },
            }));
            slide.addText(rightBullets, {
                x: 7.4,
                y: 2.3,
                w: 4.8,
                h: 4.3,
                fontSize: 13,
                fontFace: "Microsoft YaHei",
                color: this.colors.text,
                valign: "top",
                paraSpaceAfter: 8,
                lineSpacingMultiple: 1.3,
            });
        }
    }
    /**
     * 图标网格布局 — 3列或2列图标+文字
     */
    addIconGridPage(title, items) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 顶部装饰条
        slide.addShape("rect", {
            x: 0,
            y: 0,
            w: 13.33,
            h: 0.08,
            fill: { color: this.colors.primary },
        });
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        const cols = items.length <= 3 ? items.length : 3;
        const rows = Math.ceil(items.length / cols);
        const cardW = cols === 3 ? 3.8 : cols === 2 ? 5.8 : 11;
        const gapX = cols === 3 ? 0.5 : cols === 2 ? 0.6 : 0;
        const cardH = rows <= 2 ? 2.5 : 2.0;
        const gapY = 0.4;
        const startX = (13.33 - (cols * cardW + (cols - 1) * gapX)) / 2;
        const startY = 1.4;
        items.forEach((item, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);
            // 卡片背景
            slide.addShape("roundRect", {
                x,
                y,
                w: cardW,
                h: cardH,
                fill: { color: this.colors.primary, transparency: 95 },
                line: { color: this.colors.textLight, transparency: 70, width: 0.5 },
                rectRadius: 0.1,
            });
            // 图标（用 emoji 文字代替）
            slide.addText(item.icon, {
                x,
                y: y + 0.2,
                w: cardW,
                h: 0.6,
                fontSize: 28,
                align: "center",
                fontFace: "Segoe UI Emoji",
            });
            // 标签
            slide.addText(item.label, {
                x: x + 0.2,
                y: y + 0.9,
                w: cardW - 0.4,
                h: 0.4,
                fontSize: 15,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: this.colors.primary,
                align: "center",
            });
            // 描述
            slide.addText(item.desc, {
                x: x + 0.2,
                y: y + 1.3,
                w: cardW - 0.4,
                h: cardH - 1.5,
                fontSize: 11,
                fontFace: "Microsoft YaHei",
                color: this.colors.textLight,
                align: "center",
                lineSpacingMultiple: 1.2,
            });
        });
    }
    /**
     * 引用布局 — 突出引用/名言
     */
    addQuotePage(title, quote) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.primary };
        // 大引号装饰
        slide.addText("❝", {
            x: 0.8,
            y: 0.8,
            w: 2,
            h: 1.5,
            fontSize: 72,
            fontFace: "Microsoft YaHei",
            color: this.colors.accent,
            transparency: 50,
        });
        // 引用文字
        slide.addText(quote.text, {
            x: 0.8,
            y: 2.2,
            w: 11.5,
            h: 3.5,
            fontSize: 28,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
            lineSpacingMultiple: 1.6,
            italic: true,
        });
        // 引用线
        slide.addShape("rect", {
            x: 0.8,
            y: 5.8,
            w: 3,
            h: 0.04,
            fill: { color: this.colors.accent },
        });
        // 作者
        slide.addText(`—— ${quote.author}`, {
            x: 0.8,
            y: 6,
            w: 11.5,
            h: 0.6,
            fontSize: 16,
            fontFace: "Microsoft YaHei",
            color: this.colors.secondary,
            align: "left",
        });
        // 页面底部标明
        slide.addText(title, {
            x: 0.8,
            y: 6.6,
            w: 11.5,
            h: 0.5,
            fontSize: 12,
            fontFace: "Microsoft YaHei",
            color: this.colors.textLight,
            transparency: 40,
        });
    }
    /**
     * 章节过渡页 — 用于分隔大章节
     */
    addSectionHeaderPage(title, subtitle, sectionNum) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.primary };
        // 装饰 - 大号章节号
        if (sectionNum) {
            slide.addText(sectionNum, {
                x: 0.8,
                y: 0.5,
                w: 11.5,
                h: 2,
                fontSize: 96,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: this.colors.accent,
                transparency: 80,
            });
        }
        // 章节标题
        slide.addText(title, {
            x: 0.8,
            y: 3,
            w: 11.5,
            h: 1.5,
            fontSize: 44,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: "FFFFFF",
        });
        // 装饰线
        slide.addShape("rect", {
            x: 0.8,
            y: 4.8,
            w: 2,
            h: 0.05,
            fill: { color: this.colors.accent },
        });
        // 副标题
        if (subtitle) {
            slide.addText(subtitle, {
                x: 0.8,
                y: 5.2,
                w: 11.5,
                h: 0.8,
                fontSize: 18,
                fontFace: "Microsoft YaHei",
                color: this.colors.secondary,
            });
        }
        // 底部装饰
        slide.addShape("ellipse", {
            x: 10,
            y: 5,
            w: 4,
            h: 4,
            fill: { color: this.colors.accent, transparency: 92 },
        });
    }
    /**
     * 卡片网格布局 — 多个卡片展示
     */
    addCardGridPage(title, cards) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        const cols = cards.length <= 2 ? 2 : cards.length <= 4 ? 2 : 3;
        const rows = Math.ceil(cards.length / cols);
        const cardW = cols === 3 ? 3.8 : 6;
        const gapX = cols === 3 ? 0.5 : 0.6;
        const cardH = rows <= 2 ? 2.6 : 2.0;
        const gapY = 0.4;
        const startX = (13.33 - (cols * cardW + (cols - 1) * gapX)) / 2;
        const startY = 1.3;
        cards.forEach((card, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);
            const cardColor = card.color || this.colors.primary;
            // 卡片顶部色条
            slide.addShape("rect", {
                x,
                y,
                w: cardW,
                h: 0.12,
                fill: { color: cardColor },
            });
            // 卡片背景
            slide.addShape("roundRect", {
                x,
                y: y + 0.12,
                w: cardW,
                h: cardH - 0.12,
                fill: { color: this.colors.bgLight || "FFFFFF" },
                line: { color: this.colors.textLight, transparency: 80, width: 0.5 },
                rectRadius: 0.05,
            });
            // 卡片标题
            slide.addText(card.title, {
                x: x + 0.3,
                y: y + 0.3,
                w: cardW - 0.6,
                h: 0.5,
                fontSize: 16,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: cardColor,
            });
            // 卡片描述
            slide.addText(card.desc, {
                x: x + 0.3,
                y: y + 0.9,
                w: cardW - 0.6,
                h: cardH - 1.3,
                fontSize: 12,
                fontFace: "Microsoft YaHei",
                color: this.colors.textLight,
                lineSpacingMultiple: 1.3,
            });
        });
    }
    /**
     * 流程布局 — 分步骤展示
     */
    addProcessFlowPage(title, steps) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.bgLight || "FFFFFF" };
        // 页面标题
        slide.addText(title, {
            x: 0.6,
            y: 0.3,
            w: 12,
            h: 0.7,
            fontSize: 30,
            bold: true,
            fontFace: "Microsoft YaHei",
            color: this.colors.primary,
        });
        const startY = 1.3;
        const itemH = Math.min(1.1, (6.0 - startY) / steps.length);
        // 连接箭头线
        if (steps.length > 1) {
            for (let i = 0; i < steps.length - 1; i++) {
                const y1 = startY + i * itemH + itemH - 0.1;
                const y2 = startY + (i + 1) * itemH + 0.15;
                slide.addShape("rect", {
                    x: 1.85,
                    y: y1,
                    w: 0.06,
                    h: y2 - y1,
                    fill: { color: this.colors.primary, transparency: 50 },
                });
            }
        }
        steps.forEach((s, i) => {
            const y = startY + i * itemH;
            // 步骤圆
            slide.addShape("ellipse", {
                x: 1.5,
                y: y + 0.1,
                w: 0.75,
                h: 0.75,
                fill: { color: this.colors.primary },
            });
            slide.addText(s.step, {
                x: 1.5,
                y: y + 0.1,
                w: 0.75,
                h: 0.75,
                fontSize: 16,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: "FFFFFF",
                align: "center",
                valign: "middle",
            });
            // 步骤标题
            slide.addText(s.title, {
                x: 2.6,
                y,
                w: 3,
                h: 0.45,
                fontSize: 16,
                bold: true,
                fontFace: "Microsoft YaHei",
                color: this.colors.primary,
            });
            // 步骤描述
            slide.addText(s.desc, {
                x: 2.6,
                y: y + 0.45,
                w: 9.5,
                h: itemH - 0.5,
                fontSize: 12,
                fontFace: "Microsoft YaHei",
                color: this.colors.textLight,
            });
        });
    }
    /**
     * 根据大纲生成所有页面
     */
    generateFromOutline(outline, contentData) {
        this.setMetadata();
        // 选取合适的布局策略
        const strategy = this.options.layoutStrategy || "mixed";
        outline.forEach((page, index) => {
            // 自动布局策略：如果内容是字符串数组且未指定特殊类型，自动轮换排版
            let effectiveType = page.type;
            if (strategy === "mixed" && effectiveType === "content") {
                const layoutCycle = [
                    "content",
                    "two-column",
                    "icon-grid",
                    "content",
                    "card-grid",
                ];
                // 对 content 类型，按位置轮换布局
                const contentIndex = outline
                    .slice(0, index)
                    .filter((p) => p.type === "content").length;
                effectiveType = layoutCycle[contentIndex % layoutCycle.length];
            }
            switch (effectiveType) {
                case "cover":
                    this.addCoverPage(contentData.title || this.options.title, contentData.subtitle || "");
                    break;
                case "toc":
                    this.addTOCPage(contentData.toc || []);
                    break;
                case "content":
                    this.addContentPage(page.title, contentData[`content${index}`] || []);
                    break;
                case "two-column":
                    this.addTwoColumnPage(page.title, contentData.leftColumn || [], contentData.rightColumn || []);
                    break;
                case "timeline":
                    this.addTimelinePage(page.title, contentData.timeline || []);
                    break;
                case "comparison":
                    this.addComparisonPage(page.title, contentData.leftSide || {
                        title: "方案A",
                        items: [],
                    }, contentData.rightSide || {
                        title: "方案B",
                        items: [],
                    });
                    break;
                case "icon-grid":
                    this.addIconGridPage(page.title, contentData.gridItems || []);
                    break;
                case "quote":
                    this.addQuotePage(page.title, contentData.quote || {
                        text: "",
                        author: "",
                    });
                    break;
                case "section-header":
                    this.addSectionHeaderPage(page.title, page.subtitle, String(index + 1).padStart(2, "0"));
                    break;
                case "card-grid":
                    this.addCardGridPage(page.title, contentData.cards || []);
                    break;
                case "process-flow":
                    this.addProcessFlowPage(page.title, contentData.steps || []);
                    break;
                case "big-number":
                    this.addBigNumberPage(page.title, contentData.numbers || []);
                    break;
                case "summary":
                    this.addSummaryPage(page.title, contentData.summary || []);
                    break;
                case "end":
                    this.addEndPage(contentData.endMessage || "");
                    break;
            }
        });
    }
    /**
     * 保存文件
     */
    async save(outputPath) {
        try {
            await this.pptx.writeFile({ fileName: outputPath });
            console.log(`✅ PPT 已生成: ${outputPath}`);
            return outputPath;
        }
        catch (error) {
            console.error("❌ 生成失败:", error);
            throw error;
        }
    }
}
exports.PPTGenerator = PPTGenerator;
// ── CLI 入口 ────────────────────────────────────────
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        title: "演示文稿",
        palette: "midnight-executive",
        language: "zh",
        layoutStrategy: "mixed",
        output: path.join(process.env.HOME || process.env.USERPROFILE || ".", "Desktop", "演示文稿.pptx"),
    };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--title" || args[i] === "-t") {
            options.title = args[++i];
        }
        else if (args[i] === "--palette" || args[i] === "-p") {
            options.palette = args[++i];
        }
        else if (args[i] === "--lang" || args[i] === "-l") {
            options.language = args[++i];
        }
        else if (args[i] === "--layout" || args[i] === "--strategy") {
            const val = args[++i];
            options.layoutStrategy =
                val === "mixed" || val === "auto" ? val : "mixed";
        }
        else if (args[i] === "--output" || args[i] === "-o") {
            options.output = args[++i];
        }
        else if (args[i] === "--list-palettes") {
            console.log("可用的配色方案:");
            Object.entries(COLOR_PALETTES).forEach(([key, p]) => {
                console.log(`  ${key.padEnd(22)} ${p.name}  [${p.category || "general"}]`);
            });
            process.exit(0);
        }
        else if (args[i] === "--list-layouts") {
            console.log("可用的排版模式:");
            const layouts = [
                "cover",
                "toc",
                "content",
                "two-column",
                "timeline",
                "comparison",
                "icon-grid",
                "quote",
                "section-header",
                "card-grid",
                "process-flow",
                "big-number",
                "summary",
                "end",
            ];
            layouts.forEach((l) => console.log(`  ${l}`));
            process.exit(0);
        }
    }
    const generator = new PPTGenerator(options);
    // 使用混合布局策略演示所有排版模式
    const demoOutline = [
        {
            type: "cover",
            title: options.title || "演示文稿",
            subtitle: "混合排版演示",
        },
        { type: "toc", title: "目录" },
        { type: "section-header", title: "第一部分", subtitle: "概况与总览" },
        { type: "content", title: "内容概览" },
        { type: "big-number", title: "关键数据" },
        { type: "two-column", title: "双栏对比" },
        { type: "section-header", title: "第二部分", subtitle: "深入分析" },
        { type: "icon-grid", title: "核心能力" },
        { type: "timeline", title: "发展历程" },
        { type: "card-grid", title: "重点项目" },
        { type: "quote", title: "行业观点" },
        { type: "comparison", title: "方案对比" },
        { type: "process-flow", title: "实施流程" },
        { type: "summary", title: "总结" },
        { type: "end", title: "谢谢" },
    ];
    generator.generateFromOutline(demoOutline, {
        title: options.title,
        subtitle: options.language === "zh" ? "混合排版演示" : "Mixed Layout Demo",
        toc: [
            { title: "内容概览" },
            { title: "关键数据" },
            { title: "双栏对比" },
            { title: "核心能力" },
            { title: "发展历程" },
            { title: "方案对比" },
            { title: "实施流程" },
            { title: "总结" },
        ],
        content1: [
            "项目整体进展顺利，各项指标均达到预期目标",
            "本季度核心业务同比增长 35%，主要得益于市场拓展",
            "用户满意度提升至 92%，创历史新高",
            "团队规模扩展至 50 人，覆盖研发、运营、销售",
        ],
        content2: [
            "这是第二个核心要点，详细说明相关内容...",
            "展示了关键信息的完整解读和深度分析",
        ],
        summary: [
            "核心要点一：重要的结论和发现",
            "核心要点二：关键的洞见与启发",
            "核心要点三：可行的建议与行动计划",
        ],
        leftColumn: [
            "传统方案实施周期长达 6 个月",
            "需要投入大量人力进行手动操作",
            "数据分散在不同系统，难以统一管理",
            "扩展性受限，难以应对快速增长",
        ],
        rightColumn: [
            "新方案仅需 2 周即可完成部署",
            "自动化流程减少 80% 人工操作",
            "统一数据平台，实时同步更新",
            "弹性架构支持水平扩展",
        ],
        timeline: [
            {
                period: "2024 Q1",
                title: "项目启动",
                desc: "完成团队组建与需求调研，确立技术方案选型",
            },
            {
                period: "2024 Q2",
                title: "原型开发",
                desc: "完成核心功能原型开发，通过内部评审",
            },
            {
                period: "2024 Q3",
                title: "灰度测试",
                desc: "面向 1000 名种子用户开放测试，收集反馈",
            },
            {
                period: "2024 Q4",
                title: "正式上线",
                desc: "全量发布，首月用户突破 10 万",
            },
            {
                period: "2025 Q1",
                title: "持续迭代",
                desc: "根据用户反馈迭代优化，新增 AI 智能功能",
            },
        ],
        numbers: [
            { value: "92%", label: "用户满意度" },
            { value: "35%", label: "同比增长" },
            { value: "50人", label: "团队规模" },
        ],
        leftSide: {
            title: "方案A：传统方案",
            items: [
                "成本高，需要大量硬件投入",
                "部署周期长（3-6个月）",
                "维护复杂，需要专人负责",
                "技术栈陈旧，难以升级",
            ],
        },
        rightSide: {
            title: "方案B：创新方案",
            items: [
                "SaaS 模式，按需付费",
                "开箱即用，1周上线",
                "自动运维，无需专人",
                "持续更新，持续迭代",
            ],
        },
        gridItems: [
            { icon: "🚀", label: "快速部署", desc: "开箱即用，一键部署" },
            { icon: "🔒", label: "安全可靠", desc: "银行级数据加密保护" },
            { icon: "📊", label: "数据洞察", desc: "智能分析，辅助决策" },
            { icon: "⚡", label: "高性能", desc: "毫秒级响应速度" },
            { icon: "🔄", label: "灵活集成", desc: "开放 API，无缝对接" },
            { icon: "🎯", label: "精准推荐", desc: "AI 算法，千人千面" },
        ],
        cards: [
            {
                title: "产品研发",
                desc: "投入 30 人核心研发团队，持续打磨产品体验，每月发布 2 个迭代版本。",
                color: "1E2761",
            },
            {
                title: "市场拓展",
                desc: "覆盖全国 10 个重点城市，与 50+ 合作伙伴建立战略合作。",
                color: "58A6FF",
            },
            {
                title: "客户成功",
                desc: "建立 7×24 小时技术支持体系，客户续费率超过 95%。",
                color: "06D6A0",
            },
            {
                title: "生态建设",
                desc: "开放开发者平台，吸引 100+ 第三方应用接入生态。",
                color: "B8860B",
            },
        ],
        quote: {
            text: "真正的创新不是用新技术做旧事，而是用新技术做过去做不了的事。",
            author: "彼得·德鲁克 (Peter Drucker)",
        },
        steps: [
            {
                step: "01",
                title: "需求分析",
                desc: "深入了解业务需求，明确目标与范围",
            },
            { step: "02", title: "方案设计", desc: "输出详细技术方案，评审确认" },
            { step: "03", title: "开发实施", desc: "Agile 迭代开发，持续交付" },
            { step: "04", title: "测试验收", desc: "自动化测试 + 人工验收双重保障" },
            { step: "05", title: "部署上线", desc: "灰度发布，平稳过渡到生产环境" },
        ],
    });
    generator.save(options.output).catch(console.error);
}
//# sourceMappingURL=generate.js.map