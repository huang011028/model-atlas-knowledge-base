import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 RMSNorm？";
const description = "从公式出发，理解 RMSNorm 与 LayerNorm、BatchNorm 等归一化方法的区别，以及它为什么成为现代大语言模型的常用选择。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "RMSNorm 在做什么"],
  ["02", "从公式理解 RMSNorm"],
  ["03", "与 LayerNorm 的区别"],
  ["04", "其他归一化方法"],
  ["05", "为什么 LLM 常用"],
  ["06", "在 Transformer 中的位置"],
  ["07", "关联 QA"],
];

const qaQuestions = [
  "RMSNorm 后的向量 RMS 一定等于 1 吗？",
  "不减均值，隐状态不会越来越偏向某一侧吗？",
  "ε 是可学习参数吗？",
  "Qwen3 对 Q/K heads 的归一化就是 RMSNorm 吗？",
  "RMSNorm 可以直接替换任意 LayerNorm 吗？",
];

export default function RMSNormPage() {
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
          <a className="selected" href="/normalization/rmsnorm">RMSNorm</a>
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

      <main className="article rms-article">
        <section className="hero rms-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 标准化与归一化 <span>/</span> RMSNorm</div>
          <div className="question-label"><span>USER QUESTION · 001</span></div>
          <p className="original-question">“什么是 RMSNorm？它和其他归一化 / 标准化方式有什么不同？为什么它现在是最常用的方式之一？”</p>
          <div className="eyebrow"><span></span> NORMALIZATION · 01</div>
          <h1>什么是 RMSNorm？</h1>
          <p className="dek">它可以被理解为一个删去“均值中心化”的 LayerNorm：只管激活向量的尺度，不强制它的均值回到 0。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>16 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first">
            <span>一句话答案</span>
            <p>RMSNorm 对每个 token 的隐状态向量除以它的均方根，再乘上可学习的缩放参数。它保留 LayerNorm 最重要的<b>尺度稳定</b>，但省去求均值和减均值的步骤。</p>
          </aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>WHAT IT NORMALIZES</p><h2>RMSNorm 在归一化什么？</h2></div></div>
          <p>先把对象说清楚。在大语言模型中，某一层处理某个 token 时，会拿到一个<Formula inline tex={String.raw`d`} />维向量：</p>
          <Formula label="输入向量" tex={String.raw`\boldsymbol{x}=(x_1,x_2,\ldots,x_d)\in\mathbb{R}^{d}`} />
          <p>这个向量可以是进入 Attention 或 FFN 之前的隐状态。RMSNorm 不会在不同 token 之间求统计量，也不会借用其他 batch 样本；它只沿当前 token 的<Formula inline tex={String.raw`d`} />个 hidden dimensions 计算一个尺度。</p>
          <aside className="text-note"><b>不是在处理 tokenizer</b><p>这里的 normalization 发生在神经网络内部的激活向量上，与数据预处理中的文本清洗、分词或特征缩放不是一件事。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>THE FORMULA</p><h2>从公式理解 RMSNorm</h2></div></div>
          <p>第一步，对向量<Formula inline tex={String.raw`\boldsymbol{x}`} />的每个分量平方，求平均，再开根号：</p>
          <Formula
            label="均方根"
            className="main-latex"
            tex={String.raw`\operatorname{RMS}(\boldsymbol{x})=\sqrt{\frac{1}{d}\sum_{i=1}^{d}x_i^2+\varepsilon}`}
          />
          <p>其中，<Formula inline tex={String.raw`d`} />是 hidden size；<Formula inline tex={String.raw`\varepsilon`} />是一个很小的正数，用来防止分母接近 0 时出现数值问题。</p>
          <p>第二步，把每个分量除以这个 RMS，然后乘上对应维度的可学习 gain 参数<Formula inline tex={String.raw`\gamma_i`} />：</p>
          <Formula
            label="输出"
            className="main-latex"
            tex={String.raw`y_i=\gamma_i\,\frac{x_i}{\operatorname{RMS}(\boldsymbol{x})}`}
          />
          <p>如果暂时忽略<Formula inline tex={String.raw`\varepsilon`} />和<Formula inline tex={String.raw`\gamma`} />，归一化后向量的均方根约等于 1。换句话说，RMSNorm 将“向量有多大”从“向量指向哪里”中部分解耦。</p>
          <div className="derivation-box">
            <p className="mini-label">缩放不变性 · RESCALING INVARIANCE</p>
            <Formula className="dark-latex bare-latex" tex={String.raw`\operatorname{RMS}(\alpha\boldsymbol{x})=|\alpha|\operatorname{RMS}(\boldsymbol{x})`} />
            <Formula
              className="dark-latex bare-latex therefore"
              tex={String.raw`\alpha>0\quad\Longrightarrow\quad
                \frac{\alpha\boldsymbol{x}}{\operatorname{RMS}(\alpha\boldsymbol{x})}
                =\frac{\boldsymbol{x}}{\operatorname{RMS}(\boldsymbol{x})}`}
            />
          </div>
          <p>因此，如果上一层的输出整体放大了<Formula inline tex={String.raw`\alpha`} />倍，RMSNorm 后的方向在理想情况下不变。这就是它稳定激活尺度的核心。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>RMSNORM VS. LAYERNORM</p><h2>它与 LayerNorm 究竟差在哪里？</h2></div></div>
          <p>LayerNorm 会先求均值，将每个分量减去均值，然后再按标准差缩放：</p>
          <div className="formula-sequence">
            <div><span>均值</span><Formula className="sequence-latex" tex={String.raw`\mu=\frac{1}{d}\sum_{i=1}^{d}x_i`} /></div>
            <div><span>方差</span><Formula className="sequence-latex" tex={String.raw`\sigma^2=\frac{1}{d}\sum_{i=1}^{d}(x_i-\mu)^2`} /></div>
            <div><span>LayerNorm</span><Formula className="sequence-latex" tex={String.raw`y_i=\gamma_i\frac{x_i-\mu}{\sqrt{\sigma^2+\varepsilon}}+\beta_i`} /></div>
          </div>
          <p>RMSNorm 去掉了两个环节：<b>不计算<Formula inline tex={String.raw`\mu`} />，不做<Formula inline tex={String.raw`x_i-\mu`} /></b>。标准 RMSNorm 通常也只保留乘法 gain<Formula inline tex={String.raw`\gamma`} />，不再加可学习偏置<Formula inline tex={String.raw`\beta`} />。</p>
          <div className="identity-callout">
            <span>一个很有用的关系</span>
            <Formula className="identity-latex bare-latex" tex={String.raw`\operatorname{RMS}(\boldsymbol{x})^2=\mu^2+\sigma^2`} />
            <p>均方值等于均值的平方加方差。所以当向量均值<Formula inline tex={String.raw`\mu`} />接近 0 时，<Formula inline tex={String.raw`\operatorname{RMS}(\boldsymbol{x})`} />与标准差<Formula inline tex={String.raw`\sigma`} />接近，RMSNorm 和不带 shift 的 LayerNorm 也会变得相似。</p>
          </div>
          <div className="compare-columns">
            <article><p className="mini-label">LAYERNORM</p><h3>中心化 + 缩放</h3><Formula className="card-latex" tex={String.raw`\frac{\boldsymbol{x}-\mu}{\sigma}`} /><ul><li>对输入平移不敏感</li><li>对输入缩放不敏感</li><li>计算均值与方差</li></ul></article>
            <article className="accent-card"><p className="mini-label">RMSNORM</p><h3>只做尺度缩放</h3><Formula className="card-latex accent-latex" tex={String.raw`\frac{\boldsymbol{x}}{\operatorname{RMS}(\boldsymbol{x})}`} /><ul><li>不保证输出均值为 0</li><li>保留缩放不变性</li><li>计算路径更简单</li></ul></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>NORMALIZATION FAMILIES</p><h2>它与其他归一化 / 标准化方式有什么不同？</h2></div></div>
          <p>这些方法的共同目标是调整激活的统计尺度，最重要的区别是：<b>在哪些维度上求统计量，以及是否减均值。</b></p>
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>方法</th><th>统计范围</th><th>是否减均值</th><th>是否依赖 batch</th><th>典型场景</th></tr></thead>
              <tbody>
                <tr><td>BatchNorm</td><td>同一 channel 上的 batch / 空间样本</td><td>是</td><td><b>是</b></td><td>CNN、视觉模型</td></tr>
                <tr><td>LayerNorm</td><td>单个样本 / token 的 hidden dimensions</td><td>是</td><td>否</td><td>Transformer、RNN</td></tr>
                <tr className="highlight-row"><td>RMSNorm</td><td>单个样本 / token 的 hidden dimensions</td><td><b>否</b></td><td>否</td><td>现代 LLM</td></tr>
                <tr><td>GroupNorm</td><td>单个样本内的 channel groups</td><td>是</td><td>否</td><td>小 batch 视觉任务</td></tr>
              </tbody>
            </table>
          </div>
          <aside className="text-note"><b>“标准化”与“归一化”</b><p>中文工程语境里两个词经常混用。严格说，LayerNorm 在仿射参数之前做的是近似“零均值、单位方差”标准化；RMSNorm 则只做尺度归一化，不保证零均值。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>WHY MODERN LLMS USE IT</p><h2>为什么 RMSNorm 成为现代 LLM 的常用选择？</h2></div></div>
          <p>答案不是“它在任何情况下都比 LayerNorm 好”，而是：它用更少的操作保留了大规模 Transformer 最需要的尺度控制，并已被多个成功模型验证。</p>
          <div className="reason-list">
            <article><span>01</span><div><h3>不依赖 batch，适合变长序列</h3><p>每个 token 独立计算自己的 RMS。训练和推理使用同一套统计方式，不需要 BatchNorm 那样维护运行均值、方差。</p></div></article>
            <article><span>02</span><div><h3>能稳定深层残差网络的激活尺度</h3><p>深层 Transformer 中，残差分支不断相加。RMSNorm 在每个子层前把输入尺度拉回可控范围，减少某层激活突然过大对后续层的影响。</p></div></article>
            <article><span>03</span><div><h3>比 LayerNorm 的数学路径更短</h3><p>它不需要求均值与减均值。原始 RMSNorm 论文在其测试的不同模型上报告了 7%–64% 的运行时间降低；但在现代 GPU 的 fused kernels 中，实际差异会随实现和硬件变化。</p></div></article>
            <article><span>04</span><div><h3>“不做中心化”在大量实践中是可行的</h3><p>RMSNorm 的原始假设是：LayerNorm 的再缩放不变性比再中心化不变性更关键。LLaMA、Qwen 等模型的大规模训练结果，让这个工程选择得到广泛采用。</p></div></article>
          </div>
          <aside className="boundary-box"><b>不要把它理解成万能公式</b><p>归一化与残差结构、参数初始化、优化器、学习率和数值精度共同作用。在某些架构上 LayerNorm 可能更好，也有研究尝试完全去掉 normalization。“常用”不等于“始终最优”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>PLACEMENT IN A TRANSFORMER</p><h2>RMSNorm 在 Transformer 里放在哪里？</h2></div></div>
          <p>现代 Decoder LLM 通常采用 Pre-Norm：先归一化，再进入 Attention 或 FFN，子层输出最后加回残差主干。</p>
          <div className="transformer-formulas">
            <div>
              <span>01 · ATTENTION 子层</span>
              <Formula
                className="dark-latex bare-latex transformer-latex"
                tex={String.raw`\begin{aligned}
                  \widetilde{\boldsymbol{h}} &= \operatorname{RMSNorm}(\boldsymbol{h})
                  && \text{先归一化} \\
                  \boldsymbol{h}' &= \boldsymbol{h}+\operatorname{Attention}(\widetilde{\boldsymbol{h}})
                  && \text{再加回残差}
                \end{aligned}`}
              />
            </div>
            <div>
              <span>02 · FFN 子层</span>
              <Formula
                className="dark-latex bare-latex transformer-latex"
                tex={String.raw`\begin{aligned}
                  \widetilde{\boldsymbol{h}}' &= \operatorname{RMSNorm}(\boldsymbol{h}')
                  && \text{先归一化} \\
                  \boldsymbol{h}'' &= \boldsymbol{h}'+\operatorname{FFN}(\widetilde{\boldsymbol{h}}')
                  && \text{再加回残差}
                \end{aligned}`}
              />
            </div>
          </div>
          <p>这个结构中，残差主路仍保留一条相对直接的信息与梯度通道。它与原始 Transformer 常见的 Post-Norm 不同：</p>
          <Formula label="Post-Norm" tex={String.raw`\boldsymbol{h}'=\operatorname{Norm}\!\left(\boldsymbol{h}+F(\boldsymbol{h})\right)`} />
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>Qwen 初代在现代 Decoder 基线中采用 RMSNorm。所以从 Qwen 文档点进这里，你实际上正在拆解一个 Transformer block 进入 Attention / FFN 前的核心步骤。</p><a href="/#chapter-2">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>07</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>RMSNorm 后的向量 RMS 一定等于 1 吗？</summary><div><p>在忽略<Formula inline tex={String.raw`\varepsilon`} />且尚未乘可学习<Formula inline tex={String.raw`\gamma`} />时，约等于 1。乘上每个维度不同的<Formula inline tex={String.raw`\gamma_i`} />后，最终输出的 RMS 不必仍为 1。<Formula inline tex={String.raw`\gamma`} />的作用就是让模型能在归一化之后重新学习各维度的合适尺度。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>不减均值，隐状态不会越来越偏向某一侧吗？</summary><div><p>RMSNorm 确实不提供平移不变性，这是它与 LayerNorm 的真实差异。但原始论文以及后续 LLM 实践表明，在许多架构中，控制尺度已经足以稳定训练，均值相关自由度可以由线性层、残差路径与后续学习共同处理。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span><span className="qa-question"><Formula inline tex={String.raw`\varepsilon`} />是可学习参数吗？</span></summary><div><p>通常不是。<Formula inline tex={String.raw`\varepsilon`} />是一个固定的小常数，它主要服务于数值稳定性。不同模型和数值精度可以选择不同的<Formula inline tex={String.raw`\varepsilon`} />。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>Qwen3 的 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 就是 RMSNorm 吗？</summary><div><p>底层归一化原理可以是 RMSNorm，但对象和位置不同。block 的 RMSNorm 对整个 hidden state 做处理；<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 则在 Attention 内对<Formula inline tex={String.raw`Q/K`} /> heads 做归一化，目的是直接控制 attention logits 的尺度。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>RMSNorm 可以直接替换任意 LayerNorm 吗？</summary><div><p>不应该默认可以。两者的不变性不同，替换后可能需要重新训练或调整学习率、初始化和残差结构。对已训练好的模型直接换层，通常会改变模型函数。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://proceedings.neurips.cc/paper/2019/hash/1e8a19426224ca89e83cef47f1e7f53b-Abstract.html" target="_blank" rel="noreferrer">Root Mean Square Layer Normalization</a><span>NeurIPS 2019</span></li>
            <li><a href="https://arxiv.org/abs/1607.06450" target="_blank" rel="noreferrer">Layer Normalization</a><span>2016</span></li>
            <li><a href="https://proceedings.mlr.press/v37/ioffe15.html" target="_blank" rel="noreferrer">Batch Normalization</a><span>ICML 2015</span></li>
            <li><a href="https://arxiv.org/abs/2302.13971" target="_blank" rel="noreferrer">LLaMA: Open and Efficient Foundation Language Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>回到来路</span><strong>Qwen 的现代 Decoder 基线中，RMSNorm 和 <a className="term-link" href="/position-encoding/rope">RoPE</a>、<a className="term-link" href="/activations/swiglu">SwiGLU</a> 是同一套基础组件。</strong></div>
          <a href="/">回到 Qwen 文档 ↗</a>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "07" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>7 章</span><div><i></i></div><small>公式密度 · 中等</small></div>
      </aside>
    </div>
  );
}
