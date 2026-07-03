#!/usr/bin/env node

/**
 * 大气高端风格 PPT 生成器 (TypeScript)
 * AI发展趋势报告
 * 原 Python 版本: generate_grand.py
 */

import * as path from "path";
import * as os from "os";
import PptxGenJS from "pptxgenjs";

// 高端大气配色
const COLORS = {
  bgDark: "0A0F1E", // 深邃黑蓝
  bgGradient: "141E3C", // 渐变深蓝
  accentGold: "D4AF37", // 金色
  accentBlue: "4682C8", // 宝石蓝
  white: "FFFFFF",
  lightBlue: "B4C8F0",
  gray: "96A0B4",
  darkGray: "505A6E",
};

function createGrandPPT(outputPath?: string): string {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";

  // ========== 第1页：封面 ==========
  let slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };

  // 顶部金色装饰线
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });
  // 底部金色装饰线
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });
  // 左侧装饰条
  slide.addShape("rect", {
    x: 0,
    y: 2,
    w: 0.3,
    h: 3.5,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("AI", {
    x: 1,
    y: 2.2,
    w: 3,
    h: 1.5,
    fontSize: 72,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("发展趋势报告", {
    x: 3.5,
    y: 3.2,
    w: 7,
    h: 1,
    fontSize: 40,
    bold: true,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("2025-2026年行业深度洞察", {
    x: 1,
    y: 4.5,
    w: 10,
    h: 0.6,
    fontSize: 20,
    color: COLORS.lightBlue,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("基于 Gartner | IDC | 麦肯锡 | 艾瑞咨询", {
    x: 1,
    y: 5.5,
    w: 10,
    h: 0.5,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  // 右下角装饰
  slide.addShape("ellipse", {
    x: 10,
    y: 4,
    w: 4,
    h: 4,
    fill: { color: COLORS.bgGradient },
  });

  // ========== 第2页：目录 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("CONTENTS", {
    x: 0.8,
    y: 0.5,
    w: 5,
    h: 0.8,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("目录", {
    x: 0.8,
    y: 1,
    w: 5,
    h: 1,
    fontSize: 40,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });

  const tocItems = [
    { num: "01", title: "全球AI市场规模", desc: "市场规模、增长率、区域分布" },
    { num: "02", title: "技术演进趋势", desc: "大模型、端侧AI、AI Agent" },
    { num: "03", title: "应用场景分析", desc: "医疗、教育、制造、金融" },
    { num: "04", title: "行业案例研究", desc: "头部企业AI战略布局" },
    { num: "05", title: "未来趋势展望", desc: "2026年预测与建议" },
  ];

  tocItems.forEach((item, i) => {
    const y = 2.3 + i * 0.95;
    slide.addText(item.num, {
      x: 0.8,
      y,
      w: 1,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: COLORS.accentGold,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(item.title, {
      x: 2,
      y: y + 0.1,
      w: 5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLORS.white,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(item.desc, {
      x: 2,
      y: y + 0.5,
      w: 5,
      h: 0.4,
      fontSize: 12,
      color: COLORS.gray,
      fontFace: "Microsoft YaHei",
    });
  });

  // 右侧装饰
  slide.addShape("rect", {
    x: 9,
    y: 1,
    w: 4,
    h: 6,
    fill: { color: COLORS.bgGradient },
  });

  // ========== 第3页：全球市场规模 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("01", {
    x: 0.8,
    y: 0.3,
    w: 1,
    h: 0.6,
    fontSize: 16,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("全球AI市场规模", {
    x: 0.8,
    y: 0.7,
    w: 6,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Global AI Market Size", {
    x: 0.8,
    y: 1.4,
    w: 6,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const dataCards = [
    {
      value: "4500",
      unit: "亿美元",
      desc: "2025年全球AI市场总规模",
      borderColor: COLORS.accentGold,
    },
    {
      value: "20%",
      unit: "CAGR",
      desc: "年复合增长率预测",
      borderColor: COLORS.accentBlue,
    },
    {
      value: "67%",
      unit: "企业",
      desc: "已在业务中采用AI技术",
      borderColor: COLORS.lightBlue,
    },
  ];

  dataCards.forEach((card, i) => {
    const x = 0.8 + i * 4.2;
    slide.addShape("rect", {
      x,
      y: 2.2,
      w: 3.8,
      h: 2.5,
      fill: { color: COLORS.bgGradient },
      line: { color: card.borderColor, width: 2 },
    });
    slide.addText(card.value, {
      x: x + 0.2,
      y: 2.5,
      w: 3.4,
      h: 1,
      fontSize: 48,
      bold: true,
      color: card.borderColor,
      align: "center",
      fontFace: "Microsoft YaHei",
    });
    slide.addText(card.unit, {
      x: x + 0.2,
      y: 3.4,
      w: 3.4,
      h: 0.5,
      fontSize: 18,
      color: COLORS.white,
      align: "center",
      fontFace: "Microsoft YaHei",
    });
    slide.addText(card.desc, {
      x: x + 0.2,
      y: 4,
      w: 3.4,
      h: 0.5,
      fontSize: 12,
      color: COLORS.gray,
      align: "center",
      fontFace: "Microsoft YaHei",
    });
  });

  const grandDetails = [
    "• 生成式AI市场增长迅猛，预计2025年占比超30%，成为最大细分市场",
    "• 中国AI市场增速领先全球，2025年规模预计达1500亿人民币",
    "• 企业级AI解决方案市场年增长率达35%，2028年市场规模将突破1万亿美元",
    "• AI芯片市场规模高速增长，2025年预计突破1000亿美元",
  ];
  grandDetails.forEach((d, i) => {
    slide.addText(d, {
      x: 0.8,
      y: 5 + i * 0.5,
      w: 12,
      h: 0.5,
      fontSize: 13,
      color: COLORS.lightBlue,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第4页：技术演进趋势 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("02", {
    x: 0.8,
    y: 0.3,
    w: 1,
    h: 0.6,
    fontSize: 16,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("技术演进趋势", {
    x: 0.8,
    y: 0.7,
    w: 6,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Technology Evolution Trends", {
    x: 0.8,
    y: 1.4,
    w: 6,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const grandTechItems = [
    {
      title: "大模型多模态",
      desc: "GPT-5、Gemini 2.0等旗舰模型全面支持文本、图像、视频、音频多模态理解与生成，实现真正的跨模态智能。",
    },
    {
      title: "端侧AI普及",
      desc: "搭载NPU的智能设备快速增长。2026年预计60%以上新出货设备将具备本地AI处理能力。",
    },
    {
      title: "AI Agent爆发",
      desc: 'AutoGPT、BabyAGI等Agent项目爆发式增长。AI从"工具"进化为"助手"，自主规划和执行复杂任务。',
    },
    {
      title: "开源生态崛起",
      desc: "Llama 3、Mistral等开源模型性能逼近GPT-4，推动AI技术民主化，降低企业应用门槛。",
    },
  ];

  grandTechItems.forEach((item, i) => {
    const y = 2.2 + i * 1.25;
    slide.addShape("rect", {
      x: 0.8,
      y,
      w: 0.08,
      h: 0.9,
      fill: { color: COLORS.accentGold },
    });
    slide.addText(item.title, {
      x: 1.1,
      y,
      w: 4,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: COLORS.white,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(item.desc, {
      x: 1.1,
      y: y + 0.45,
      w: 11,
      h: 0.7,
      fontSize: 12,
      color: COLORS.gray,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第5页：应用场景分析 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("03", {
    x: 0.8,
    y: 0.3,
    w: 1,
    h: 0.6,
    fontSize: 16,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("应用场景分析", {
    x: 0.8,
    y: 0.7,
    w: 6,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Application Scenarios", {
    x: 0.8,
    y: 1.4,
    w: 6,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const grandApps = [
    {
      borderColor: COLORS.accentGold,
      title: "医疗健康",
      desc: "AI辅助诊断准确率达95%\n智能药物研发周期缩短60%\n2025年AI医疗市场达150亿美元",
    },
    {
      borderColor: COLORS.accentBlue,
      title: "教育培训",
      desc: "个性化学习效率提升60%\nAI tutoring覆盖1亿+学生\n作业批改时间减少70%",
    },
    {
      borderColor: COLORS.lightBlue,
      title: "智能制造",
      desc: "智能质检效率提升40%\n预测性维护降低停机30%\n数字孪生应用渗透率达45%",
    },
    {
      borderColor: COLORS.gray,
      title: "金融服务",
      desc: "智能风控坏账率降低30%\nAI客服替代率达80%\n智能投顾管理规模破万亿",
    },
  ];

  grandApps.forEach((app, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.8 + col * 6.2;
    const y = 2.2 + row * 2.4;

    slide.addShape("rect", {
      x,
      y,
      w: 5.8,
      h: 2.1,
      fill: { color: COLORS.bgGradient },
      line: { color: app.borderColor, width: 2 },
    });
    slide.addText(app.title, {
      x: x + 0.3,
      y: y + 0.3,
      w: 5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: app.borderColor,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(app.desc, {
      x: x + 0.3,
      y: y + 0.9,
      w: 5.2,
      h: 1,
      fontSize: 13,
      color: COLORS.lightBlue,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第6页：行业案例研究 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("04", {
    x: 0.8,
    y: 0.3,
    w: 1,
    h: 0.6,
    fontSize: 16,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("行业案例研究", {
    x: 0.8,
    y: 0.7,
    w: 6,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Industry Case Studies", {
    x: 0.8,
    y: 1.4,
    w: 6,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const grandCases = [
    {
      company: "OpenAI",
      desc: "ChatGPT月活超2亿，企业客户超100万家，GPT-4 API调用量年增长10倍。",
    },
    {
      company: "Google",
      desc: "Gemini 1.5 Pro上下文窗口达100万token，Bard累计服务超1亿用户。",
    },
    {
      company: "Microsoft",
      desc: "Copilot全面集成Office 365，用户超150万，企业效率提升超40%。",
    },
    {
      company: "字节跳动",
      desc: "AI推荐算法驱动抖音增长，AI内容生成覆盖80%短视频创作。",
    },
    {
      company: "华为",
      desc: "盘古大模型赋能多个行业，AI算力基础设施全球前三。",
    },
    {
      company: "阿里巴巴",
      desc: "通义千问服务企业超10万家，AI电商GMV贡献超15%。",
    },
  ];

  grandCases.forEach((c, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.8 + col * 6.2;
    const y = 2 + row * 1.7;
    slide.addText(c.company, {
      x,
      y,
      w: 5,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: COLORS.accentGold,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(c.desc, {
      x,
      y: y + 0.6,
      w: 5.8,
      h: 0.8,
      fontSize: 13,
      color: COLORS.lightBlue,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第7页：未来趋势展望 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("05", {
    x: 0.8,
    y: 0.3,
    w: 1,
    h: 0.6,
    fontSize: 16,
    color: COLORS.accentGold,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("未来趋势展望", {
    x: 0.8,
    y: 0.7,
    w: 6,
    h: 0.8,
    fontSize: 36,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Future Outlook 2026", {
    x: 0.8,
    y: 1.4,
    w: 6,
    h: 0.4,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const outlooks = [
    "AI Agent将成为个人和企业的标配助手",
    "多模态AI应用全面爆发，视频、3D生成常态化",
    "端侧AI普及，隐私保护成为核心竞争力",
    "AI原生应用崛起，颠覆传统软件交互方式",
    "AI监管框架逐步完善，合规成为必备能力",
  ];

  outlooks.forEach((text, i) => {
    const y = 2.2 + i * 0.95;
    slide.addShape("ellipse", {
      x: 0.8,
      y: y + 0.1,
      w: 0.5,
      h: 0.5,
      fill: { color: COLORS.accentGold },
    });
    slide.addText(String(i + 1), {
      x: 0.8,
      y: y + 0.15,
      w: 0.5,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: COLORS.bgDark,
      align: "center",
      fontFace: "Microsoft YaHei",
    });
    slide.addText(text, {
      x: 1.5,
      y: y + 0.15,
      w: 10,
      h: 0.5,
      fontSize: 18,
      color: COLORS.white,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第8页：总结 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("总结与建议", {
    x: 0.8,
    y: 0.5,
    w: 6,
    h: 1,
    fontSize: 40,
    bold: true,
    color: COLORS.white,
    fontFace: "Microsoft YaHei",
  });
  slide.addText("Summary & Recommendations", {
    x: 0.8,
    y: 1.3,
    w: 6,
    h: 0.5,
    fontSize: 14,
    color: COLORS.gray,
    fontFace: "Microsoft YaHei",
  });

  const suggestions = [
    { title: "立即行动", desc: "不要等待，先从小场景切入AI应用，快速验证价值" },
    {
      title: "选对场景",
      desc: "优先选择ROI明确、痛点清晰的场景，确保快速见效",
    },
    { title: "数据为王", desc: "高质量数据是AI落地成功的关键，加大数据投入" },
    { title: "人才培养", desc: "组建AI团队或与专业机构合作，建立AI能力" },
    { title: "持续迭代", desc: "AI技术演进快，保持学习和迭代，建立技术储备" },
  ];

  suggestions.forEach((s, i) => {
    const y = 2.3 + i * 0.95;
    slide.addText(s.title, {
      x: 0.8,
      y,
      w: 2.5,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: COLORS.accentGold,
      fontFace: "Microsoft YaHei",
    });
    slide.addText(s.desc, {
      x: 3.5,
      y: y + 0.1,
      w: 9,
      h: 0.5,
      fontSize: 15,
      color: COLORS.lightBlue,
      fontFace: "Microsoft YaHei",
    });
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  // ========== 第9页：结束页 ==========
  slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });
  slide.addShape("rect", {
    x: 0,
    y: 7.4,
    w: 13.33,
    h: 0.05,
    fill: { color: COLORS.accentGold },
  });

  slide.addText("感谢观看", {
    x: 0,
    y: 2.8,
    w: 13.33,
    h: 1.5,
    fontSize: 52,
    bold: true,
    color: COLORS.white,
    align: "center",
    fontFace: "Microsoft YaHei",
  });
  slide.addText("THANK YOU", {
    x: 0,
    y: 4.2,
    w: 13.33,
    h: 0.8,
    fontSize: 20,
    color: COLORS.accentGold,
    align: "center",
    fontFace: "Microsoft YaHei",
  });

  const output =
    outputPath ||
    path.join(os.homedir(), "Desktop", "AI发展趋势报告_高端版.pptx");
  pptx.writeFile({ fileName: output }).then(() => {
    console.log(`✅ 大气高端版PPT已生成: ${output}`);
  });
  return output;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  createGrandPPT(args[0] || undefined);
}

export { createGrandPPT };
