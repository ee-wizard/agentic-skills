#!/usr/bin/env node
"use strict";
/**
 * P3TUS 论文汇报 PPT 生成脚本
 * "Efficient Table Union Search via LLM-Guided Semantic Embedding
 *  and Coarse-to-Fine Cascade"
 *
 * 聚焦：问题 + 方案
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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const generate_1 = require("./generate");
// ── 参数 ────────────────────────────────────────────
const paletteKey = process.argv[2] || 'midnight-aurora';
const lang = 'zh';
const outputPath = process.argv[3] || path.join(os.homedir(), 'Desktop', 'P3TUS-Slides.pptx');
// ── 大纲 ────────────────────────────────────────────
const outline = [
    { type: 'cover', title: '', subtitle: '' },
    { type: 'toc', title: '目录' },
    // ── 问题背景 ──
    { type: 'section-header', title: 'Part 1', subtitle: '问题背景与动机' },
    { type: 'content', title: '什么是 Table Union Search?' },
    { type: 'content', title: '现有方法的局限' },
    { type: 'content', title: '核心挑战' },
    // ── 方案 ──
    { type: 'section-header', title: 'Part 2', subtitle: 'P3TUS 方案' },
    { type: 'content', title: 'P3TUS 整体框架' },
    { type: 'two-column', title: '双视角语义嵌入' },
    { type: 'process-flow', title: '三阶段级联搜索' },
    { type: 'content', title: 'Stage 1: 候选精炼' },
    { type: 'content', title: 'Stage 2: 近似联合性过滤' },
    { type: 'content', title: 'Stage 3: 增强剪枝验证' },
    // ── 实验结果 ──
    { type: 'section-header', title: 'Part 3', subtitle: '实验评估' },
    { type: 'big-number', title: '核心实验数据' },
    { type: 'icon-grid', title: '三大优势' },
    { type: 'summary', title: '总结' },
    { type: 'end', title: '' },
];
// ── 内容数据 ────────────────────────────────────────
const contentData = {
    title: 'Efficient Table Union Search via\nLLM-Guided Semantic Embedding\nand Coarse-to-Fine Cascade',
    subtitle: 'P3TUS — 基于大模型引导语义嵌入与\n渐进式级联的高效表联合搜索',
    toc: [
        { title: '问题背景与动机' },
        { title: 'P3TUS 方案详解' },
        { title: '实验评估' },
        { title: '总结' },
    ],
    content1: [
        'Table Union Search (TUS)：从数据湖中找出与查询表 (Query Table) 列语义兼容的表，进行垂直拼接 (UNION)',
        '应用场景：数据增强、数据集集成、数据发现 — 数据湖包含数百万张异构表',
        '核心难点：表之间通常没有共享 Schema，列语义需要深度理解，而非仅靠词汇匹配',
        '    ▸ 例：查询表有列 "customer_name"、"purchase_date"、"amount"',
        '    ▸ 目标：找到含兼容列的表（如 "client_name"、"order_date"、"total_price"），以扩充行数',
    ],
    content2: [
        'Starmie (SOTA 基线)：基于列嵌入的匈牙利算法二分图匹配，精度高但计算量大',
        '    ▸ 每个候选表都需要完整运行匈牙利算法（O(min(m,n)³)）',
        '    ▸ 在数据湖规模下，数百万候选表导致延迟过高',
        '列级匹配忽略表级语义上下文 → 产生大量假阳性',
        '    ▸ 两表可能共享一个语义相似的列，但整体描述的实体关系完全不同',
        '    ▸ 例："price"列可能出现在"商品表"也可出现在"订单表"，但只有后者可合并',
        '纯语义方法（如 Gen-T、EasyTUS）牺牲精度换取效率，丢失排名保证',
    ],
    content3: [
        '语义完整性与搜索效率本质上是一对矛盾目标：',
        '    ① 表级语义需要 LLM 推理 + 嵌入 → 离线开销需通过查询分摊',
        '    ② 精确二分图匹配对所有候选表计算 → 数据湖规模下不可行',
        '核心洞察：需要一个"由粗到精"的级联策略 —',
        '    用粗粒度信号激进地剪枝候选空间，仅对幸存者施加细粒度精确匹配',
        'P3TUS 设计目标：在不牺牲召回率的前提下，将查询延迟降低一个数量级',
    ],
    content4: [
        'P3TUS = Progressive three-stage Pipeline for TUS',
        '三个核心创新：',
        '    ① 双视角语义表示 (Dual-View Embedding)：LLM 生成表级描述 + 确定性列统计特征',
        '    ② 压缩表示与近似联合性：列向量聚类 → 基于质心的快速近似评分 (Approx. Unionability)',
        '    ③ 增强分支定界剪枝 (Enhanced B&B)：双端优先队列 + 三重支配规则 → 减少匈牙利调用',
        '离线构建：每个表预计算嵌入 + 索引，查询时仅需 O(log n) 检索',
    ],
    leftColumn: [
        'LLM 生成表级语义描述 (离线)',
        '    • 结构化 Prompt：主题、列名+类型+采样值、行样本',
        '    • 4 个维度：行实体含义、Schema模式、属性族、联合伙伴',
        '    • 输出 JSON：一致性判断 + 解释 + 紧凑描述',
        '确定性列 Sketch (统计特征)',
        '    • 数值列：min, max, mean, variance, stddev',
        '    • 非数值列：distinct count, mode, cardinality',
        '    • 代表性值：去重 → 按频次排序 → 均匀采样',
    ],
    rightColumn: [
        '共享文本编码器 (Shared Encoder)',
        '    • 两种视图用同一个编码器嵌入到同一语义空间',
        '    • Last-token pooling + L2 normalization',
        '    • 表级向量 m_T(Q) 用于语义范围搜索',
        '    • 列向量用于精细匹配',
        '向量量化存储',
        '    • VQ (Vector Quantization)：K-Means 学习质心码本',
        '    • SQ (Scalar Quantization)：残差压缩为低比特整数',
        '    • 倒排索引 I_c (列质心→表) + I_p (表→聚类统计)',
    ],
    steps: [
        { step: '1', title: 'Refinement (候选精炼)', desc: '双通道检索：列级质心搜索 (HNSW) + 表级语义范围搜索 → 交集候选集' },
        { step: '2', title: 'Filtering (近似过滤)', desc: '基于压缩质心计算 Approx. Unionability 评分，保留 Top-M 高质量候选' },
        { step: '3', title: 'Verification (精确验证)', desc: 'Enhanced B&B Pruning + 匈牙利算法，仅对幸存候选执行精确匹配' },
    ],
    content5: [
        '输入：查询列向量集 V_Q',
        '通道一 — 列级质心搜索 (HNSW G_c)',
        '    • 每个查询列检索 n_p 个最近质心 → 通过倒排 I_c 聚合候选表',
        '    • 按亲和度评分排序，保留 Top-β 作为 R_c',
        '通道二 — 表级语义范围搜索 (HNSW G_m)',
        '    • 查询表向量 m_T(Q) 做范围搜索：cos(m_T(Q), m_T(D_i)) > τ_t',
        '    • 保留 R_m = 语义兼容的表',
        '最终候选集 R = R_c ∩ R_m',
        '    • 双通道交集确保：列级匹配 + 表级语义双重通过',
    ],
    content6: [
        '对每个幸存候选，利用其压缩质心表示 P_i 计算近似联合性：',
        '    • P_i = {p₁, ..., p_{n_p}}，每个质心 p_j 有容量 o_j 和半径 r_j',
        '    • 构建 m×n_p 相似度矩阵 S(v_q, p_j) = ⟨v_q, p_j⟩',
        '    • 容量约束线性分配：|σ⁻¹(p_j)| ≤ o_j',
        '公式：Ũ(V_Q, P_i, τ_c) = max_σ Σ 𝟙[⟨v, p_{σ(v)}⟩ ≥ τ_c] · ⟨v, p_{σ(v)}⟩',
        '含义：质心与查询列匹配好 → 其簇内所有列都是潜在匹配',
        '    • 容量约束防止一个质心过度匹配',
        '只有 Top-M 候选进入最终验证阶段 (M ≪ β ≪ N)',
    ],
    content7: [
        '创新：双端优先队列 P_lb (下界) + P_ub (上界)',
        '相比 Starmie 的固定大小缓冲区 → 更激进的支配剪枝',
        '三条剪枝规则：',
        '    ① UB < 缓冲区最弱下界 → 直接丢弃（省去匈牙利调用）',
        '    ② LB > 缓冲区所有上界 → 替换最弱项（无需验证）',
        '    ③ 否则 → 选出 UB 最高的候选做匈牙利验证 → 更新阈值',
        '复杂度：匈牙利 O(min(m,n)³) 仅对 Top-M 执行',
        '    • M=2k~5k，远小于数据湖规模 N',
    ],
    numbers: [
        { value: '6', label: '评测基准' },
        { value: '4-22%', label: 'Recall 提升' },
        { value: '10×', label: '延迟降低' },
    ],
    gridItems: [
        { icon: '🎯', label: '更高精度', desc: '双视角语义消除歧义，Recall 超 Starmie 4-22 个百分点' },
        { icon: '⚡', label: '数量级加速', desc: '级联架构大幅减少匈牙利调用，延迟降低 10 倍' },
        { icon: '🧠', label: 'LLM 赋能', desc: '离线策略：每个表仅需一次 LLM 推理，查询时零额外开销' },
    ],
    summary: [
        '问题：数据湖中表联合搜索 → 列级精确匹配开销过大，表级上下文缺失',
        '方案：P3TUS = 双视角语义嵌入 + 三阶段级联 (精炼→过滤→验证)',
        '关键创新：近似联合性评分 + 增强 B&B 剪枝 → 大幅降低匈牙利调用',
        '结果：6 个基准全面超越 SOTA，Recall +4-22%，延迟降低一个数量级',
    ],
};
// ── 生成 ────────────────────────────────────────────
const generator = new generate_1.PPTGenerator({
    title: 'P3TUS 论文汇报',
    palette: paletteKey,
    language: lang,
    layoutStrategy: 'auto',
});
generator.generateFromOutline(outline, contentData);
generator.save(outputPath).then(() => {
    console.log(`\n📋 调色板: ${generate_1.COLOR_PALETTES[paletteKey]?.name || paletteKey}`);
    console.log(`📄 页数: ${outline.length}`);
    console.log(`📁 输出: ${outputPath}`);
}).catch(console.error);
//# sourceMappingURL=generate_paper_p3tus.js.map