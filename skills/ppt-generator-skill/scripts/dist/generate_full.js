#!/usr/bin/env node
"use strict";
/**
 * 内容丰满版 PPT 生成器 (TypeScript)
 * AI发展趋势报告
 * 原 Python 版本: generate_full.py
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
exports.createFullPPT = createFullPPT;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const pptxgenjs_1 = __importDefault(require("pptxgenjs"));
// 配色方案
const COLORS = {
    primary: "1E2761", // 深蓝
    secondary: "CADCFC", // 冰蓝
    accent: "58A6FF", // 亮蓝
    white: "FFFFFF",
    text: "323250",
    gray: "78788C",
};
function createFullPPT(outputPath) {
    const pptx = new pptxgenjs_1.default();
    pptx.layout = "LAYOUT_16x9";
    // ========== 第1页：封面 ==========
    let slide = pptx.addSlide();
    slide.background = { color: COLORS.primary };
    // 装饰圆形 - 右上角
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    // 装饰圆形 - 左下角
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("AI发展趋势报告", {
        x: 1,
        y: 2.5,
        w: 11,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: COLORS.white,
        align: "center",
        fontFace: "Microsoft YaHei",
    });
    slide.addText("2025-2026年行业深度洞察", {
        x: 1,
        y: 4.2,
        w: 11,
        h: 0.8,
        fontSize: 22,
        color: COLORS.secondary,
        align: "center",
        fontFace: "Microsoft YaHei",
    });
    slide.addText("基于 Gartner、IDC、艾瑞咨询等权威报告", {
        x: 1,
        y: 5.5,
        w: 11,
        h: 0.5,
        fontSize: 14,
        color: COLORS.secondary,
        align: "center",
        fontFace: "Microsoft YaHei",
    });
    // ========== 第2页：目录 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.white };
    // 装饰圆形
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("目录 CONTENTS", {
        x: 0.8,
        y: 0.4,
        w: 5,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: "Microsoft YaHei",
    });
    const tocItems = [
        {
            num: "01",
            title: "全球AI市场规模",
            desc: "2025年达4500亿美元，年增长20%",
        },
        {
            num: "02",
            title: "技术演进趋势",
            desc: "大模型多模态、端侧AI、AI Agent成为新风口",
        },
        {
            num: "03",
            title: "应用场景爆发",
            desc: "医疗、教育、制造、金融等领域全面渗透",
        },
        { num: "04", title: "行业案例分析", desc: "国内外头部企业AI布局详解" },
        { num: "05", title: "未来展望与建议", desc: "2026年趋势预测与行动建议" },
    ];
    tocItems.forEach((item, i) => {
        const y = 1.5 + i * 1.1;
        slide.addText(item.num, {
            x: 0.8,
            y,
            w: 0.8,
            h: 0.6,
            fontSize: 24,
            bold: true,
            color: COLORS.accent,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(item.title, {
            x: 1.8,
            y,
            w: 4,
            h: 0.5,
            fontSize: 18,
            bold: true,
            color: COLORS.text,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(item.desc, {
            x: 1.8,
            y: y + 0.4,
            w: 9,
            h: 0.5,
            fontSize: 12,
            color: COLORS.gray,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第3页：全球市场规模 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.white };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("全球AI市场规模", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: "Microsoft YaHei",
    });
    slide.addText("Global AI Market Size", {
        x: 0.8,
        y: 1,
        w: 6,
        h: 0.5,
        fontSize: 14,
        color: COLORS.gray,
        fontFace: "Microsoft YaHei",
    });
    const dataItems = [
        {
            value: "4500亿",
            unit: "美元",
            desc: "2025年全球AI市场总规模",
            color: COLORS.primary,
        },
        { value: "20%", unit: "CAGR", desc: "年复合增长率", color: COLORS.accent },
        {
            value: "67%",
            unit: "中国企业",
            desc: "已在业务中采用AI技术",
            color: COLORS.secondary,
        },
    ];
    dataItems.forEach((item, i) => {
        const x = 0.8 + i * 4.2;
        slide.addShape("roundRect", {
            x,
            y: 2,
            w: 3.8,
            h: 2.2,
            fill: { color: item.color },
            rectRadius: 0.1,
        });
        slide.addText(item.value, {
            x: x + 0.2,
            y: 2.3,
            w: 3.4,
            h: 0.9,
            fontSize: 36,
            bold: true,
            color: COLORS.white,
            align: "center",
            fontFace: "Microsoft YaHei",
        });
        slide.addText(item.unit, {
            x: x + 0.2,
            y: 3.1,
            w: 3.4,
            h: 0.5,
            fontSize: 16,
            color: COLORS.white,
            align: "center",
            fontFace: "Microsoft YaHei",
        });
        slide.addText(item.desc, {
            x: x + 0.2,
            y: 3.5,
            w: 3.4,
            h: 0.5,
            fontSize: 11,
            color: COLORS.secondary,
            align: "center",
            fontFace: "Microsoft YaHei",
        });
    });
    const details = [
        "• 生成式AI市场增长最为迅猛，预计2025年占比超30%",
        "• 中国AI市场增速领先全球，2025年规模预计达1500亿人民币",
        "• 企业级AI解决方案市场年增长率达35%，成为增长主力",
        "• AI芯片市场规模预计2025年突破1000亿美元",
    ];
    details.forEach((detail, i) => {
        slide.addText(detail, {
            x: 0.8,
            y: 4.5 + i * 0.55,
            w: 11,
            h: 0.5,
            fontSize: 13,
            color: COLORS.text,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第4页：技术演进趋势 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.white };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("技术演进趋势", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: "Microsoft YaHei",
    });
    slide.addText("Technology Evolution Trends", {
        x: 0.8,
        y: 1,
        w: 6,
        h: 0.5,
        fontSize: 14,
        color: COLORS.gray,
        fontFace: "Microsoft YaHei",
    });
    const techItems = [
        {
            color: COLORS.primary,
            title: "大模型多模态",
            desc: "GPT-5、Gemini 2.0等旗舰模型全面支持文本、图像、视频、音频多模态理解与生成，实现真正的跨模态智能。",
        },
        {
            color: COLORS.accent,
            title: "端侧AI加速普及",
            desc: "搭载NPU的智能手机、PC设备快速增长。到2026年，预计60%以上的新出货设备将具备本地AI处理能力。",
        },
        {
            color: COLORS.secondary,
            title: "AI Agent成为新风口",
            desc: 'AutoGPT、BabyAGI等Agent项目爆发式增长。AI从"工具"进化为"助手"，能够自主规划、执行复杂任务。',
        },
        {
            color: COLORS.gray,
            title: "开源生态崛起",
            desc: "Llama 3、Mistral等开源模型性能逼近GPT-4，推动AI技术民主化，降低企业应用门槛。",
        },
    ];
    techItems.forEach((item, i) => {
        const y = 1.8 + i * 1.3;
        slide.addShape("rect", {
            x: 0.8,
            y,
            w: 0.15,
            h: 1,
            fill: { color: item.color },
        });
        slide.addText(item.title, {
            x: 1.2,
            y,
            w: 4,
            h: 0.5,
            fontSize: 16,
            bold: true,
            color: COLORS.text,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(item.desc, {
            x: 1.2,
            y: y + 0.45,
            w: 11,
            h: 0.7,
            fontSize: 12,
            color: COLORS.gray,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第5页：应用场景爆发 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.white };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("应用场景爆发", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: "Microsoft YaHei",
    });
    slide.addText("Application Scenarios Explosion", {
        x: 0.8,
        y: 1,
        w: 6,
        h: 0.5,
        fontSize: 14,
        color: COLORS.gray,
        fontFace: "Microsoft YaHei",
    });
    const apps = [
        {
            color: COLORS.primary,
            title: "🏥 医疗健康",
            desc: "AI辅助诊断准确率达95%\n智能药物研发周期缩短60%\n2025年AI医疗市场达150亿美元",
        },
        {
            color: COLORS.accent,
            title: "📚 教育培训",
            desc: "个性化学习效率提升60%\nAI tutoring覆盖1亿+学生\n作业批改时间减少70%",
        },
        {
            color: COLORS.secondary,
            title: "🏭 智能制造",
            desc: "智能质检效率提升40%\n预测性维护降低停机30%\n数字孪生应用渗透率达45%",
        },
        {
            color: COLORS.gray,
            title: "💰 金融服务",
            desc: "智能风控坏账率降低30%\nAI客服替代率达80%\n智能投顾管理规模破万亿",
        },
    ];
    apps.forEach((app, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 0.8 + col * 6.2;
        const y = 1.6 + row * 2.7;
        slide.addShape("roundRect", {
            x,
            y,
            w: 5.8,
            h: 2.4,
            fill: { color: app.color },
            rectRadius: 0.1,
        });
        slide.addText(app.title, {
            x: x + 0.3,
            y: y + 0.3,
            w: 5,
            h: 0.6,
            fontSize: 18,
            bold: true,
            color: COLORS.white,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(app.desc, {
            x: x + 0.3,
            y: y + 1,
            w: 5.2,
            h: 1.2,
            fontSize: 12,
            color: COLORS.white,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第6页：行业案例分析 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.white };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("行业案例分析", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.primary,
        fontFace: "Microsoft YaHei",
    });
    slide.addText("Industry Case Studies", {
        x: 0.8,
        y: 1,
        w: 6,
        h: 0.5,
        fontSize: 14,
        color: COLORS.gray,
        fontFace: "Microsoft YaHei",
    });
    const cases = [
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
    cases.forEach((c, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 0.8 + col * 6.2;
        const y = 1.6 + row * 1.8;
        slide.addText(c.company, {
            x,
            y,
            w: 5,
            h: 0.5,
            fontSize: 16,
            bold: true,
            color: COLORS.primary,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(c.desc, {
            x,
            y: y + 0.5,
            w: 5.8,
            h: 1,
            fontSize: 12,
            color: COLORS.text,
            fontFace: "Microsoft YaHei",
        });
        if (col === 0) {
            slide.addShape("rect", {
                x: x + 5.9,
                y,
                w: 0.05,
                h: 1.5,
                fill: { color: COLORS.secondary },
            });
        }
    });
    // ========== 第7页：未来展望 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.primary };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("2026年趋势预测", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.white,
        fontFace: "Microsoft YaHei",
    });
    slide.addText("Future Outlook 2026", {
        x: 0.8,
        y: 1,
        w: 6,
        h: 0.5,
        fontSize: 14,
        color: COLORS.secondary,
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
        const y = 1.8 + i * 1;
        slide.addText(`0${i + 1}`, {
            x: 0.8,
            y,
            w: 0.6,
            h: 0.6,
            fontSize: 20,
            bold: true,
            color: COLORS.accent,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(text, {
            x: 1.6,
            y,
            w: 10,
            h: 0.6,
            fontSize: 18,
            color: COLORS.white,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第8页：总结 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.primary };
    slide.addShape("ellipse", {
        x: 10.5,
        y: -1,
        w: 4,
        h: 4,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addShape("ellipse", {
        x: -1,
        y: 5.5,
        w: 3,
        h: 3,
        fill: { color: COLORS.secondary, transparency: 70 },
    });
    slide.addText("总结与建议", {
        x: 0.8,
        y: 0.4,
        w: 6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: COLORS.white,
        fontFace: "Microsoft YaHei",
    });
    const suggestions = [
        { title: "立即行动", desc: "不要等待，先从小场景切入AI应用" },
        { title: "选对场景", desc: "优先选择ROI明确、痛点清晰的场景" },
        { title: "数据为王", desc: "高质量数据是AI落地成功的关键" },
        { title: "人才培养", desc: "组建AI团队或与专业机构合作" },
        { title: "持续迭代", desc: "AI技术演进快，保持学习和迭代" },
    ];
    suggestions.forEach((s, i) => {
        const y = 1.5 + i * 1.1;
        slide.addText(s.title, {
            x: 0.8,
            y,
            w: 2,
            h: 0.5,
            fontSize: 16,
            bold: true,
            color: COLORS.accent,
            fontFace: "Microsoft YaHei",
        });
        slide.addText(s.desc, {
            x: 2.8,
            y,
            w: 9,
            h: 0.5,
            fontSize: 15,
            color: COLORS.white,
            fontFace: "Microsoft YaHei",
        });
    });
    // ========== 第9页：结束页 ==========
    slide = pptx.addSlide();
    slide.background = { color: COLORS.primary };
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
        color: COLORS.secondary,
        align: "center",
        fontFace: "Microsoft YaHei",
    });
    slide.addText("关注我们，获取更多AI行业洞察", {
        x: 0,
        y: 5.5,
        w: 13.33,
        h: 0.5,
        fontSize: 14,
        color: COLORS.secondary,
        align: "center",
        fontFace: "Microsoft YaHei",
    });
    // 保存
    const output = outputPath ||
        path.join(os.homedir(), "Desktop", "AI发展趋势报告_丰满版.pptx");
    pptx.writeFile({ fileName: output }).then(() => {
        console.log(`✅ 内容丰满版PPT已生成: ${output}`);
    });
    return output;
}
// CLI 入口
if (require.main === module) {
    const args = process.argv.slice(2);
    const output = args[0] || undefined;
    createFullPPT(output);
}
//# sourceMappingURL=generate_full.js.map