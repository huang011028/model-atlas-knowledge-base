import type { Metadata } from "next";
import { Formula } from "./components/Formula";
import { RightQaIndex } from "./components/RightQaIndex";

export const metadata: Metadata = {
  title: "Qwen 系列模型的演进",
  description: "从 Qwen 到 Qwen3.6，理解两条架构主线与关键变化。",
};

const chapters = [
  ["01", "一张图看懂演进"],
  ["02", "Qwen → Qwen2.5"],
  ["03", "Qwen3 的两处改造"],
  ["04", "Qwen3-Next 的换代"],
  ["05", "Qwen3.5 / 3.6"],
  ["06", "关联 QA"],
];

const qaQuestions = [
  "Qwen2.5 比 Qwen2 强很多，为什么不算架构换代？",
  "GQA 到底节省了什么？",
  "Qwen3-Next 为什么不直接完全抛弃 Attention？",
  "Qwen3 的 Thinking / Non-thinking 是两个模型吗？",
  "研究 Qwen 架构，最值得抓住哪四个节点？",
  "Fine-grained、Shared、Routed Experts 分别解决什么问题？",
  "什么是 Pre-Norm？",
  "什么是输出分类矩阵？",
];

const generations = [
  { name: "Qwen", note: "建立基线", tone: "plain", href: undefined },
  { name: "1.5", note: "GQA · MoE", tone: "plain", href: undefined },
  { name: "2", note: "长上下文", tone: "plain", href: undefined },
  { name: "2.5", note: "训练跃迁", tone: "plain", href: undefined },
  { name: "3", note: "QK-Norm", tone: "plain", href: "/attention/qk-norm" },
  { name: "Next", note: "主干换代", tone: "accent", href: undefined },
  { name: "3.5", note: "原生多模态", tone: "accent", href: undefined },
  { name: "3.6", note: "Agent 强化", tone: "accent", href: undefined },
];

