#!/usr/bin/env node

/**
 * MBE插画风格 PPT 生成器 (TypeScript)
 * 大学新生开学第一课
 * 原 Python 版本: generate_mbe.py
 */

import * as path from 'path';
import * as os from 'os';
import PptxGenJS from 'pptxgenjs';

// MBE 风格配色
const MBE = {
  bg: 'FFFFFF',
  border: '000000',
  text: '1A1A1A',
  yellow: 'FFD600',
  purple: '9C27B0',
  red: 'F44336',
  blue: '2196F3',
  green: '4CAF50',
  orange: 'FF9800',
  gray: '808080',
  lightGray: 'F5F5F5',
  nearWhite: 'FAFAFA',
};

function createMBEPPT(outputPath?: string): string {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // ===== 第1页：封面 =====
  let slide = pptx.addSlide();
  slide.background = { color: MBE.bg };

  // 装饰圆形
  slide.addShape('ellipse', { x: 10.5, y: 5.5, w: 3, h: 3, fill: { color: MBE.yellow } });
  slide.addShape('ellipse', { x: -0.5, y: -0.5, w: 2, h: 2, fill: { color: MBE.purple } });
  // 小装饰点
  slide.addShape('ellipse', { x: 11, y: 1.5, w: 0.3, h: 0.3, fill: { color: MBE.yellow } });
  slide.addShape('ellipse', { x: 11.5, y: 2.5, w: 0.3, h: 0.3, fill: { color: MBE.purple } });
  slide.addShape('ellipse', { x: 10.8, y: 3.5, w: 0.3, h: 0.3, fill: { color: MBE.red } });

  // 主标题
  slide.addText('大学新生开学第一课', {
    x: 0.8, y: 2, w: 8, h: 1.5, fontSize: 48, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei',
  });
  slide.addText('开启精彩的大学之旅', {
    x: 0.8, y: 3.5, w: 8, h: 0.8, fontSize: 24, color: MBE.gray, fontFace: 'Microsoft YaHei',
  });

  // 右侧卡通人物（用形状代替）
  slide.addShape('ellipse', { x: 10, y: 2.5, w: 1.5, h: 1.5, fill: { color: MBE.yellow }, line: { color: MBE.border, width: 3 } });
  slide.addShape('roundRect', { x: 9.5, y: 4, w: 2.5, h: 2, fill: { color: MBE.blue }, line: { color: MBE.border, width: 3 }, rectRadius: 0.2 });
  slide.addShape('roundRect', { x: 8.5, y: 1.8, w: 2, h: 0.8, fill: { color: MBE.bg }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  slide.addText('Hello!', { x: 8.7, y: 1.9, w: 1.6, h: 0.6, fontSize: 14, bold: true, color: MBE.text, align: 'center', fontFace: 'Microsoft YaHei' });

  slide.addText('2026年秋季学期', { x: 0.8, y: 6.5, w: 5, h: 0.5, fontSize: 14, color: MBE.gray, fontFace: 'Microsoft YaHei' });

  // ===== 第2页：目录 =====
  slide = pptx.addSlide();
  slide.background = { color: MBE.bg };
  slide.addShape('ellipse', { x: 10.5, y: 5.5, w: 3, h: 3, fill: { color: MBE.green } });
  slide.addShape('ellipse', { x: -0.5, y: -0.5, w: 2, h: 2, fill: { color: MBE.orange } });
  slide.addShape('ellipse', { x: 11, y: 1, w: 0.3, h: 0.3, fill: { color: MBE.purple } });

  slide.addText('今日议程', { x: 0.8, y: 0.5, w: 5, h: 1, fontSize: 36, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });

  const tocItems = [
    { num: '01', text: '认识校园', color: MBE.yellow },
    { num: '02', text: '学业规划', color: MBE.purple },
    { num: '03', text: '校园生活', color: MBE.red },
    { num: '04', text: '人际关系', color: MBE.blue },
    { num: '05', text: '未来展望', color: MBE.green },
  ];

  tocItems.forEach((item, i) => {
    const y = 1.8 + i * 1;
    slide.addShape('ellipse', { x: 0.8, y, w: 0.7, h: 0.7, fill: { color: item.color } });
    slide.addText(item.num, { x: 0.8, y: y + 0.1, w: 0.7, h: 0.5, fontSize: 16, bold: true, color: MBE.bg, align: 'center', fontFace: 'Microsoft YaHei' });
    slide.addText(item.text, { x: 1.8, y: y + 0.1, w: 5, h: 0.5, fontSize: 20, color: MBE.text, fontFace: 'Microsoft YaHei' });
  });

  // 右侧装饰框
  slide.addShape('roundRect', { x: 8.5, y: 1.5, w: 4, h: 5, fill: { color: MBE.lightGray }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });

  // ===== 第3页：认识校园 =====
  slide = pptx.addSlide();
  slide.background = { color: MBE.bg };
  slide.addShape('ellipse', { x: 10.5, y: 5.5, w: 3, h: 3, fill: { color: MBE.purple } });
  slide.addShape('ellipse', { x: -0.5, y: -0.5, w: 2, h: 2, fill: { color: MBE.red } });

  slide.addText('认识校园', { x: 0.8, y: 0.5, w: 6, h: 1, fontSize: 36, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });

  const points = [
    { title: '教学楼分布', desc: '了解各学院教学楼位置', color: MBE.yellow },
    { title: '图书馆资源', desc: '海量藏书与电子资源', color: MBE.purple },
    { title: '食堂指南', desc: '各校区美食推荐', color: MBE.red },
    { title: '校园地图', desc: '快速熟悉校园环境', color: MBE.blue },
  ];

  points.forEach((p, i) => {
    const y = 1.8 + i * 1.2;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.1, w: 0.4, h: 0.4, fill: { color: p.color } });
    slide.addText(p.title, { x: 1.4, y, w: 5, h: 0.5, fontSize: 18, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });
    slide.addText(p.desc, { x: 1.4, y: y + 0.4, w: 5, h: 0.5, fontSize: 14, color: MBE.gray, fontFace: 'Microsoft YaHei' });
  });

  // 右侧插画区
  slide.addShape('roundRect', { x: 8, y: 1.2, w: 4.8, h: 5.5, fill: { color: MBE.nearWhite }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  // 简化建筑
  slide.addShape('roundRect', { x: 9.5, y: 3, w: 2, h: 2.5, fill: { color: MBE.orange }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  slide.addShape('roundRect', { x: 9.7, y: 3.3, w: 0.4, h: 0.4, fill: { color: MBE.yellow } });
  slide.addShape('roundRect', { x: 10.4, y: 3.3, w: 0.4, h: 0.4, fill: { color: MBE.yellow } });
  slide.addShape('rectangle', { x: 10.2, y: 4.8, w: 0.6, h: 0.5, fill: { color: MBE.red } });

  // ===== 第4页：学业规划 =====
  slide = pptx.addSlide();
  slide.background = { color: MBE.bg };
  slide.addShape('ellipse', { x: 10.5, y: 5.5, w: 3, h: 3, fill: { color: MBE.blue } });
  slide.addShape('ellipse', { x: -0.5, y: -0.5, w: 2, h: 2, fill: { color: MBE.green } });

  slide.addText('学业规划', { x: 0.8, y: 0.5, w: 6, h: 1, fontSize: 36, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });

  const planItems = [
    { title: '课程选择', desc: '了解必修与选修，合理规划每学期', color: MBE.yellow },
    { title: '时间管理', desc: '平衡学习、社团与休闲时间', color: MBE.purple },
    { title: '考证规划', desc: '英语四六级、计算机等级、专业证书', color: MBE.red },
    { title: '发展方向', desc: '考研、留学、就业，提前规划路径', color: MBE.blue },
  ];

  planItems.forEach((p, i) => {
    const y = 1.8 + i * 1.2;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.1, w: 0.4, h: 0.4, fill: { color: p.color } });
    slide.addText(p.title, { x: 1.4, y, w: 5, h: 0.5, fontSize: 18, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });
    slide.addText(p.desc, { x: 1.4, y: y + 0.4, w: 5, h: 0.5, fontSize: 14, color: MBE.gray, fontFace: 'Microsoft YaHei' });
  });

  // 右侧装饰
  slide.addShape('roundRect', { x: 8, y: 1.2, w: 4.8, h: 5.5, fill: { color: MBE.nearWhite }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  slide.addShape('roundRect', { x: 8.8, y: 2, w: 3.2, h: 1.5, fill: { color: MBE.yellow }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  slide.addText('学习', { x: 8.8, y: 2.3, w: 3.2, h: 0.8, fontSize: 28, bold: true, color: MBE.text, align: 'center', fontFace: 'Microsoft YaHei' });
  slide.addShape('roundRect', { x: 8.8, y: 4, w: 3.2, h: 1.5, fill: { color: MBE.green }, line: { color: MBE.border, width: 2 }, rectRadius: 0.1 });
  slide.addText('成长', { x: 8.8, y: 4.3, w: 3.2, h: 0.8, fontSize: 28, bold: true, color: MBE.bg, align: 'center', fontFace: 'Microsoft YaHei' });

  // ===== 第5页：总结 =====
  slide = pptx.addSlide();
  slide.background = { color: MBE.bg };
  slide.addShape('ellipse', { x: 10.5, y: 5.5, w: 3, h: 3, fill: { color: MBE.red } });
  slide.addShape('ellipse', { x: -0.5, y: -0.5, w: 2, h: 2, fill: { color: MBE.blue } });

  slide.addText('开启精彩大学生活', { x: 0.8, y: 0.5, w: 8, h: 1, fontSize: 36, bold: true, color: MBE.text, fontFace: 'Microsoft YaHei' });

  const summaryItems = [
    { color: MBE.yellow, text: '保持好奇心和求知欲' },
    { color: MBE.purple, text: '积极参与社团和活动' },
    { color: MBE.red, text: '建立良好的人际关系' },
    { color: MBE.blue, text: '关注身心健康' },
  ];

  summaryItems.forEach((item, i) => {
    const y = 2 + i * 1;
    slide.addShape('ellipse', { x: 0.8, y: y + 0.1, w: 0.5, h: 0.5, fill: { color: item.color } });
    slide.addText(item.text, { x: 1.5, y: y + 0.1, w: 8, h: 0.6, fontSize: 20, color: MBE.text, fontFace: 'Microsoft YaHei' });
  });

  slide.addText('祝大家大学生活愉快！', { x: 0.8, y: 6, w: 8, h: 0.8, fontSize: 22, bold: true, color: MBE.purple, fontFace: 'Microsoft YaHei' });

  const output = outputPath || path.join(os.homedir(), 'Desktop', '大学新生开学第一课_MBE风格.pptx');
  pptx.writeFile({ fileName: output }).then(() => {
    console.log(`✅ MBE风格PPT已生成: ${output}`);
  });
  return output;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  createMBEPPT(args[0] || undefined);
}

export { createMBEPPT };
