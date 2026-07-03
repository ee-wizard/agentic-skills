---
name: paper-peer-review
description: 'Rigorous scientific peer review of research documents. Use when: user asks to review a paper, manuscript, preprint, or research article; evaluate scientific quality; provide peer review feedback; assess academic writing.'
user-invocable: false
---

# 科学同行审稿 (Scientific Peer Review)

将此技能应用于审阅研究文档，系统地评估其科学质量和完整性。审阅结果以**中英文双语**输出，包含以下四个部分：**Summary (摘要)**、**Strengths (优势)**、**Weaknesses & Suggestions (不足与建议)**、**Conclusion (结论)**。

---

## 何时使用 (When to Use)

- 用户要求审阅论文、手稿、预印本或研究文章
- 需要评估研究文档的科学质量
- 用户请求同行评审反馈
- 需要评估学术写作质量

---

## 审阅分析框架 (Review Analysis Framework)

在撰写审稿意见前，使用以下结构化方法分析文档：

### 1. 文档分类 (Document Classification)

识别文档类型和范围：

| 类型 | Description |
|------|-------------|
| 研究文章 (Research Article) | 具有新发现的原创实证研究 |
| 综述论文 (Review Paper) | 现有文献的综合（叙述性、系统性、荟萃分析） |
| 方法论文 (Methodology Paper) | 新方法学、技术或协议开发 |
| 简短通讯/信件 (Short Communication) | 初步或特定发现的简短报告 |
| 技术报告 (Technical Report) | 程序、软件或数据的详细文档 |
| 评论/观点 (Commentary/Opinion) | 对现有工作的意见或解释 |
| 案例研究 (Case Study) | 具体示例或实例的详细检查 |

### 2. 论点分析 (Argument Analysis)

对文档中的每个主要论点：
- **识别论点**: 提取明确和隐含的主张
- **定位支持证据**: 将论点映射到特定数据、图形、表格或引用
- **评估证据质量**: 评估证据是否充分、适当和有说服力
- **标记未支持的论点**: 强调缺乏足够支持的断言
- **检查论点-证据对齐**: 验证结论是否从呈现的数据中得出

### 3. 逻辑和论证审阅 (Logic & Reasoning Review)

评估推理结构：
- **逻辑流程**: 评估论证是否从前提连贯地得出结论
- **方法论健全性**: 审阅实验设计、控制、样本大小
- **统计分析**: 检查统计方法的适当性和解释
- **替代解释**: 考虑作者是否处理竞争假设
- **过度泛化**: 识别超出数据支持的论点
- **内部一致性**: 寻找文档内的矛盾

### 4. 引用分析 (Citation Analysis)

审阅参考使用和完整性：
- **引用充分性**: 检查关键先前工作是否被承认
- **引用准确性**: 验证引用工作是否支持所述论点
- **缺失引用**: 识别文献覆盖的差距
- **引用平衡**: 评估参考文献是否代表多样化视角
- **自引用模式**: 注意过度自引用或引用偏见
- **时效性**: 评估是否包括最近相关作品

### 5. 方法论评估 (Methodology Assessment)

对实证研究，评估：
- **实验设计**: 控制、随机化、盲法（如果适当）
- **样本选择**: 代表性、大小、纳入/排除标准
- **数据收集**: 标准化、偏见最小化、质量控制
- **分析方法**: 分析方法的适当性
- **可重复性**: 足够细节用于复制
- **数据可用性**: 数据共享和可访问性的透明度

### 6. 技术准确性 (Technical Accuracy)

检查领域特定元素：
- **术语**: 技术术语和概念的正确使用
- **单位和计算**: 数值准确性的验证
- **图形质量**: 清晰度、标签和适当的可视化
- **表格构造**: 组织、完整性和统计报告
- **方法论细节**: 足够精度用于可重复性

---

## 审稿输出格式 (Review Output Format)

审稿意见必须以**中英文双语**输出。每个部分**先英文后中文**。包含以下四个核心部分：

### Output Template

```
## Summary / 摘要

**English:**
[1-2 paragraphs summarizing the document type, research contribution, main findings, and overall assessment — keep each paragraph to 2-3 sentences]

**中文：**
[1-2段，总结文档类型、研究贡献、主要发现和总体评价——每段控制在2-3句]

---

## Strengths / 优势

**English:**
[List 3-5 key strengths with specific examples from the document. **Each point must be 2-3 sentences max — concise and to the point.** Include: novelty of contribution, methodological rigor, clarity of presentation, quality of evidence, significance of findings.]

**中文：**
[列出3-5个关键优势，附文档中的具体示例。**每条意见控制在2-3句话，简洁有力。** 包括：贡献的新颖性、方法学严谨性、表达清晰度、证据质量、发现的重要性。]

---

## Weaknesses & Suggestions / 不足与建议

**English:**
[For each weakness (3-5 items):
- Combine the issue, reasoning, and suggestion into **2-3 sentences max per item**
- Be specific and actionable, but keep it tight]

**中文：**
[对每个不足（3-5项）：
- 将问题指出、原因分析和改进建议融合为**一条意见，不超过2-3句话**
- 具体且可操作，但务必精炼]

---

## Conclusion / 结论

**English:**
[Final recommendation: Accept / Minor Revision / Major Revision / Reject. 2-3 sentences summarizing the overall assessment and key decision rationale.]

**中文：**
[最终建议：接受 / 小修 / 大修 / 拒稿。2-3句话总结总体评价和关键决策理由。]
```

---

## 引用建议协议 (Citation Recommendation Protocol)

当建议额外引用时：
1. **提供具体理由**: 解释每个建议参考文献为什么相关
2. **包括关键细节**: 作者姓名、近似出版年份和主要贡献
3. **优先影响**: 聚焦高影响、最近或开创性作品
4. **避免过度引用**: 仅建议真正重要的缺失参考文献
5. **考虑多样性**: 包括来自不同研究组和视角的作品

---

## 审稿人语气指南 (Reviewer Tone Guidelines)

保持专业、建设性的反馈：
- **具体而非模糊**在批评中
- **在弱点旁边承认优势**
- **提供可操作的改进建议**
- **使用外交语言**同时直接处理问题
- **聚焦科学价值**而非个人观点
- **支持批评**与文本中的具体示例

---

## 质量保证检查 (Quality Assurance Checklist)

在输出最终审阅前，确认：
- [ ] 所有关于文档的论点是准确的
- [ ] 建议引用是相关和可访问的
- [ ] 批评是平衡的并认可了优势
- [ ] 所有主要问题被系统处理
- [ ] 评估的内部一致性
- [ ] 中英文双语版本内容对应一致