export default function Home() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="模见首页">
          <span className="brand-mark">模</span>
          <span>模见 <small>Model Atlas</small></span>
        </a>
        <nav className="topnav" aria-label="主导航">
          <a className="active" href="#article">知识库</a>
          <a href="#chapter-1">知识地图</a>
          <a href="#qa">QA 索引</a>
        </nav>
        <div className="top-actions">
          <a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a>
          <span className="edition">2026.08</span>
        </div>
      </header>

      <aside className="left-rail" aria-label="知识库目录">
        <p className="rail-kicker">知识库</p>
        <a className="rail-home" href="#top"><span>◇</span> 大模型时代</a>
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a><span className="rail-subhead">概率、采样与估计</span><a href="/foundations/importance-sampling">Importance Sampling</a></div>
        <div className="rail-group">
          <p>01 · 模型与架构</p>
          <a className="selected" href="#top">Qwen 系列演进</a>
          <a href="/architecture/decoder-only">Decoder-only Transformer</a>
          <a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a>
          <a className="locked" href="#">Llama 系列演进 <em>待更新</em></a>
        </div>
        <div className="rail-group">
          <p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span>
          <a href="/training/long-cot-cold-start">Long-CoT Cold Start</a>
          <a href="/training/reasoning-rl">Reasoning RL</a>
          <span className="rail-subhead">反馈与奖励</span>
          <a href="/training/reward-model">Reward Model</a>
          <span className="rail-subhead">RL 与偏好优化</span>
          <a href="/training/rlhf">RLHF</a>
          <a href="/training/ppo">PPO</a>
          <a href="/training/dpo">DPO</a>
          <a href="/training/kto">KTO</a>
          <a href="/training/grpo">GRPO</a>
          <span>Pre-training · 待更新</span>
        </div>
        <div className="rail-group">
          <p>03 · Agent 与应用</p>
          <a href="/agents/agent">Agent 基础</a>
          <a href="/agents/memory">Memory</a>
          <a href="/agents/tools">Tools</a>
        </div>
        <div className="rail-group">
          <p>04 · 标准化与归一化</p>
          <a href="/normalization/rmsnorm">RMSNorm</a>
        </div>
        <div className="rail-group">
          <p>05 · 激活函数与前馈网络</p>
          <a href="/activations/swiglu">SwiGLU</a>
          <a href="/ffn/moe">MoE</a>
        </div>
        <div className="rail-group">
          <p>06 · 注意力机制与 KV Cache</p>
          <a href="/attention/gqa">GQA</a>
          <a href="/attention/qkv-bias">QKV Bias</a>
          <a href="/attention/qk-norm">QK-Norm</a>
        </div>
        <div className="rail-group">
          <p>07 · 位置编码与上下文</p>
          <a href="/position-encoding/rope">RoPE</a>
          <a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a>
        </div>
      </aside>

      <main className="article" id="article">
        <section className="hero" id="top">
          <div className="breadcrumbs">知识库 <span>/</span> 模型与架构 <span>/</span> Qwen</div>
          <div className="eyebrow"><span></span> MODEL EVOLUTION · 01</div>
          <h1>Qwen 系列模型的演进</h1>
          <p className="dek">
            从标准 Decoder Transformer 的持续打磨，到 Hybrid Attention 重写序列建模主干。
            一条路线，看清 Qwen 如何从“更强的模型”走向“更高效的 Agent 基座”。
          </p>
          <div className="hero-meta">
            <span>更新于 2026.08.19</span><i></i><span>30 分钟阅读</span><i></i><span>官方资料校验</span>
          </div>
          <aside className="thesis">
            <span className="thesis-no">01</span>
            <div>
              <p>先记住这个结论</p>
              <strong>Qwen → Qwen3：优化标准 Transformer</strong>
              <strong>Qwen3-Next → 3.5 / 3.6：改变主干本身</strong>
            </div>
          </aside>
        </section>

        <section className="map-section" id="chapter-1">
          <div className="section-heading">
            <span className="section-no">01</span>
            <div><p>THE BIG PICTURE</p><h2>一张图看懂演进</h2></div>
          </div>
          <div className="era-labels">
            <span>阶段 A · 打磨标准 Transformer</span>
            <span>阶段 B · 重构序列建模</span>
          </div>
          <div className="timeline" aria-label="Qwen 版本演进时间线">
            {generations.map((item) => (
              <div className={`generation ${item.tone}`} key={item.name}>
                <span className="node"></span>
                <strong>{item.name}</strong>
                <small>{item.name === "1.5" ? <><a className="timeline-term" href="/attention/gqa">GQA</a> · <a className="timeline-term" href="/ffn/moe">MoE</a></> : item.href ? <a className="timeline-term" href={item.href}>{item.note}</a> : item.note}</small>
              </div>
            ))}
          </div>
          <div className="insight-grid">
            <article><span>ARCHITECTURE</span><strong>最大换代点</strong><p>Qwen3 → Qwen3-Next</p></article>
            <article><span>TRAINING</span><strong>能力跃迁点</strong><p>Qwen2 → Qwen2.5</p></article>
            <article><span>PRODUCT</span><strong>Agent 化转向</strong><p>Qwen3.5 → Qwen3.6</p></article>
          </div>
        </section>

        <section className="content-section" id="chapter-2">
          <div className="section-heading">
            <span className="section-no">02</span>
            <div><p>PHASE A · STANDARD TRANSFORMER</p><h2>Qwen → Qwen2.5：一条“做精”的路</h2></div>
          </div>
          <p className="lead">
            前四代没有推倒 <a className="term-link" href="/architecture/decoder-only">Decoder-only Transformer</a>。它们的核心问题是：
            在保留成熟主干的前提下，怎么让模型更稳、上下文更长、推理更便宜，也更懂中文。
          </p>

          <div className="version-stack">
            <article className="version-card">
              <div className="version-id"><span>2023</span><strong>Qwen</strong></div>
              <div className="version-copy">
                <h3>建立现代 Decoder 基线</h3>
                <p>采用 <b><a className="term-link" href="/normalization/rmsnorm">RMSNorm</a> + <a className="term-link" href="/position-encoding/rope">RoPE</a> + <a className="term-link" href="/activations/swiglu">SwiGLU</a></b> 的 Pre-Norm Decoder，保留 <a className="term-link" href="/attention/qkv-bias">Q/K/V projection bias</a>，输入 embedding 与输出 projection 不共享参数。它不是照搬 LLaMA，而是在稳定训练、位置表示、多语压缩率和模型容量之间做了一组工程选择。</p>
                <div className="version-explainer compact-explainer">
                  <div className="deep-note-grid three-notes">
                    <article><span>RESIDUAL PATH</span><b>Pre-Norm 保住残差主干</b><p>先归一化再进入 Attention/FFN，让深层网络的残差信号更直接；RMSNorm 则省去均值中心化。</p></article>
                    <article><span>TOKENIZER</span><b>约 152K 多语词表</b><p>在 cl100k 基础上补充中文和多语词元。更高压缩率意味着同一段文本通常需要更少 token。</p></article>
                    <article><span>TRADE-OFF</span><b>Untied Embedding</b><p>输入词向量与输出分类矩阵各自学习，换取更大表达自由度，但会增加参数与显存占用。</p></article>
                  </div>
                </div>
                <div className="tag-row"><a href="/architecture/decoder-only">Decoder-only</a><a href="/position-encoding/rope">RoPE</a><a href="/normalization/rmsnorm">RMSNorm ↗</a><a href="/attention/qkv-bias">QKV Bias</a></div>
              </div>
            </article>
            <article className="version-card">
              <div className="version-id"><span>2024.02</span><strong>Qwen1.5</strong></div>
              <div className="version-copy">
                <h3>开始试验“省 KV”和“稀疏专家”</h3>
                <p>Dense 主干变化不大，但 32B 等型号开始使用 <b><a className="term-link" href="/attention/gqa">GQA</a></b>，全系列把上下文窗口统一推进到 32K。更重要的架构实验发生在 <a className="term-link" href="/ffn/moe">Qwen1.5-MoE</a>：它开始系统探索“总参数可以很大，但每个 token 只计算其中一小部分”。</p>
                <div className="version-explainer moe-explainer">
                  <span className="explainer-kicker"><a href="/ffn/moe">MOE</a> DEEP DIVE · 细粒度到底是什么？</span>
                  <h4>不是复制很多个完整 FFN，而是先把一个大 FFN 切细</h4>
                  <p>传统 <a className="term-link" href="/ffn/moe">MoE</a> 常把完整 FFN 复制成若干个“大专家”。细粒度 <a className="term-link" href="/ffn/moe">MoE</a> 沿 FFN 的中间维度把它拆成更小的片段：在总专家参数和每 token 激活参数相近时，小专家数量更多，Router 因而能组合出更丰富的计算路径。</p>
                  <div className="expert-granularity" aria-label="普通专家与细粒度专家的对比">
                    <div><span>粗粒度</span><b>8 个大 Experts</b><small>组合选择较少</small></div>
                    <i>→</i>
                    <div className="accent-granularity"><span><a href="/ffn/moe">Qwen1.5-MoE</a></span><b>64 个小 Experts</b><small>同等预算下组合更丰富</small></div>
                  </div>
                  <Formula
                    className="compact-latex moe-route-latex"
                    label={<>一个 token 的 <a className="term-link" href="/ffn/moe">MoE</a> 输出（概念式）</>}
                    tex={String.raw`y=\sum_{i=1}^{4}E_i^{\mathrm{shared}}(x)+\sum_{j\in\operatorname{Top4}(r(x))}p_jE_j^{\mathrm{routed}}(x)`}
                  />
                  <div className="deep-note-grid">
                    <article><span>4 SHARED</span><b>每个 token 都经过</b><p>Shared Experts 不参与竞争性路由，可以把它们理解为承接跨领域、跨 token 都常用的基础变换。</p></article>
                    <article><span>60 ROUTED · TOP-4</span><b>由 Router 按 token 选择</b><p>Routed Experts 只处理被分配到的 token，更有机会形成面向不同模式或领域的专门化。</p></article>
                  </div>
                  <p className="evidence-copy"><a className="term-link" href="/ffn/moe">Qwen1.5-MoE-A2.7B</a> 共 64 个专家：4 个 Shared Experts 始终激活，再从 60 个 Routed Experts 中选 4 个。官方还从 Qwen-1.8B 权重进行 upcycling，并在初始化中加入随机性，帮助专家更快分化。</p>
                </div>
                <div className="tag-row"><a href="/attention/gqa">GQA 探索</a><a href="/ffn/moe">Fine-grained MoE</a><span>Shared Experts</span></div>
              </div>
            </article>
            <article className="version-card">
              <div className="version-id"><span>2024.06</span><strong>Qwen2</strong></div>
              <div className="version-copy">
                <h3><a className="term-link" href="/attention/gqa">GQA</a> 主线化，长上下文成为工程目标</h3>
                <p>Qwen2 把 GQA 普及到 Dense 系列：更多 Q heads 共享较少的 K/V heads，直接减少 KV Cache。与此同时，长上下文不再只靠“把位置编号放大”，而是把训练长度、位置外推和跨块注意力一起设计。</p>
                <div className="version-explainer compact-explainer">
                  <div className="deep-note-grid three-notes">
                    <article><span>GQA · KV CACHE</span><b>先减少每个 token 的 KV 状态</b><p>例如 7B 使用 28 个 Q heads、4 个 KV heads；72B 使用 64 个 Q heads、8 个 KV heads。不同型号共享比例不同。</p></article>
                    <article><span><a className="term-link" href="/position-encoding/dual-chunk-attention">DCA</a> · POSITION</span><b>区分块内与跨块位置</b><p><a className="term-link" href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a> 将长序列分块，在超过训练长度时仍尽量保留可学习的相对位置信息。</p></article>
                    <article><span>YARN · EXTRAPOLATION</span><b>重新标定长距离尺度</b><p>YaRN 配合 <a className="term-link" href="/position-encoding/rope">RoPE</a> 扩展推理长度；它解决位置外推，GQA 解决缓存，二者不是同一件事。</p></article>
                  </div>
                  <aside className="inline-fact"><b><a href="/ffn/moe">MoE</a> 路线也继续推进</b><p>Qwen2-57B-A14B 使用 64 个 Routed Experts（激活 8 个）和 8 个 Shared Experts；“57B”是总参数，“A14B”才接近每个 token 实际激活的参数规模。</p></aside>
                </div>
                <div className="tag-row"><a href="/attention/gqa">GQA</a><span>KV Cache ↓</span><span>Long Context</span></div>
              </div>
            </article>
            <article className="version-card focus-card">
              <div className="version-id"><span>2024.09</span><strong>Qwen2.5</strong></div>
              <div className="version-copy">
                <h3>架构几乎没换，能力却大幅上升</h3>
                <p>Qwen2.5 Dense 仍沿用 GQA、<a className="term-link" href="/position-encoding/rope">RoPE</a>、SwiGLU、RMSNorm 与 <a className="term-link" href="/attention/qkv-bias">QKV bias</a>，最显著的升级发生在训练系统：预训练规模从 Qwen2 的 7T 扩展到最高 <b>18T tokens</b>，同时提高代码、数学、结构化数据与合成数据的质量和占比。</p>
                <Formula
                  className="compact-latex soft-latex"
                  tex={String.raw`\mathrm{Capability}\;\approx\;\mathrm{Architecture}+\mathrm{Data}+\mathrm{Training}+\mathrm{Post\!\!-\!\!training}`}
                />
                <div className="training-chain" aria-label="Qwen2.5 能力提升链路">
                  <div><span>01</span><b>7T → 18T</b><small>规模与质量一起提升</small></div><i>→</i>
                  <div><span>02</span><b>Code / Math / JSON</b><small>加强高价值数据分布</small></div><i>→</i>
                  <div><span>03</span><b>Alignment</b><small>指令、偏好与结构化输出</small></div>
                </div>
                <p className="evidence-copy">因此，Qwen2.5 的案例不能简化成“多喂数据”。关键是数据筛选与配比、专项模型产生的合成数据、长文本训练以及后训练共同作用。架构给出能力上限的形状，训练决定模型能否真正逼近它。</p>
              </div>
            </article>
          </div>
        </section>

        <section className="content-section dark-section" id="chapter-3">
          <div className="section-heading inverse">
            <span className="section-no">03</span>
            <div><p>QWEN3 · MODERN TRANSFORMER</p><h2>主干没换，Attention 与 <a className="term-link" href="/ffn/moe">MoE</a> 都动了刀</h2></div>
          </div>
          <p className="lead">
            Qwen3 仍是 <a className="term-link" href="/architecture/decoder-only">Decoder-only Transformer</a>，但它把注意力的数值稳定性、<a className="term-link" href="/ffn/moe">MoE</a> 路由和后训练统一改造了。预训练数据扩大到约 36T tokens，并覆盖 119 种语言和方言；“Thinking / Non-thinking 合一”则主要来自后训练，而不是新增一条神经网络主干。
          </p>
          <div className="split-explainer">
            <article>
              <span className="big-index">A</span>
              <h3>Attention：去 <a className="term-link" href="/attention/qkv-bias">QKV Bias</a> + <a className="term-link" href="/attention/qk-norm">QK-Norm</a></h3>
              <Formula
                className="compact-latex qk-norm-latex"
                tex={String.raw`\begin{gathered}
                  Q=XW_Q \\[0.18em]
                  K=XW_K \\[0.18em]
                  \widehat Q=\operatorname{RMSNorm}(Q) \\[0.18em]
                  \widehat K=\operatorname{RMSNorm}(K) \\[0.18em]
                  S=\dfrac{\widehat Q\widehat K^{\mathsf T}}{\sqrt{d_h}} \\[0.18em]
                  \operatorname{Attn}(Q,K,V)=\operatorname{softmax}(S)V
                \end{gathered}`}
              />
              <p>不再使用 <a className="term-link" href="/attention/qkv-bias">QKV bias</a>，并在计算 attention score 前分别归一化 Q、K。这样做直接约束进入点积的向量尺度，降低 attention logits 随训练放大的风险；它稳定的是数值尺度，不会替代 softmax，也不会改变 GQA 的 head 共享关系。</p>
            </article>
            <article>
              <span className="big-index">B</span>
              <h3><a className="term-link" href="/ffn/moe">MoE</a>：128 个 Routed Experts</h3>
              <div className="expert-dots" aria-label="128 experts 中每个 token 选择 8 个">
                {Array.from({ length: 32 }).map((_, index) => <i className={index % 4 === 0 ? "hot" : ""} key={index}></i>)}
              </div>
              <p>代表性 <a className="term-link" href="/ffn/moe">MoE</a> 型号使用 128 个细粒度 Routed Experts，每个 token 选择 8 个；取消早期路线中的 Shared Expert，并在全局 batch 范围计算负载均衡损失，避免少数专家长期过载，同时给专家专门化留下空间。</p>
            </article>
          </div>
          <aside className="distinction">
            <span>需要区分</span>
            <p><b>Thinking / Non-thinking</b> 是同一套参数经过后训练学会的两种生成行为，而不是额外加了一套“推理网络”。</p>
          </aside>
          <div className="posttrain-depth">
            <div><span>01</span><b><a className="term-link" href="/training/long-cot-cold-start">Long-CoT Cold Start</a></b><p>先用高质量长推理轨迹建立可读、可延续的推理行为。</p></div>
            <i>→</i>
            <div><span>02</span><b><a className="term-link" href="/training/reasoning-rl">Reasoning RL</a></b><p>在数学、代码等可验证任务上继续强化推理能力。</p></div>
            <i>→</i>
            <div><span>03</span><b>Thinking Fusion</b><p>混合带推理与不带推理的数据，让同一模型支持两种模式。</p></div>
            <i>→</i>
            <div><span>04</span><b>General RL</b><p>补齐指令遵循、偏好和通用交互质量。</p></div>
          </div>
          <p className="dark-depth-copy">所以 Qwen3 的升级要分成两条线看：<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 与 <a className="term-link" href="/ffn/moe">MoE</a> 是层结构变化；Thinking Budget、模式切换和推理能力主要是训练与推理控制变化。把二者混在一起，就容易把“行为创新”误说成“架构创新”。</p>
        </section>

        <section className="content-section" id="chapter-4">
          <div className="section-heading">
            <span className="section-no">04</span>
            <div><p>PHASE B · ARCHITECTURE SHIFT</p><h2>Qwen3-Next：真正的主干换代</h2></div>
          </div>
          <p className="lead">
            这次不再只问“怎么让传统 Attention 更省”，而是问：
            <b>每一层真的都需要保存并回看完整 K/V 吗？</b>
          </p>
          <div className="architecture-compare">
            <article>
              <p className="mini-label">传统路线 · QWEN3</p>
              <div className="layer-stack classic">
                <span>Gated Attention</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated Attention</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated Attention</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated Attention</span><em><a href="/ffn/moe">MoE</a></em>
              </div>
              <small>每层依赖传统 Attention</small>
            </article>
            <div className="shift-arrow"><span>架构<br/>换代</span>→</div>
            <article>
              <p className="mini-label accent-text">混合路线 · QWEN3-NEXT</p>
              <div className="layer-stack hybrid">
                <span>Gated DeltaNet</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated DeltaNet</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated DeltaNet</span><em><a href="/ffn/moe">MoE</a></em>
                <span>Gated Attention</span><em><a href="/ffn/moe">MoE</a></em>
              </div>
              <small>3 : 1 Hybrid 循环</small>
            </article>
          </div>
          <div className="concept-grid">
            <article><b>01</b><h3>Gated DeltaNet</h3><p>将历史压缩进持续更新的 state，在长序列上接近线性处理。</p></article>
            <article><b>02</b><h3>Gated Attention</h3><p>周期性保留全注意力，用于精确访问某个历史 token。</p></article>
            <article><b>03</b><h3>Ultra-sparse <a className="term-link" href="/ffn/moe">MoE</a></h3><p>512 experts，典型配置每 token 激活 10 routed + 1 shared。</p></article>
            <article><b>04</b><h3>MTP</h3><p>多 token 预测扩展训练目标，也为推测加速提供可利用的结构。</p></article>
          </div>
          <div className="state-depth">
            <div>
              <span>STATE UPDATE · 概念式</span>
              <Formula className="compact-latex state-latex" tex={String.raw`S_t=f_\theta(S_{t-1},x_t),\qquad y_t=g_\theta(S_t,q_t)`} />
            </div>
            <p>标准全注意力保留随序列长度增长的 K/V 历史；状态更新层把过去递推进固定形状的状态 <Formula inline tex={String.raw`S_t`} />。这样能降低长序列的缓存与计算增长，但压缩也可能丢失某些精确细节，所以 Qwen3-Next 每 3 个 Gated DeltaNet 层插入 1 个 Gated Attention 层，周期性恢复对具体历史位置的直接访问。</p>
          </div>
          <aside className="inline-fact next-fact"><b>Ultra-sparse <a href="/ffn/moe">MoE</a> 的含义</b><p>典型配置有 512 个 Routed Experts，每个 token 选择 10 个，再加 1 个 Shared Expert。总参数决定模型可容纳多少专家知识，激活参数更接近单 token 的主要 FFN 计算量；两者不能混为同一个“模型大小”。</p></aside>
          <blockquote>
            Qwen1 到 Qwen3 主要在回答“如何优化 Transformer”；Qwen3-Next 开始回答“是否还要在每层使用完整 Attention”。
          </blockquote>
        </section>

        <section className="content-section" id="chapter-5">
          <div className="section-heading">
            <span className="section-no">05</span>
            <div><p>FROM MODEL TO AGENT FOUNDATION</p><h2>Qwen3.5 / 3.6：架构主线化，能力 Agent 化</h2></div>
          </div>
          <div className="continuation-line">
            <div><span>Qwen3-Next</span><small>验证混合主干</small></div>
            <i>→</i>
            <div><span>Qwen3.5</span><small>混合主干 + 原生多模态</small></div>
            <i>→</i>
            <div><span>Qwen3.6</span><small>稳定性 + Agentic Coding</small></div>
          </div>
          <div className="two-up">
            <article>
              <p className="mini-label">QWEN3.5</p>
              <h3>把 Next 的混合架构变成新主线</h3>
              <p>继承 3:1 的 Gated DeltaNet + Gated Attention 混合堆叠，同时将文本、图像与视频 token 放进统一基座中训练。这里的“原生多模态”强调的不是在成熟语言模型外接一个视觉插件，而是从训练阶段就让不同模态进入共同的表示与推理过程。</p>
              <p className="card-depth-copy">混合主干降低长文本和大量视觉 token 全部经过二次复杂度 Attention 的成本；周期性的全注意力层继续承担跨位置精确交互。Dense / <a className="term-link" href="/ffn/moe">MoE</a> 只描述 FFN 是全量计算还是稀疏路由，不是判断 Qwen3.5 主干的核心标签。</p>
              <div className="modality-row"><span>TEXT</span><span>IMAGE</span><span>VIDEO</span><b>→ UNIFIED</b></div>
            </article>
            <article>
              <p className="mini-label">QWEN3.6</p>
              <h3>重点不是新 Attention，而是真实任务稳定性</h3>
              <p>这一代沿用 Qwen3.5 的混合架构家族，升级重心放到代码 Agent、仓库级理解、响应稳定性与 <b>Thinking Preservation</b>。因此判断它是否“换代”，不能只看榜单，而要看 layer 类型、状态更新方式和 <a className="term-link" href="/ffn/moe">MoE</a> 结构是否改变。</p>
              <p className="card-depth-copy">Thinking Preservation 的产品含义是：在多轮、长任务或工具调用后，尽量保持前序推理形成的目标、约束和中间状态，减少重新推理、目标漂移与上下文断裂。它主要依赖后训练和交互协议，不等同于把完整思维链永久写入 KV Cache。</p>
              <div className="thought-chain"><span>Turn 1<br/><small>reasoning</small></span><i>→</i><span>Turn 2<br/><small>preserved</small></span><i>→</i><span>Long task<br/><small>coherent</small></span></div>
            </article>
          </div>
          <aside className="evidence-note">
            <b>证据边界</b>
            <p>“Qwen3.6 是架构延续而非新主干换代”是基于官方“建立在 Qwen3.5 基础上”的表述与公开型号信息做出的归纳，不是官方的逐字结论。</p>
          </aside>
        </section>

        <section className="content-section takeaway-section">
          <div className="section-heading">
            <span className="section-no">∞</span>
            <div><p>CONNECTED KNOWLEDGE</p><h2>把这篇文章连到更大的知识图谱</h2></div>
          </div>
          <div className="knowledge-paths">
            <a href="/attention/gqa"><span>推理工程</span><b>GQA 为什么能减少 KV Cache？</b><i>↗</i></a>
            <a href="/ffn/moe"><span>稀疏模型</span><b>MoE 总参数与激活参数有何不同？</b><i>↗</i></a>
            <a href="#qa"><span>长上下文</span><b>DeltaNet 怎么在不保存完整 KV 时记住历史？</b><i>↗</i></a>
            <a href="#qa"><span>后训练</span><b>Thinking 模式为什么不等于新架构？</b><i>↗</i></a>
          </div>
        </section>

        <section className="content-section qa-section" id="qa">
          <div className="section-heading">
            <span className="section-no">06</span>
            <div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA：用问题把知识串起来</h2></div>
          </div>
          <div className="qa-list">
            <details id="qa-1" open>
              <summary><span>Q1</span>Qwen2.5 比 Qwen2 强很多，为什么不算架构换代？</summary>
              <div><p>因为主干仍是相近的 <a className="term-link" href="/architecture/decoder-only">Decoder-only Transformer</a>，关键组件仍是 <a className="term-link" href="/attention/gqa">GQA</a>、<a className="term-link" href="/position-encoding/rope">RoPE</a>、<a className="term-link" href="/activations/swiglu">SwiGLU</a> 与 RMSNorm。明显的能力跃迁主要来自 18T token 级预训练、更高质量数据和更强后训练。</p><a href="#chapter-2">回到 Qwen2.5 ↑</a></div>
            </details>
            <details id="qa-2">
              <summary><span>Q2</span><span className="qa-question"><a className="term-link" href="/attention/gqa">GQA</a> 到底节省了什么？</span></summary>
              <div><p>它让多个 Query heads 共享少量 Key / Value heads。推理时需要缓存的 K/V 头变少，因此能显著降低 KV Cache 内存，同时尽量保留多头表达能力。</p><a href="#chapter-2">回到 Qwen2 ↑</a></div>
            </details>
            <details id="qa-3">
              <summary><span>Q3</span>Qwen3-Next 为什么不直接完全抛弃 Attention？</summary>
              <div><p>状态更新类方法长于高效压缩过去，但对某个历史位置做精确随机访问仍是全注意力的优势。3:1 混合结构本质上是在吞吐量与精确回忆之间取平衡。</p><a href="#chapter-4">回到 Qwen3-Next ↑</a></div>
            </details>
            <details id="qa-4">
              <summary><span>Q4</span>Qwen3 的 Thinking / Non-thinking 是两个模型吗？</summary>
              <div><p>不是。它们是同一个模型通过后训练掌握的不同生成行为。这是能力与行为层的创新，不能和 layer 级别的架构变化混为一谈。</p><a href="#chapter-3">回到 Qwen3 ↑</a></div>
            </details>
            <details id="qa-5">
              <summary><span>Q5</span>研究 Qwen 架构，最值得抓住哪四个节点？</summary>
              <div><p>Qwen 用来理解现代 Decoder baseline；Qwen2 用来理解 <a className="term-link" href="/attention/gqa">GQA</a> 与长上下文工程；Qwen3 用来理解 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 与 Sparse <a className="term-link" href="/ffn/moe">MoE</a>；Qwen3-Next / 3.5 用来理解 Hybrid Attention 与 state-update 路线。</p></div>
            </details>
            <details id="qa-6">
              <summary><span>Q6</span>Fine-grained、Shared、Routed Experts 分别解决什么问题？</summary>
              <div><p>Fine-grained 描述专家的粒度：把大 FFN 切成更多小专家，增加可组合路径。Shared 描述必经路径：每个 token 都会调用，承接通用变换。Routed 描述条件路径：Router 只为当前 token 选择其中少数专家，提供稀疏计算与专门化。三者分别回答“专家多细”“是否必经”“如何选择”，不是三个并列的模型类型。</p><a href="#chapter-2">回到 Qwen1.5 ↑</a></div>
            </details>
            <details id="qa-7">
              <summary><span>Q7</span>什么是 Pre-Norm？</summary>
              <div>
                <p>Pre-Norm 是把归一化放在 Attention 或 FFN <b>之前</b>：先对当前隐藏状态做 Norm，再把子层结果加回未经归一化的残差主干。Qwen 使用的是 <a className="term-link" href="/normalization/rmsnorm">RMSNorm</a> 形式的 Pre-Norm。</p>
                <Formula
                  className="compact-latex qa-latex"
                  tex={String.raw`\begin{aligned}\mathrm{Pre\!\!-\!\!Norm:}\quad &x_{\ell+1}=x_\ell+F\!\left(\operatorname{Norm}(x_\ell)\right)\\[0.35em]\mathrm{Post\!\!-\!\!Norm:}\quad &x_{\ell+1}=\operatorname{Norm}\!\left(x_\ell+F(x_\ell)\right)\end{aligned}`}
                />
                <p>关键差别是 Pre-Norm 的残差路径中始终保留一条接近恒等映射的通道，梯度可以更直接地跨层传播，因此通常更适合训练很深的 Decoder。它并不是“整个模型开头只归一化一次”：Attention 分支和 FFN 分支通常各自都有一次位于子层之前的 Norm。</p>
                <a href="#chapter-2">回到 Qwen 基线 ↑</a>
              </div>
            </details>
            <details id="qa-8">
              <summary><span>Q8</span>什么是输出分类矩阵？</summary>
              <div>
                <p>输出分类矩阵也常叫 <b>Output Projection</b> 或 <b>LM Head</b>。它把最后一个 Transformer 隐藏状态 <Formula inline tex={String.raw`h_t\in\mathbb{R}^{d}`} /> 从模型维度投影到词表维度，为词表中的每个候选 token 产生一个 logit；这里“分类”的类别不是情感或主题，而是“下一个 token 是词表中的哪一项”。</p>
                <Formula
                  className="compact-latex qa-latex"
                  tex={String.raw`W_{\mathrm{out}}\in\mathbb{R}^{V\times d},\qquad z_t=W_{\mathrm{out}}h_t+b_{\mathrm{out}},\qquad p(x_{t+1}\mid x_{\le t})=\operatorname{softmax}(z_t)`}
                />
                <p>矩阵的每一行都对应一个词表 token。该行与 <Formula inline tex={String.raw`h_t`} /> 的点积越大，这个 token 的 logit 就越高。输入 Embedding 做的是相反方向的映射：把 token ID 变成隐藏向量。若两者共享权重，可写成 <Formula inline tex={String.raw`W_{\mathrm{out}}=E`} />；若不共享，它们分别学习。初代 Qwen 选择不共享，以更多参数和显存换取输入表示与输出打分各自优化的自由度。实际模型也可能省略上式中的输出 bias。</p>
                <a href="#chapter-2">回到 Qwen 基线 ↑</a>
              </div>
            </details>
          </div>
        </section>

        <section className="sources-section">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>官方资料与核心文献</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
            <li><a href="https://qwenlm.github.io/blog/qwen1.5/" target="_blank" rel="noreferrer">Introducing Qwen1.5</a><span>2024</span></li>
            <li><a href="https://qwenlm.github.io/blog/qwen-moe/" target="_blank" rel="noreferrer">Matching 7B Model Performance with 1/3 Activated Parameters</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2407.10671" target="_blank" rel="noreferrer">Qwen2 Technical Report</a><span>2024</span></li>
            <li><a href="https://qwenlm.github.io/blog/qwen2.5-llm/" target="_blank" rel="noreferrer">Qwen2.5-LLM: Extending the boundary of LLMs</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2505.09388" target="_blank" rel="noreferrer">Qwen3 Technical Report</a><span>2025</span></li>
            <li><a href="https://qwen.ai/blog?from=research.latest-advancements-list&id=4074cca80393150c248e508aa62983f9cb7d27cd" target="_blank" rel="noreferrer">Qwen3-Next: Towards Ultimate Training & Inference Efficiency</a><span>2025</span></li>
            <li><a href="https://qwen.ai/blog?id=qwen3.5" target="_blank" rel="noreferrer">Qwen3.5: Towards Native Multimodal Agents</a><span>2026</span></li>
            <li><a href="https://github.com/QwenLM/Qwen3.6" target="_blank" rel="noreferrer">Qwen3.6 Official Repository</a><span>2026</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>下一篇 · 建议阅读</span><strong><a className="term-link" href="/attention/gqa">GQA</a> 与 Gated DeltaNet：从 KV Cache 到状态更新</strong></div>
          <a href="#top">回到顶部 ↑</a>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label], index) => (
          <a className={index === 0 ? "current" : ""} href={index === 5 ? "#qa" : `#chapter-${index + 1}`} key={no}>
            <span>{no}</span>{label}
          </a>
        ))}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>6 章</span><div><i></i></div><small>约 30 分钟阅读</small></div>
      </aside>
    </div>
  );
}
