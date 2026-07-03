#!/usr/bin/env node
/**
 * PPT Generator - 通用 PPT 生成脚本 (TypeScript)
 * 使用 pptxgenjs 生成专业 PPT
 */
interface Palette {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bgLight: string;
    bgDark?: string;
    text: string;
    textLight: string;
    /** 主题风格分类：business / tech / creative / nature / warm / cool */
    category?: string;
}
type PageLayout = "cover" | "toc" | "content" | "big-number" | "summary" | "end" | "two-column" | "timeline" | "comparison" | "icon-grid" | "quote" | "section-header" | "card-grid" | "process-flow";
interface OutlineItem {
    type: PageLayout;
    title: string;
    subtitle?: string;
}
interface ContentData {
    title?: string;
    subtitle?: string;
    toc?: Array<{
        title: string;
    }>;
    summary?: string[];
    endMessage?: string;
    /** 双栏: 左列 + 右列内容 */
    leftColumn?: string[];
    rightColumn?: string[];
    /** 时间轴: 年份/阶段标题 → 描述 */
    timeline?: Array<{
        period: string;
        title: string;
        desc: string;
    }>;
    /** 对比: 左侧 vs 右侧 */
    leftSide?: {
        title: string;
        items: string[];
    };
    rightSide?: {
        title: string;
        items: string[];
    };
    /** 图标网格: 图标名+标签+描述 */
    gridItems?: Array<{
        icon: string;
        label: string;
        desc: string;
    }>;
    /** 引用: 引文 + 作者 */
    quote?: {
        text: string;
        author: string;
    };
    /** 卡片网格 */
    cards?: Array<{
        title: string;
        desc: string;
        color?: string;
    }>;
    /** 流程 */
    steps?: Array<{
        step: string;
        title: string;
        desc: string;
    }>;
    /** 大数据 */
    numbers?: Array<{
        value: string;
        label: string;
    }>;
    [key: string]: unknown;
}
interface GeneratorOptions {
    title: string;
    author?: string;
    company?: string;
    subject?: string;
    palette: string;
    language: string;
    /** 布局策略: auto（按内容自动选）/ mixed（混合轮换） */
    layoutStrategy?: "auto" | "mixed";
    width?: number;
    height?: number;
}
declare const COLOR_PALETTES: Record<string, Palette>;
declare const DEFAULT_OUTLINE: OutlineItem[];
declare class PPTGenerator {
    private pptx;
    private options;
    private colors;
    constructor(options?: Partial<GeneratorOptions>);
    /**
     * 设置演示文稿属性
     */
    private setMetadata;
    /**
     * 添加封面页
     */
    addCoverPage(title: string, subtitle?: string): void;
    /**
     * 添加目录页
     */
    addTOCPage(items: Array<{
        title: string;
    }>): void;
    /**
     * 添加内容页
     */
    addContentPage(title: string, content: string | string[], _layout?: string): void;
    /**
     * 添加大数据展示页
     */
    addBigNumberPage(title: string, numbers: Array<{
        value: string;
        label: string;
    }>): void;
    /**
     * 添加总结页
     */
    addSummaryPage(title: string | undefined, points: string[]): void;
    /**
     * 添加结束页
     */
    addEndPage(message?: string): void;
    /**
     * 双栏布局 — 左列 + 右列内容
     */
    addTwoColumnPage(title: string, leftItems: string[], rightItems: string[]): void;
    /**
     * 时间轴布局 — 按时间/阶段展示
     */
    addTimelinePage(title: string, events: Array<{
        period: string;
        title: string;
        desc: string;
    }>): void;
    /**
     * 对比布局 — 左右两侧对比
     */
    addComparisonPage(title: string, left: {
        title: string;
        items: string[];
    }, right: {
        title: string;
        items: string[];
    }): void;
    /**
     * 图标网格布局 — 3列或2列图标+文字
     */
    addIconGridPage(title: string, items: Array<{
        icon: string;
        label: string;
        desc: string;
    }>): void;
    /**
     * 引用布局 — 突出引用/名言
     */
    addQuotePage(title: string, quote: {
        text: string;
        author: string;
    }): void;
    /**
     * 章节过渡页 — 用于分隔大章节
     */
    addSectionHeaderPage(title: string, subtitle?: string, sectionNum?: string): void;
    /**
     * 卡片网格布局 — 多个卡片展示
     */
    addCardGridPage(title: string, cards: Array<{
        title: string;
        desc: string;
        color?: string;
    }>): void;
    /**
     * 流程布局 — 分步骤展示
     */
    addProcessFlowPage(title: string, steps: Array<{
        step: string;
        title: string;
        desc: string;
    }>): void;
    /**
     * 根据大纲生成所有页面
     */
    generateFromOutline(outline: OutlineItem[], contentData: ContentData): void;
    /**
     * 保存文件
     */
    save(outputPath: string): Promise<string>;
}
export { PPTGenerator, COLOR_PALETTES, DEFAULT_OUTLINE };
export type { Palette, OutlineItem, ContentData, GeneratorOptions };
//# sourceMappingURL=generate.d.ts.map