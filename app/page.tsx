import type { Metadata } from "next";

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

const generations = [
  { name: "Qwen", note: "建立基线", tone: "plain" },
  { name: "1.5", note: "GQA · MoE", tone: "plain" },
  { name: "2", note: "长上下文", tone: "plain" },
  { name: "2.5", note: "训练跃迁", tone: "plain" },
  { name: "3", note: "QK-Norm", tone: "plain" },
  { name: "Next", note: "主干换代", tone: "accent" },
  { name: "3.5", note: "原生多模态", tone: "accent" },
  { name: "3.6", note: "Agent 强化", tone: "accent" },
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
        <div className="rail-group">
          <p>01 · 模型与架构</p>
          <a className="selected" href="#top">Qwen 系列演进</a>
          <a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a>
          <a className="locked" href="#">Llama 系列演进 <em>待更新</em></a>
        </div>
        <div className="rail-group muted">
          <p>02 · 训练与对齐</p>
          <span>Pre-training</span>
          <span>Post-training</span>
        </div>
        <div className="rail-group muted">
          <p>03 · Agent 与应用</p>
          <span>Memory</span>
          <span>Tool Use</span>
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
            <span>更新于 2026.08.19</span><i></i><span>18 分钟阅读</span><i></i><span>官方资料校验</span>
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
                <small>{item.note}</small>
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
            前四代没有推倒 Decoder-only Transformer。它们的核心问题是：
            在保留成熟主干的前提下，怎么让模型更稳、上下文更长、推理更便宜，也更懂中文。
          </p>

          <div className="version-stack">
            <article className="version-card">
              <div className="version-id"><span>2023</span><strong>Qwen</strong></div>
              <div className="version-copy">
                <h3>建立现代 Decoder 基线</h3>
                <p>采用 <b>RMSNorm + RoPE + SwiGLU</b>，保留 Q/K/V projection bias，输入 embedding 与输出 projection 不共享参数。中英多语 tokenizer 是产品侧的重要起点。</p>
                <div className="tag-row"><span>Decoder-only</span><span>RoPE</span><span>RMSNorm</span><span>QKV Bias</span></div>
              </div>
            </article>
            <article className="version-card">
              <div className="version-id"><span>2024.02</span><strong>Qwen1.5</strong></div>
              <div className="version-copy">
                <h3>开始试验“省 KV”和“稀疏专家”</h3>
                <p>Dense 主干变化不大，但 32B 等型号开始使用 <b>GQA</b>。Qwen1.5-MoE 则引入细粒度 experts，并区分 shared 与 routed experts。</p>
                <div className="tag-row"><span>GQA 探索</span><span>Fine-grained MoE</span><span>Shared Experts</span></div>
              </div>
            </article>
            <article className="version-card">
              <div className="version-id"><span>2024.06</span><strong>Qwen2</strong></div>
              <div className="version-copy">
                <h3>GQA 主线化，长上下文成为工程目标</h3>
                <p>更多 Q heads 共享较少的 K/V heads，直接减少 KV Cache。长文本策略继续围绕 RoPE 外推与注意力分块展开，把“能跑”变成架构指标。</p>
                <div className="tag-row"><span>GQA</span><span>KV Cache ↓</span><span>Long Context</span></div>
              </div>
            </article>
            <article className="version-card focus-card">
              <div className="version-id"><span>2024.09</span><strong>Qwen2.5</strong></div>
              <div className="version-copy">
                <h3>架构几乎没换，能力却大幅上升</h3>
                <p>预训练规模从 Qwen2 的 7T 扩展到最高 <b>18T tokens</b>，并强化代码、数学、结构化数据、JSON 和长文本生成。这是“能力提升 ≠ 必须换架构”的标准案例。</p>
                <div className="equation">Capability ≈ Architecture + Data + Training + Post-training</div>
              </div>
            </article>
          </div>
        </section>

        <section className="content-section dark-section" id="chapter-3">
          <div className="section-heading inverse">
            <span className="section-no">03</span>
            <div><p>QWEN3 · MODERN TRANSFORMER</p><h2>主干没换，Attention 与 MoE 都动了刀</h2></div>
          </div>
          <p className="lead">
            Qwen3 仍是 Decoder-only Transformer，但它把注意力的数值稳定性和 MoE 路由方式同时改造了。
          </p>
          <div className="split-explainer">
            <article>
              <span className="big-index">A</span>
              <h3>Attention：去 Bias + QK-Norm</h3>
              <div className="formula-flow"><code>Q = XWq</code><i>→</i><code>Norm(Q), Norm(K)</code><i>→</i><code>Attention</code></div>
              <p>不再使用 QKV bias，并在计算 attention score 前对 Q、K 归一化，以增强训练稳定性。</p>
            </article>
            <article>
              <span className="big-index">B</span>
              <h3>MoE：128 个 Routed Experts</h3>
              <div className="expert-dots" aria-label="128 experts 中每个 token 选择 8 个">
                {Array.from({ length: 32 }).map((_, index) => <i className={index % 4 === 0 ? "hot" : ""} key={index}></i>)}
              </div>
              <p>代表性 MoE 型号使用 128 experts，每个 token 选择 8 个；取消早期路线中的 shared expert，并配合全局 batch 的负载均衡策略。</p>
            </article>
          </div>
          <aside className="distinction">
            <span>需要区分</span>
            <p><b>Thinking / Non-thinking</b> 是同一套参数经过后训练学会的两种生成行为，而不是额外加了一套“推理网络”。</p>
          </aside>
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
                <span>Gated Attention</span><em>MoE</em>
                <span>Gated Attention</span><em>MoE</em>
                <span>Gated Attention</span><em>MoE</em>
                <span>Gated Attention</span><em>MoE</em>
              </div>
              <small>每层依赖传统 Attention</small>
            </article>
            <div className="shift-arrow"><span>架构<br/>换代</span>→</div>
            <article>
              <p className="mini-label accent-text">混合路线 · QWEN3-NEXT</p>
              <div className="layer-stack hybrid">
                <span>Gated DeltaNet</span><em>MoE</em>
                <span>Gated DeltaNet</span><em>MoE</em>
                <span>Gated DeltaNet</span><em>MoE</em>
                <span>Gated Attention</span><em>MoE</em>
              </div>
              <small>3 : 1 Hybrid 循环</small>
            </article>
          </div>
          <div className="concept-grid">
            <article><b>01</b><h3>Gated DeltaNet</h3><p>将历史压缩进持续更新的 state，在长序列上接近线性处理。</p></article>
            <article><b>02</b><h3>Gated Attention</h3><p>周期性保留全注意力，用于精确访问某个历史 token。</p></article>
            <article><b>03</b><h3>Ultra-sparse MoE</h3><p>512 experts，典型配置每 token 激活 10 routed + 1 shared。</p></article>
            <article><b>04</b><h3>MTP</h3><p>多 token 预测扩展训练目标，也为推测加速提供可利用的结构。</p></article>
          </div>
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
              <p>继承 Gated DeltaNet + Gated Attention，同时将文本、图像与视频放进统一的视觉—语言基座中训练。Dense / MoE 只是 FFN 路线的不同，不是判断 Qwen3.5 的核心标签。</p>
              <div className="modality-row"><span>TEXT</span><span>IMAGE</span><span>VIDEO</span><b>→ UNIFIED</b></div>
            </article>
            <article>
              <p className="mini-label">QWEN3.6</p>
              <h3>重点不是新 Attention，而是真实任务稳定性</h3>
              <p>官方将其定位为建立在 Qwen3.5 的基础突破之上，主要升级集中于代码 Agent、仓库级理解、响应稳定性与 <b>Thinking Preservation</b>。</p>
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
            <a href="#qa"><span>推理工程</span><b>GQA 为什么能减少 KV Cache？</b><i>↗</i></a>
            <a href="#qa"><span>稀疏模型</span><b>MoE 总参数与激活参数有何不同？</b><i>↗</i></a>
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
            <details open>
              <summary><span>Q1</span>Qwen2.5 比 Qwen2 强很多，为什么不算架构换代？</summary>
              <div><p>因为主干仍是相近的 Decoder-only Transformer，关键组件仍是 GQA、RoPE、SwiGLU 与 RMSNorm。明显的能力跃迁主要来自 18T token 级预训练、更高质量数据和更强后训练。</p><a href="#chapter-2">回到 Qwen2.5 ↑</a></div>
            </details>
            <details>
              <summary><span>Q2</span>GQA 到底节省了什么？</summary>
              <div><p>它让多个 Query heads 共享少量 Key / Value heads。推理时需要缓存的 K/V 头变少，因此能显著降低 KV Cache 内存，同时尽量保留多头表达能力。</p><a href="#chapter-2">回到 Qwen2 ↑</a></div>
            </details>
            <details>
              <summary><span>Q3</span>Qwen3-Next 为什么不直接完全抛弃 Attention？</summary>
              <div><p>状态更新类方法长于高效压缩过去，但对某个历史位置做精确随机访问仍是全注意力的优势。3:1 混合结构本质上是在吞吐量与精确回忆之间取平衡。</p><a href="#chapter-4">回到 Qwen3-Next ↑</a></div>
            </details>
            <details>
              <summary><span>Q4</span>Qwen3 的 Thinking / Non-thinking 是两个模型吗？</summary>
              <div><p>不是。它们是同一个模型通过后训练掌握的不同生成行为。这是能力与行为层的创新，不能和 layer 级别的架构变化混为一谈。</p><a href="#chapter-3">回到 Qwen3 ↑</a></div>
            </details>
            <details>
              <summary><span>Q5</span>研究 Qwen 架构，最值得抓住哪四个节点？</summary>
              <div><p>Qwen 用来理解现代 Decoder baseline；Qwen2 用来理解 GQA 与长上下文工程；Qwen3 用来理解 QK-Norm 与 Sparse MoE；Qwen3-Next / 3.5 用来理解 Hybrid Attention 与 state-update 路线。</p></div>
            </details>
          </div>
        </section>

        <section className="sources-section">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>官方资料与核心文献</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
            <li><a href="https://qwenlm.github.io/blog/qwen-moe/" target="_blank" rel="noreferrer">Qwen1.5-MoE: Matching 7B Model Performance</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2407.10671" target="_blank" rel="noreferrer">Qwen2 Technical Report</a><span>2024</span></li>
            <li><a href="https://qwenlm.github.io/blog/qwen2.5-llm/" target="_blank" rel="noreferrer">Qwen2.5-LLM: Extending the boundary of LLMs</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2505.09388" target="_blank" rel="noreferrer">Qwen3 Technical Report</a><span>2025</span></li>
            <li><a href="https://qwen.ai/blog?from=research.latest-advancements-list&id=4074cca80393150c248e508aa62983f9cb7d27cd" target="_blank" rel="noreferrer">Qwen3-Next: Towards Ultimate Training & Inference Efficiency</a><span>2025</span></li>
            <li><a href="https://qwen.ai/blog?id=qwen3.5" target="_blank" rel="noreferrer">Qwen3.5: Towards Native Multimodal Agents</a><span>2026</span></li>
            <li><a href="https://github.com/QwenLM/Qwen3.6" target="_blank" rel="noreferrer">Qwen3.6 Official Repository</a><span>2026</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>下一篇 · 建议阅读</span><strong>GQA 与 Gated DeltaNet：从 KV Cache 到状态更新</strong></div>
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
        <div className="reading-note"><span>6 章</span><div><i></i></div><small>约 18 分钟阅读</small></div>
      </aside>
    </div>
  );
}
