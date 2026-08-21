# 模见 · 大模型时代知识库

一个可以在本地运行、持续增长的中文大模型知识文档站。

当前知识库覆盖以下模块：

- 模型演进：Qwen 系列模型的演进；
- 基础规范：向量与矩阵记号；
- 模型架构：Decoder-only Transformer；
- Attention：GQA、QKV Bias、QK-Norm；
- 位置编码与长上下文：RoPE、Dual Chunk Attention；
- FFN 与稀疏架构：SwiGLU、MoE；
- 标准化与归一化：RMSNorm；
- 训练与对齐：Long-CoT Cold Start、Reasoning RL、RLHF、PPO、DPO、KTO、GRPO。

站点将模型架构、训练、Agent 与应用知识，通过演进时间线、概念卡片、关联 QA 和原始资料索引连接起来。

## 在本机打开

需要先安装 [Node.js 22](https://nodejs.org/)。项目提供 `.nvmrc`，使用 `nvm` 时可以执行 `nvm use` 切换版本。

```bash
npm ci
npm run dev
```

终端显示启动成功后，在浏览器打开：

```text
http://localhost:3000
```

停止服务时，在终端按 `Ctrl + C`。

## 从 GitHub 克隆后打开

```bash
git clone https://github.com/huang011028/model-atlas-knowledge-base.git
cd model-atlas-knowledge-base
npm ci
npm run dev
```

然后访问 [http://localhost:3000](http://localhost:3000)。

仓库不需要 API Key、数据库或 ChatGPT 账号才能阅读当前内容。

以后仓库有新文档时，在其他设备的项目目录执行：

```bash
git pull
npm ci
npm run dev
```

只有 `package-lock.json` 发生变化时才必须重新执行 `npm ci`；每次执行也能确保本机依赖与仓库锁定版本完全一致。

## 在同一局域网的其他设备打开

在运行项目的电脑上执行：

```bash
npm run dev:lan
```

查看该电脑的局域网 IP，然后在手机或另一台电脑上访问：

```text
http://<运行电脑的局域网 IP>:3000
```

例如 `http://192.168.1.20:3000`。两台设备必须在同一网络中，且系统防火墙需允许 Node.js 接收局域网连接。

## 构建与检查

```bash
npm run build
npm test
```

- `npm run build`：构建可部署版本。
- `npm test`：构建并检查核心文案、页面元数据与分享资源。

## 项目结构

```text
app/
  page.tsx                    # Qwen 系列模型演进主文档
  foundations/
    tensor-notation/          # 向量、矩阵与 Token 排布规范
  architecture/
    decoder-only/             # Decoder-only、因果掩码与自回归训练
  normalization/
    rmsnorm/                  # RMSNorm 文字与公式导读
  activations/
    swiglu/                   # SwiGLU、门控 FFN 与参数量推导
  attention/
    gqa/                      # GQA、MHA/MQA 对照与 KV Cache 推导
    qkv-bias/                 # QKV projection bias
    qk-norm/                  # QK-Norm 与 Attention Score
  position-encoding/
    rope/                     # RoPE 旋转位置编码
    dual-chunk-attention/     # Dual Chunk Attention 长上下文扩展
  ffn/
    moe/                      # MoE、Router、Expert 与并行通信
  training/
    long-cot-cold-start/      # Long-CoT 冷启动
    reasoning-rl/             # 大模型推理强化学习
    rlhf/                     # RLHF
    ppo/                      # PPO
    dpo/                      # DPO
    kto/                      # KTO
    grpo/                     # GRPO
  components/                # 公式、侧栏与 QA 索引等共享组件
  globals.css                # 三栏文档布局与响应式样式
  layout.tsx                 # 站点标题、描述与分享元数据
public/
  og.png                     # 社交分享封面
  favicon.png                # 浏览器图标
tests/
  rendered-html.test.mjs
```

## 继续添加知识文档

当前知识库采用“主文档 + 概念文档 + 双向链接”的架构。新内容可继续沿用以下组织方式：

1. 先给出一条可记忆的主线。
2. 分开架构、训练、后训练和产品能力。
3. 为每个结论补充官方资料或原始论文。
4. 用 QA 将本篇概念与其他模块连接。

## 技术说明

项目使用 React 19、vinext、Vite 与 KaTeX。`package-lock.json` 用于在不同设备安装一致依赖；`.openai/hosting.json` 仅用于可选的 Sites 部署，不影响从 GitHub 克隆后在本地运行。
