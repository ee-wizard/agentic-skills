#!/usr/bin/env node

/**
 * PPT Generator - 通用 PPT 生成脚本 (TypeScript)
 * 使用 pptxgenjs 生成专业 PPT
 */

import * as fs from 'fs';
import * as path from 'path';
import PptxGenJS from 'pptxgenjs';

// ── 类型定义 ────────────────────────────────────────

interface Palette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgLight: string;
  bgDark?: string;
  text: string;
  textLight: string;
}

interface OutlineItem {
  type: 'cover' | 'toc' | 'content' | 'big-number' | 'summary' | 'end';
  title: string;
  subtitle?: string;
}

interface ContentData {
  title?: string;
  subtitle?: string;
  toc?: Array<{ title: string }>;
  summary?: string[];
  endMessage?: string;
  [key: string]: unknown;
}

interface GeneratorOptions {
  title: string;
  author?: string;
  company?: string;
  subject?: string;
  palette: string;
  language: string;
  width?: number;
  height?: number;
}

// ── 配色方案 ────────────────────────────────────────

const COLOR_PALETTES: Record<string, Palette> = {
  'midnight-executive': {
    name: '午夜商务',
    primary: '1E2761',
    secondary: 'CADCFC',
    accent: 'FFFFFF',
    bgLight: 'FFFFFF',
    bgDark: '0D1117',
    text: '1E2761',
    textLight: '6B7280',
  },
  'tech-dark': {
    name: '科技深空',
    primary: '0D1117',
    secondary: '161B22',
    accent: '58A6FF',
    bgLight: 'FFFFFF',
    bgDark: '0D1117',
    text: 'F0F6FC',
    textLight: '8B949E',
  },
  'coral-energy': {
    name: '珊瑚活力',
    primary: 'F96167',
    secondary: 'F9E795',
    accent: '2F3C7E',
    bgLight: 'FFFFFF',
    text: '1F2937',
    textLight: '6B7280',
  },
  'warm-terracotta': {
    name: '暖陶简约',
    primary: 'B85042',
    secondary: 'E7E8D1',
    accent: 'A7BEAE',
    bgLight: 'FDFBF7',
    text: '3D3D3D',
    textLight: '6B7280',
  },
  'ocean-gradient': {
    name: '海洋渐变',
    primary: '065A82',
    secondary: '1C7293',
    accent: '21295C',
    bgLight: 'FFFFFF',
    bgDark: '065A82',
    text: '065A82',
    textLight: '6B7280',
  },
  'charcoal-minimal': {
    name: '炭灰极简',
    primary: '36454F',
    secondary: 'F2F2F2',
    accent: '212121',
    bgLight: 'FFFFFF',
    text: '36454F',
    textLight: '8B949E',
  },
  'teal-trust': {
    name: '青绿信任',
    primary: '028090',
    secondary: '00A896',
    accent: '02C39A',
    bgLight: 'FFFFFF',
    text: '065A60',
    textLight: '374151',
  },
  'berry-cream': {
    name: '莓果奶油',
    primary: '6D2E46',
    secondary: 'A26769',
    accent: 'ECE2D0',
    bgLight: 'FDFBF7',
    text: '3D3D3D',
    textLight: '6B7280',
  },
  'sage-calm': {
    name: '鼠尾草静',
    primary: '84B59F',
    secondary: '69A297',
    accent: '50808E',
    bgLight: 'F5F9F8',
    text: '3D4F4E',
    textLight: '6B7280',
  },
  'cherry-bold': {
    name: '樱桃大胆',
    primary: '990011',
    secondary: 'FCF6F5',
    accent: '2F3C7E',
    bgLight: 'FFFFFF',
    text: '1F2937',
    textLight: '6B7280',
  },
};

// ── 默认内容结构 ────────────────────────────────────

const DEFAULT_OUTLINE: OutlineItem[] = [
  { type: 'cover', title: '封面', subtitle: '演示主题' },
  { type: 'toc', title: '目录' },
  { type: 'content', title: '内容概览' },
  { type: 'content', title: '核心要点 1' },
  { type: 'content', title: '核心要点 2' },
  { type: 'content', title: '核心要点 3' },
  { type: 'content', title: '案例分析' },
  { type: 'content', title: '数据展示' },
  { type: 'summary', title: '总结' },
  { type: 'end', title: '谢谢' },
];

// ── PPT Generator 类 ───────────────────────────────

class PPTGenerator {
  private pptx: PptxGenJS;
  private options: GeneratorOptions;
  private colors: Palette;

  constructor(options: Partial<GeneratorOptions> = {}) {
    this.pptx = new PptxGenJS();
    this.options = {
      title: options.title || '演示文稿',
      author: options.author || 'PPT Generator',
      company: options.company || '',
      subject: options.subject || '',
      palette: options.palette || 'midnight-executive',
      language: options.language || 'zh',
    };
    this.colors = COLOR_PALETTES[this.options.palette] || COLOR_PALETTES['midnight-executive'];
    this.pptx.layout = 'LAYOUT_16x9';
  }

