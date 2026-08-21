import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 GQA？";
const description = "从 MHA、MQA 到 GQA，理解 Query heads 如何分组共享 Key/Value heads，以及它对 KV Cache 和增量解码的影响。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "GQA 改变了什么"],
  ["02", "MHA、MQA 与 GQA"],
  ["03", "分组后的计算公式"],
  ["04", "KV Cache 如何减少"],
  ["05", "Prefill 与 Decode"],
  ["06", "质量与效率取舍"],
  ["07", "工程实现要点"],
  ["08", "与 Qwen 的关系"],
  ["09", "关联 QA"],
];

const qaQuestions = [
  "GQA 主要节省参数，还是节省 KV Cache？",
  "GQA 会减少 Query heads 吗？",
  "GQA 的 group size 怎么计算？",
  "用了 GQA 就能支持更长上下文吗？",
  "GQA 和 Query/Key 归一化有什么关系？",
  "训练好的 MHA 模型能改成 GQA 吗？",
];

export default function GQAPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页">
          <span className="brand-mark">模</span>
          <span>模见 <small>Model Atlas</small></span>
        </a>
        <nav className="topnav" aria-label="主导航">
          <a className="active" href="/">知识库</a>
          <a href="#chapter-1">公式导读</a>
          <a href="#qa">QA 索引</a>
        </nav>
        <div className="top-actions">
          <a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a>
          <span className="edition">2026.08</span>
        </div>
      </header>

      <aside className="left-rail" aria-label="知识库目录">
        <p className="rail-kicker">知识库</p>
        <a className="rail-home" href="/"><span>◇</span> 大模型时代</a>
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a></div>
        <div className="rail-group">
          <p>01 · 模型与架构</p>
          <a href="/">Qwen 系列演进</a>
          <a href="/architecture/decoder-only">Decoder-only Transformer</a>
          <a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a>
          <a className="locked" href="#">Llama 系列演进 <em>待更新</em></a>
        </div>
        <div className="rail-group">
          <p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span>
          <a href="/training/long-cot-cold-start">Long-CoT Cold Start</a>
          <a href="/training/reasoning-rl">Reasoning RL</a>
          <span className="rail-subhead">RL 与偏好优化</span>
          <a href="/training/rlhf">RLHF</a>
          <a href="/training/ppo">PPO</a>
          <a href="/training/dpo">DPO</a>
          <a href="/training/kto">KTO</a>
          <a href="/training/grpo">GRPO</a>
          <span>Pre-training · 待更新</span>
        </div>
        <div className="rail-group muted">
          <p>03 · Agent 与应用</p>
          <span>Memory</span>
          <span>Tool Use</span>
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
          <a className="selected" href="/attention/gqa">GQA</a>
          <a href="/attention/qkv-bias">QKV Bias</a>
          <a href="/attention/qk-norm">QK-Norm</a>
        </div>
        <div className="rail-group">
          <p>07 · 位置编码与上下文</p>
          <a href="/position-encoding/rope">RoPE</a>
          <a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a>
        </div>
      </aside>

      <main className="article rms-article gqa-article">
        <section className="hero rms-hero gqa-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 注意力机制与 KV Cache <span>/</span> GQA</div>
          <div className="question-label"><span>USER QUESTION · 003</span></div>
          <p className="original-question">“什么是 GQA？它与 MHA、MQA 有什么区别？为什么让多个 Query heads 共享较少的 Key / Value heads，就能减少 KV Cache？”</p>
          <div className="eyebrow"><span></span> ATTENTION &amp; KV CACHE · 01</div>
          <h1>什么是 GQA？</h1>
          <p className="dek">Grouped-Query Attention 保留较多 Query heads，但把它们分成若干组；同一组内的 Query 共享一套 Key 与 Value，从而在表达能力和解码成本之间取中间点。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>20 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first">
            <span>一句话答案</span>
            <p>GQA 不减少 Query heads，而是减少需要生成和缓存的<b>Key / Value heads</b>。若每<Formula inline tex={String.raw`g`} />个 Query heads 共享一个 KV head，KV Cache 理想情况下约降为 MHA 的<Formula inline tex={String.raw`1/g`} />。</p>
          </aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>WHAT GQA CHANGES</p><h2>GQA 改变的是哪一部分？</h2></div></div>
          <p>多头注意力会把每个 token 的隐状态投影成 Query、Key 和 Value。设 Query heads 数量为<Formula inline tex={String.raw`n_q`} />，KV heads 数量为<Formula inline tex={String.raw`n_{kv}`} />，每个 head 的维度为<Formula inline tex={String.raw`d_h`} />。</p>
          <Formula label="GQA 的基本关系" tex={String.raw`1<n_{kv}<n_q,\qquad n_q=g\,n_{kv}`} />
          <p>其中<Formula inline tex={String.raw`g=n_q/n_{kv}`} />是每个 KV head 服务的 Query head 数量。Query 仍然有<Formula inline tex={String.raw`n_q`} />个，只是同一组中的<Formula inline tex={String.raw`g`} />个 Query heads 会读取同一套 Key 与 Value。</p>
          <aside className="text-note"><b>它不是减少 Attention 层数</b><p>GQA 改变单个 Attention 层内部的 head 共享方式，不会自动减少 Transformer block 数量，也不会改变每个 token 都要产生 Query 的事实。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>THE ATTENTION FAMILY</p><h2>从 MHA 到 MQA，再到 GQA</h2></div></div>
          <p>三者可以放在同一条连续轴上理解：区别只在于多少个 Query heads 共享一套 KV heads。</p>
          <div className="head-sharing-map" aria-label="MHA、GQA 与 MQA 的 Query 和 KV head 共享关系">
            <article>
              <div className="head-map-copy"><span>MHA</span><b>一一对应</b><small className="head-map-formula"><Formula inline tex={String.raw`n_{mathrm{kv}}=n_{mathrm{q}}`} /></small></div>
              <div className="head-map-diagram"><span className="head-label">Q</span><div className="head-strip">{Array.from({ length: 8 }).map((_, index) => <i className={`head-chip group-${index % 4}`} key={`mha-q-${index}`}></i>)}</div><span className="head-label">KV</span><div className="head-strip">{Array.from({ length: 8 }).map((_, index) => <i className={`head-chip group-${index % 4}`} key={`mha-kv-${index}`}></i>)}</div></div>
            </article>
            <article className="focus-map">
              <div className="head-map-copy"><span>GQA</span><b>分组共享</b><small className="head-map-formula"><Formula inline tex={String.raw`1<n_{mathrm{kv}}<n_{mathrm{q}}`} /></small></div>
              <div className="head-map-diagram"><span className="head-label">Q</span><div className="head-strip">{Array.from({ length: 8 }).map((_, index) => <i className={`head-chip group-${Math.floor(index / 4)}`} key={`gqa-q-${index}`}></i>)}</div><span className="head-label">KV</span><div className="head-strip compact-strip">{Array.from({ length: 2 }).map((_, index) => <i className={`head-chip group-${index}`} key={`gqa-kv-${index}`}></i>)}</div></div>
            </article>
            <article>
              <div className="head-map-copy"><span>MQA</span><b>全部共享</b><small className="head-map-formula"><Formula inline tex={String.raw`n_{mathrm{kv}}=1`} /></small></div>
              <div className="head-map-diagram"><span className="head-label">Q</span><div className="head-strip">{Array.from({ length: 8 }).map((_, index) => <i className="head-chip group-0" key={`mqa-q-${index}`}></i>)}</div><span className="head-label">KV</span><div className="head-strip compact-strip"><i className="head-chip group-0"></i></div></div>
            </article>
          </div>
          <div className="norm-table-wrap">
            <table className="norm-table gqa-table">
              <thead><tr><th>方法</th><th>Query heads</th><th>KV heads</th><th>共享程度</th><th>典型取舍</th></tr></thead>
              <tbody>
                <tr><td>MHA</td><td><Formula className="gqa-cell-math" inline tex={String.raw`n_{mathrm{q}}`} /></td><td><Formula className="gqa-cell-math" inline tex={String.raw`n_{mathrm{q}}`} /></td><td>不共享</td><td>表达充分，Cache 最大</td></tr>
                <tr className="highlight-row"><td>GQA</td><td><Formula className="gqa-cell-math" inline tex={String.raw`n_{mathrm{q}}`} /></td><td><Formula className="gqa-cell-math" inline tex={String.raw`n_{mathrm{kv}}`} /></td><td>组内共享</td><td>质量与效率折中</td></tr>
                <tr><td>MQA</td><td><Formula className="gqa-cell-math" inline tex={String.raw`n_{mathrm{q}}`} /></td><td><Formula className="gqa-cell-math" inline tex={String.raw`\vphantom{n_{mathrm{kv}}}1`} /></td><td>全部共享</td><td>Cache 最小，共享最强</td></tr>
              </tbody>
            </table>
          </div>
          <p>因此，MHA 与 MQA 是两个端点，GQA 是中间的一族结构。只要改变<Formula inline tex={String.raw`n_{kv}`} />，就能改变共享强度。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>HEAD MAPPING</p><h2>分组后，每个 Query 如何找到自己的 K/V？</h2></div></div>
          <p>给 Query head 编号<Formula inline tex={String.raw`h\in\{0,\ldots,n_q-1\}`} />。当每组有<Formula inline tex={String.raw`g`} />个 Query heads 时，它对应的 KV head 可以写成：</p>
          <Formula label="Query head 到 KV head 的映射" tex={String.raw`\pi(h)=\left\lfloor\frac{h}{g}\right\rfloor,\qquad g=\frac{n_q}{n_{kv}}`} />
          <p>于是第<Formula inline tex={String.raw`h`} />个 Query head 不再使用独立的<Formula inline tex={String.raw`K_h,V_h`} />，而是使用所在组的<Formula inline tex={String.raw`K_{\pi(h)},V_{\pi(h)}`} />：</p>
          <Formula label="单个 Query head 的注意力" tex={String.raw`\operatorname{head}_h=\operatorname{softmax}\!\left(\frac{Q_hK_{\pi(h)}^{\mathsf T}}{\sqrt{d_h}}\right)V_{\pi(h)}`} />
          <p>不同 Query heads 仍有不同的<Formula inline tex={String.raw`Q_h`} />，所以它们面对同一套 K/V 时仍可产生不同的 attention weights。共享的是被检索的 Key / Value 表示，不是 Query 本身，也不是最终注意力分布。</p>
          <aside className="text-note"><b>常见但非强制的约束</b><p>实现通常要求<Formula inline tex={String.raw`n_q`} />能被<Formula inline tex={String.raw`n_{kv}`} />整除，使每组恰好包含相同数量的 Query heads。某些更一般的映射也能定义，但硬件 kernel 与配置通常偏好规则分组。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>KV CACHE MEMORY</p><h2>GQA 为什么能直接减少 KV Cache？</h2></div></div>
          <p>自回归解码时，历史 token 的 Key 和 Value 会被保留下来，避免每生成一个新 token 都重新计算整段历史。设 batch size 为<Formula inline tex={String.raw`B`} />，已缓存长度为<Formula inline tex={String.raw`L`} />，层数为<Formula inline tex={String.raw`N`} />，每个元素占<Formula inline tex={String.raw`s`} /> bytes，则总 KV Cache 近似为：</p>
          <Formula label="整个模型的 KV Cache" tex={String.raw`M_{\mathrm{KV}}=2NBL\,n_{kv}d_hs`} />
          <p>开头的<Formula inline tex={String.raw`2`} />来自 Key 与 Value 两份缓存。其他条件相同，Cache 大小与<Formula inline tex={String.raw`n_{kv}`} />成正比：</p>
          <div className="derivation-box gqa-derivation">
            <p className="mini-label">相对 MHA 的缓存比例 · CACHE RATIO</p>
            <Formula className="dark-latex bare-latex" tex={String.raw`\frac{M_{\mathrm{GQA}}}{M_{\mathrm{MHA}}}=\frac{n_{kv}}{n_q}`} />
            <Formula className="dark-latex bare-latex therefore" tex={String.raw`n_q=g\,n_{kv}\quad\Longrightarrow\quad M_{\mathrm{GQA}}\approx\frac{1}{g}M_{\mathrm{MHA}}`} />
          </div>
          <p>例如<Formula inline tex={String.raw`n_q=32`} />、<Formula inline tex={String.raw`n_{kv}=8`} />时，每 4 个 Query heads 共享一个 KV head，理论 KV Cache 约为同维度 MHA 的四分之一。</p>
          <aside className="boundary-box"><b>实际显存不只包含 KV Cache</b><p>模型权重、激活、临时 workspace、内存对齐与分布式复制也会占显存。因此“KV Cache 减少 4 倍”不等于“整个推理进程显存减少 4 倍”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>PREFILL VS. DECODE</p><h2>它在哪个阶段最有价值？</h2></div></div>
          <p>LLM 推理通常分成 Prefill 和 Decode。GQA 在两个阶段都会减少 K/V 投影与缓存体积，但最突出的收益通常出现在逐 token 解码。</p>
          <div className="compare-columns gqa-phases">
            <article><p className="mini-label">PREFILL · 处理提示词</p><h3>计算密集、并行度较高</h3><Formula className="card-latex" tex={String.raw`QK^{\mathsf T}\in\mathbb{R}^{L\times L}`} /><ul><li>整段 prompt 并行进入模型</li><li>注意力矩阵计算仍随序列增长</li><li>GQA 会减少 K/V 投影和写入量</li></ul></article>
            <article className="accent-card"><p className="mini-label">DECODE · 逐 token 生成</p><h3>反复读取历史 KV Cache</h3><Formula className="card-latex accent-latex" tex={String.raw`q_tK_{1:t}^{\mathsf T}`} /><ul><li>每一步只有新的 Query</li><li>需要读取此前所有 K/V</li><li>更容易受显存带宽限制</li></ul></article>
          </div>
          <p>MQA 论文的出发点正是增量解码中的 K/V 张量读取成本。GQA 保留多个 KV heads，同时大幅减少每一步必须从显存读取的数据量，因此能改善吞吐、可服务 batch size 与长上下文解码成本。</p>
          <aside className="text-note"><b>不会改变注意力的长度复杂度</b><p>标准全注意力仍然需要让 Query 与历史位置交互。GQA 减少 head 维度上的重复 K/V，并不把随上下文长度增长的全注意力直接变成线性状态模型。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>QUALITY VS. EFFICIENCY</p><h2>为什么不总是直接使用 MQA？</h2></div></div>
          <p>MQA 让所有 Query heads 共享唯一一套 K/V，缓存最省，但共享也最强。不同 Query heads 失去各自独立的 Key / Value 投影后，模型容量可能受到影响。</p>
          <div className="reason-list">
            <article><span>01</span><div><h3>MHA：表达能力端点</h3><p>每个 Query head 都有对应的 K/V head，head 之间最独立，但推理时需要缓存最多的 K/V 张量。</p></div></article>
            <article><span>02</span><div><h3>MQA：效率端点</h3><p>只有一个 KV head，缓存与带宽成本最低；原始工作报告了解码加速，但也观察到相对基线的轻微质量损失。</p></div></article>
            <article><span>03</span><div><h3>GQA：可调的中间点</h3><p>使用多于 1、少于 Query heads 数量的 KV heads。GQA 论文报告其质量接近 MHA，同时速度可与 MQA 相当，但具体结果依赖模型与系统。</p></div></article>
            <article><span>04</span><div><h3>分组数是架构超参数</h3><p><Formula inline tex={String.raw`n_{kv}`} />越大越接近 MHA，越小越接近 MQA。它需要结合模型规模、服务 batch、上下文长度和并行方式共同选择。</p></div></article>
          </div>
          <aside className="boundary-box"><b>“接近 MHA”不是数学保证</b><p>GQA 的质量结论来自特定训练与 uptraining 实验。更换模型规模、数据、训练预算或 head 配置后，需要重新验证困惑度与下游能力。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>SYSTEM CONSIDERATIONS</p><h2>工程实现时还要看什么？</h2></div></div>
          <p>KV head 数量不是越少越好。除了模型质量，还要考虑缓存布局、kernel 支持和张量并行。</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>张量形状</h3><p>Query 常为<Formula inline tex={String.raw`[B,L,n_q,d_h]`} />，Key / Value 为<Formula inline tex={String.raw`[B,L,n_{kv},d_h]`} />。计算前可以通过视图或 kernel 内部映射完成组内共享，不应真的复制多份 KV Cache。</p></div></article>
            <article><span>02</span><div><h3>张量并行</h3><p>若 KV heads 少于并行设备数，某些分片会需要复制 KV heads 或改用其他切分方式。合适的<Formula inline tex={String.raw`n_{kv}`} />常与部署拓扑有关。</p></div></article>
            <article><span>03</span><div><h3>推理 kernel</h3><p>高效实现需要直接支持不同数量的 Query 与 KV heads。若框架先显式复制 K/V 再调用 MHA kernel，可能抵消一部分内存优势。</p></div></article>
          </div>
          <aside className="text-note"><b>读取模型配置时</b><p>常见字段包括 <code>num_attention_heads</code> 与 <code>num_key_value_heads</code>。两者相等通常对应 MHA；后者为 1 对应 MQA；介于两者之间对应 GQA。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>BACK TO QWEN</p><h2>GQA 在 Qwen 演进中意味着什么？</h2></div></div>
          <p>Qwen 初代建立 Decoder 基线后，Qwen1.5 的部分型号开始探索 GQA，Qwen2 则把减少 KV Cache 与长上下文推理进一步放到主线上。它体现的是一种产品侧很现实的架构选择：模型不仅要训练得好，也要在更长上下文和更大并发下服务得动。</p>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>回到 Qwen 文档时，可以把 GQA 看成“保留多 Query 表达、压缩历史 K/V 状态”的折中；它与 <a className="term-link" href="/position-encoding/rope">RoPE</a>、RMSNorm、SwiGLU 分别解决位置、尺度和 FFN 非线性问题。</p><a href="/#chapter-2">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>09</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>GQA 主要节省参数，还是节省 KV Cache？</summary><div><p>两者都会减少，因为 K/V projection matrices 也随 KV heads 变少；但在大规模自回归服务中，更关键的收益通常是 KV Cache 容量与逐步解码时的显存带宽。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>GQA 会减少 Query heads 吗？</summary><div><p>不会。它保留<Formula inline tex={String.raw`n_q`} />个 Query heads，只把 K/V heads 减为<Formula inline tex={String.raw`n_{kv}`} />。因此不同 Query heads 仍能形成不同的注意力分布。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>GQA 的 group size 怎么计算？</summary><div><p>规则分组时<Formula inline tex={String.raw`g=n_q/n_{kv}`} />。例如 32 个 Query heads 和 8 个 KV heads 对应 group size 4。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>用了 GQA 就能支持更长上下文吗？</summary><div><p>它不会改变模型学到的最大位置范围，也不会自动完成 <a className="term-link" href="/position-encoding/rope">RoPE</a> 外推；但更小的 KV Cache 能降低长上下文推理的显存门槛，因此让长上下文更容易部署。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>GQA 和 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 有什么关系？</summary><div><p>两者作用不同。GQA 决定多少 Query heads 共享 K/V heads；<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 在计算 attention logits 前归一化 Query 与 Key，主要控制数值尺度。它们可以同时存在。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>训练好的 MHA 模型能改成 GQA 吗？</summary><div><p>不能通过简单改配置无损完成。GQA 原始工作提出了从已有 MHA checkpoint 进行 uptraining 的方法，但仍需要构造 KV heads 并继续训练，让模型适应新的共享结构。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2305.13245" target="_blank" rel="noreferrer">GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/1911.02150" target="_blank" rel="noreferrer">Fast Transformer Decoding: One Write-Head is All You Need</a><span>2019</span></li>
            <li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Attention Is All You Need</a><span>2017</span></li>
            <li><a href="https://arxiv.org/abs/2307.09288" target="_blank" rel="noreferrer">Llama 2: Open Foundation and Fine-Tuned Chat Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2407.10671" target="_blank" rel="noreferrer">Qwen2 Technical Report</a><span>2024</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>回到 Qwen 的长上下文主线，或继续理解 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 与 Hybrid Attention。</strong></div>
          <div className="footer-links"><a href="/">Qwen 演进 ↗</a><a href="/attention/qk-norm">QK-Norm ↗</a><a href="/normalization/rmsnorm">RMSNorm ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "09" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>9 章</span><div><i></i></div><small>公式密度 · 中等</small></div>
      </aside>
    </div>
  );
}
