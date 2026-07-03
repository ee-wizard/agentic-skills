#!/usr/bin/env node
/**
 * PPT Generator - 通用智能 PPT 生成脚本 (TypeScript)
 * 使用 pptxgenjs 生成专业 PPT
 * 原 Python 版本: generate_ppt.py
 */
declare const COLOR_PALETTES: Record<string, {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bgLight: string;
    text: string;
    textLight: string;
}>;
declare function createPresentation(title?: string, subtitle?: string, palette?: string, outputPath?: string): string;
export { createPresentation, COLOR_PALETTES };
//# sourceMappingURL=generate_ppt.d.ts.map