# 🤖 Agentic Skills — GitHub Copilot Agent Customization Kit

> **一个可复用的 SKILL 仓库（SKILL Repo）**，为 GitHub Copilot 提供专业化的 Agent 能力和技能指令，提升 AI 编程助手的任务执行质量。

---

## 📦 技能清单

| 技能                       | 描述                                                                                    | 脚本语言   | 调用方式   |
| -------------------------- | --------------------------------------------------------------------------------------- | ---------- | ---------- |
| **🧠 Code Implementation** | 根据需求描述生成高质量代码实现。涵盖功能开发、接口实现、算法编写、数据处理等场景。      | —          | 自动匹配   |
| **📝 Paper Peer Review**   | 严格的科学同行审稿，对研究论文进行结构化评估，输出中英文双语审稿意见。                  | —          | 通过 Agent |
| **🎨 Garia Image**         | AI 图片生成助手，调用 Garia 绘图 API 批量生成教学图片、插画、示意图等。                 | TypeScript | 触发词     |
| **📊 PPT Generator**       | 智能 PPT 生成助手，根据主题自动生成结构清晰、视觉漂亮的演示文稿。                       | TypeScript | 触发词     |
| **✍️ Writing Humanizer**   | 去除 AI 写作痕迹，让文本更自然、更具人性化。基于 Wikipedia "Signs of AI writing" 指南。 | —          | 自动匹配   |

## 🤖 Agent 清单

| Agent                            | 描述                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| **🔬 论文评审 (Paper Reviewer)** | 编排 Agent，调用 Paper Peer Review 和 Writing Humanizer 两个 SKILL，完成中英文双语论文评审。 |

---

## 📁 仓库结构

```
├── agents/                    # Agent 定义
│   └── paper-reviewer.agent.md
├── skills/                    # SKILL 定义
│   ├── code-implementation-skill/
│   │   └── SKILL.md
│   ├── garia-image-skill/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       ├── .env.example
│   │       ├── package.json
│   │       ├── tsconfig.json
│   │       └── generate_garia.ts
│   ├── paper-peer-review-skill/
│   │   └── SKILL.md
│   ├── ppt-generator-skill/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   └── scripts/
│   │       ├── package.json
│   │       ├── tsconfig.json
│   │       ├── generate.ts
│   │       ├── generate_full.ts
│   │       ├── generate_grand.ts
│   │       ├── generate_mbe.ts
│   │       └── generate_ppt.ts
│   └── writing-humanizer/
│       └── SKILL.md
```

---

## 🚀 使用方法

### 作为 SKILL Repo 引用

在 VS Code 的 `.github/copilot-instructions.md` 或 Agent 配置中引用本仓库的 SKILL：

```markdown
参考仓库：https://github.com/ee-wizard/agentic-skills
```

或直接通过 GitHub Copilot 的 Agent 配置加载单个 SKILL 文件。

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/ee-wizard/agentic-skills.git
cd agentic-skills

# 安装各 SKILL 的依赖
# Garia Image
cd skills/garia-image-skill/scripts && npm install && cd ../../..

# PPT Generator
cd skills/ppt-generator-skill/scripts && npm install && cd ../../..
```

### 技术栈

- **语言**: TypeScript (Node.js)
- **PPT 生成**: [pptxgenjs](https://github.com/gitbrent/PptxGenJS)
- **HTTP 请求**: axios
- **配置管理**: dotenv + commander
- **运行方式**: 通过 `npx ts-node` 直接执行，或先 `npm run build` 再 `node dist/`

---

## 🧩 SKILL 开发指引

### 创建新 SKILL

1. 在 `skills/` 下创建新目录
2. 创建 `SKILL.md` 文件（必须），包含：
   - `---` YAML 前置元数据（name, description 等）
   - 详细的技能指令内容
3. （可选）添加 `scripts/` 目录存放辅助脚本（TypeScript）
4. （可选）在 `agents/` 下创建 Agent 编排文件

### SKILL 规范要点

- 每个 SKILL 以 `skills/<skill-name>/SKILL.md` 形式组织
- `SKILL.md` 必须包含 YAML 前置元数据
- `description` 用于触发匹配，建议包含明确的触发词或场景描述
- 脚本使用 TypeScript 编写，通过 `npx ts-node` 或编译后运行
- 每个脚本目录包含 `package.json` 和 `tsconfig.json`

---

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。