  /**
   * 设置演示文稿属性
   */
  private setMetadata(): void {
    this.pptx.author = this.options.author || '';
    this.pptx.title = this.options.title;
    this.pptx.subject = this.options.subject || '';
    this.pptx.company = this.options.company || '';
  }

  /**
   * 添加封面页
   */
  addCoverPage(title: string, subtitle?: string): void {
    const slide = this.pptx.addSlide();

    // 深色背景
    slide.background = { color: this.colors.primary };

    // 装饰元素 - 右上角圆形
    slide.addShape('ellipse', {
      x: 9, y: -1.5, w: 5, h: 5,
      fill: { color: this.colors.accent, transparency: 90 },
    });

    // 装饰元素 - 左下角圆形
    slide.addShape('ellipse', {
      x: -1, y: 5, w: 4, h: 4,
      fill: { color: this.colors.accent, transparency: 90 },
    });

    // 主标题
    slide.addText(title, {
      x: 0.8, y: 2.5, w: 11.5, h: 1.5,
      fontSize: 48,
      fontFace: 'Microsoft YaHei',
      color: 'FFFFFF',
      bold: true,
      align: 'center',
    });

    // 副标题
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8, y: 4.2, w: 11.5, h: 0.8,
        fontSize: 20,
        fontFace: 'Microsoft YaHei',
        color: this.colors.secondary,
        align: 'center',
      });
    }

    // 底部装饰线
    slide.addShape('rectangle', {
      x: 5.5, y: 5.5, w: 2.5, h: 0.05,
      fill: { color: this.colors.accent },
    });
  }

  /**
   * 添加目录页
   */
  addTOCPage(items: Array<{ title: string }>): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.colors.bgLight || 'FFFFFF' };

    // 页面标题
    slide.addText(this.options.language === 'zh' ? '目录' : 'Contents', {
      x: 0.8, y: 0.5, w: 11.5, h: 0.8,
      fontSize: 36,
      fontFace: 'Microsoft YaHei',
      color: this.colors.primary,
      bold: true,
    });

    // 左侧装饰条
    slide.addShape('rectangle', {
      x: 0.8, y: 1.5, w: 0.1, h: 5.5,
      fill: { color: this.colors.primary },
    });

    // 目录项
    const startY = 1.8;
    const itemHeight = 0.9;

    items.forEach((item, index) => {
      // 序号
      slide.addText(String(index + 1).padStart(2, '0'), {
        x: 1.2, y: startY + index * itemHeight, w: 0.6, h: 0.6,
        fontSize: 24,
        fontFace: 'Microsoft YaHei',
        color: this.colors.primary,
        bold: true,
      });

      // 标题
      slide.addText(item.title, {
        x: 2.0, y: startY + index * itemHeight, w: 9, h: 0.6,
        fontSize: 18,
        fontFace: 'Microsoft YaHei',
        color: this.colors.text || '333333',
      });

      // 分隔线
      if (index < items.length - 1) {
        slide.addShape('rectangle', {
          x: 2.0, y: startY + index * itemHeight + 0.7, w: 9, h: 0.01,
          fill: { color: 'E5E5E5' },
        });
      }
    });
  }

  /**
   * 添加内容页
   */
  addContentPage(title: string, content: string | string[], _layout = 'default'): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.colors.bgLight || 'FFFFFF' };

    // 顶部装饰条
    slide.addShape('rectangle', {
      x: 0, y: 0, w: 13.33, h: 0.15,
      fill: { color: this.colors.primary },
    });

    // 页面标题
    slide.addText(title, {
      x: 0.8, y: 0.5, w: 11.5, h: 0.8,
      fontSize: 32,
      fontFace: 'Microsoft YaHei',
      color: this.colors.primary,
      bold: true,
    });

    // 内容区域
    if (typeof content === 'string') {
      slide.addText(content, {
        x: 0.8, y: 1.6, w: 11.5, h: 5,
        fontSize: 16,
        fontFace: 'Microsoft YaHei',
        color: this.colors.text || '333333',
        valign: 'top',
        lineSpacingMultiple: 1.5,
      });
    } else if (Array.isArray(content)) {
      const bulletItems = content.map((item) => ({
        text: item,
        options: { bullet: true, breakLine: true },
      }));

      slide.addText(bulletItems, {
        x: 0.8, y: 1.6, w: 11.5, h: 5,
        fontSize: 16,
        fontFace: 'Microsoft YaHei',
        color: this.colors.text || '333333',
        valign: 'top',
        paraSpaceAfter: 12,
      });
    }
  }

  /**
   * 添加大数据展示页
   */
  addBigNumberPage(title: string, numbers: Array<{ value: string; label: string }>): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.colors.bgLight || 'FFFFFF' };

    // 页面标题
    slide.addText(title, {
      x: 0.8, y: 0.5, w: 11.5, h: 0.8,
      fontSize: 32,
      fontFace: 'Microsoft YaHei',
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
      slide.addShape('roundRect', {
        x, y: startY, w: cardWidth, h: cardHeight,
        fill: { color: this.colors.primary },
        rectRadius: 0.1,
      });

      // 数字
      slide.addText(item.value, {
        x, y: startY + 0.4, w: cardWidth, h: 1.2,
        fontSize: 48,
        fontFace: 'Microsoft YaHei',
        color: 'FFFFFF',
        bold: true,
        align: 'center',
      });

      // 标签
      slide.addText(item.label, {
        x, y: startY + 1.6, w: cardWidth, h: 0.6,
        fontSize: 14,
        fontFace: 'Microsoft YaHei',
        color: this.colors.secondary,
        align: 'center',
      });
    });
  }

  /**
   * 添加总结页
   */
  addSummaryPage(title: string | undefined, points: string[]): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.colors.primary };

    // 页面标题
    slide.addText(title || (this.options.language === 'zh' ? '总结' : 'Summary'), {
      x: 0.8, y: 0.5, w: 11.5, h: 1,
      fontSize: 36,
      fontFace: 'Microsoft YaHei',
      color: 'FFFFFF',
      bold: true,
    });

    // 要点
    const startY = 1.8;
    const itemHeight = 1;

    points.forEach((point, index) => {
      // 序号圆点
      slide.addShape('ellipse', {
        x: 0.8, y: startY + index * itemHeight + 0.15, w: 0.35, h: 0.35,
        fill: { color: this.colors.accent },
      });

      // 文字
      slide.addText(point, {
        x: 1.4, y: startY + index * itemHeight, w: 10.5, h: 0.7,
        fontSize: 18,
        fontFace: 'Microsoft YaHei',
        color: 'FFFFFF',
      });
    });
  }

  /**
   * 添加结束页
   */
  addEndPage(message?: string): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.colors.primary };

    // 装饰圆形
    slide.addShape('ellipse', {
      x: 4, y: 1.5, w: 5, h: 5,
      fill: { color: this.colors.accent, transparency: 92 },
    });

    // 结束语
    slide.addText(message || (this.options.language === 'zh' ? '谢谢观看' : 'Thank You'), {
      x: 0, y: 3, w: 13.33, h: 1.5,
      fontSize: 48,
      fontFace: 'Microsoft YaHei',
      color: 'FFFFFF',
      bold: true,
      align: 'center',
    });
  }

  /**
   * 根据大纲生成所有页面
   */
  generateFromOutline(outline: OutlineItem[], contentData: ContentData): void {
    this.setMetadata();

    outline.forEach((page, index) => {
      switch (page.type) {
        case 'cover':
          this.addCoverPage(
            (contentData.title as string) || this.options.title,
            contentData.subtitle as string || ''
          );
          break;

        case 'toc':
          this.addTOCPage((contentData.toc as Array<{ title: string }>) || []);
          break;

        case 'content':
          this.addContentPage(
            page.title,
            (contentData[`content${index}`] as string[]) || []
          );
          break;

        case 'big-number':
          this.addBigNumberPage(
            page.title,
            (contentData[`numbers${index}`] as Array<{ value: string; label: string }>) || []
          );
          break;

        case 'summary':
          this.addSummaryPage(page.title, contentData.summary || []);
          break;

        case 'end':
          this.addEndPage(contentData.endMessage as string || '');
          break;
      }
    });
  }

  /**
   * 保存文件
   */
  async save(outputPath: string): Promise<string> {
    try {
      await this.pptx.writeFile({ fileName: outputPath });
      console.log(`✅ PPT 已生成: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ 生成失败:', error);
      throw error;
    }
  }
}

// ── CLI 入口 ────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);

  const options: Partial<GeneratorOptions> & { output?: string } = {
    title: '演示文稿',
    palette: 'midnight-executive',
    language: 'zh',
    output: path.join(process.env.HOME || process.env.USERPROFILE || '.', 'Desktop', '演示文稿.pptx'),
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' || args[i] === '-t') {
      options.title = args[++i];
    } else if (args[i] === '--palette' || args[i] === '-p') {
      options.palette = args[++i];
    } else if (args[i] === '--lang' || args[i] === '-l') {
      options.language = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      options.output = args[++i];
    }
  }

  const generator = new PPTGenerator(options);

  generator.generateFromOutline(DEFAULT_OUTLINE, {
    title: options.title,
    subtitle: options.language === 'zh' ? '由 AI 智能生成' : 'Generated by AI',
    toc: [
      { title: '内容概览' },
      { title: '核心要点分析' },
      { title: '案例研究' },
      { title: '数据解读' },
      { title: '总结与展望' },
    ],
    content1: ['这是第一个核心要点，详细说明相关内容...'],
    content2: ['这是第二个核心要点，详细说明相关内容...'],
    summary: [
      '核心要点一：重要的结论',
      '核心要点二：关键的洞见',
      '核心要点三：可行的建议',
    ],
  } as ContentData);

  generator.save(options.output!).catch(console.error);
}

export { PPTGenerator, COLOR_PALETTES, DEFAULT_OUTLINE };
export type { Palette, OutlineItem, ContentData, GeneratorOptions };
