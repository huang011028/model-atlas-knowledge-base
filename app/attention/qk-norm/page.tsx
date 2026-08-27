import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 QK-Norm？";
const description = "从 Attention logits 的尺度出发，理解 QK-Norm 如何分别归一化 Query 与 Key，以及它和 RMSNorm、RoPE、Softmax、GQA、QKV Bias 的关系。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "它解决什么问题"],
  ["02", "定义与计算位置"],
  ["03", "按 Head 归一化"],
  ["04", "为什么能稳定 logits"],
  ["05", "为何 Q、K 都要处理"],
  ["06", "与 RoPE 的先后关系"],
  ["07", "与 Softmax 温度的区别"],
  ["08", "与其他模块的关系"],
  ["09", "收益、边界与 Qwen3"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "QK-Norm 与 Transformer block 外层的 RMSNorm 是一回事吗？",
  "为什么要分别归一化 Q 和 K，而不是归一化 QKᵀ？",
  "QK-Norm 会不会消除 Query 和 Key 携带的信息？",
  "使用 RMSNorm 后，Attention score 一定落在负一到一吗？",
  "归一化应该放在 RoPE 之前还是之后？",
  "它能替代除以根号 d_h 或 Softmax 吗？",
  "它与 cosine attention 是一回事吗？",
  "GQA 中 Query heads 和 KV heads 数不同，怎样归一化？",
  "Qwen3 为什么同时移除 QKV Bias 并加入 QK-Norm？",
  "S=Q̄K̄ᵀ/√d_h+M 是 QK-Norm 新增的步骤吗？",
];

const QKNormLink = ({ children = "QK-Norm" }: { children?: ReactNode }) => (
  <a className="term-link" href="/attention/qk-norm">{children}</a>
);

export default function QKNormPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页"><span className="brand-mark">模</span><span>模见 <small>Model Atlas</small></span></a>
        <nav className="topnav" aria-label="主导航"><a className="active" href="/">知识库</a><a href="#chapter-1">公式导读</a><a href="#qa">QA 索引</a></nav>
        <div className="top-actions"><a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a><span className="edition">2026.08</span></div>
      </header>

      <aside className="left-rail" aria-label="知识库目录">
        <p className="rail-kicker">知识库</p>
        <a className="rail-home" href="/"><span>◇</span> 大模型时代</a>
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a><span className="rail-subhead">概率、采样与估计</span><a href="/foundations/importance-sampling">Importance Sampling</a></div>
        <div className="rail-group"><p>01 · 模型与架构</p><a href="/">Qwen 系列演进</a><a href="/architecture/decoder-only">Decoder-only Transformer</a><a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a><a className="locked" href="#">Llama 系列演进 <em>待更新</em></a></div>
        <div className="rail-group"><p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span><a href="/training/long-cot-cold-start">Long-CoT Cold Start</a><a href="/training/reasoning-rl">Reasoning RL</a><span className="rail-subhead">RL 与偏好优化</span><a href="/training/rlhf">RLHF</a><a href="/training/ppo">PPO</a><a href="/training/dpo">DPO</a><a href="/training/kto">KTO</a><a href="/training/grpo">GRPO</a><span>Pre-training · 待更新</span></div>
        <div className="rail-group"><p>03 · Agent 与应用</p><a href="/agents/agent">Agent 基础</a><a href="/agents/memory">Memory</a><a href="/agents/tools">Tools</a></div>
        <div className="rail-group"><p>04 · 标准化与归一化</p><a href="/normalization/rmsnorm">RMSNorm</a></div>
        <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a href="/ffn/moe">MoE</a></div>
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a className="selected" href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article qk-norm-article">
        <section className="hero rms-hero qk-norm-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 注意力机制与 KV Cache <span>/</span> QK-Norm</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 009</span></div>
          <p className="original-question">“Attention 已经除以根号 d_h，为什么还要归一化 Query 和 Key？它稳定的究竟是什么？会不会把向量中的信息也一起消掉？”</p>
          <div className="eyebrow"><span></span> ATTENTION STABILITY · 02</div>
          <h1>什么是 QK-Norm？</h1>
          <p className="dek">QK-Norm 是在计算 Attention score 之前，分别对每个 Query head 和 Key head 的特征向量做归一化。它直接约束进入点积的向量尺度，避免 Attention logits 因 Q/K 范数持续放大而变得过尖、数值不稳定。</p>
          <div className="hero-meta"><span>建立于 2026.08.20</span><i></i><span>29 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first"><span>一句话答案</span><p>普通 Attention 使用 <Formula inline tex={String.raw`s_{ij}=q_i^{\mathsf T}k_j/\sqrt{d_h}`} />；加入 QK-Norm 后，先计算 <Formula inline tex={String.raw`\bar q_i=\operatorname{Norm}_Q(q_i)`} /> 与 <Formula inline tex={String.raw`\bar k_j=\operatorname{Norm}_K(k_j)`} />，再用 <Formula inline tex={String.raw`s_{ij}=\bar q_i^{\mathsf T}\bar k_j/\sqrt{d_h}`} />。它限制的是点积的尺度来源，不替代 RoPE、缩放因子或 Softmax。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>THE FAILURE MODE</p><h2>Attention 已经缩放，为什么 logits 仍可能变得很大？</h2></div></div>
          <p>一个 Query 与 Key 的点积可以拆成“长度 × 夹角”：</p>
          <Formula label="点积的几何分解" tex={String.raw`q_i^{\mathsf T}k_j=\lVert q_i\rVert_2\,\lVert k_j\rVert_2\cos\phi_{ij}`} />
          <p><Formula inline tex={String.raw`1/\sqrt{d_h}`} /> 解决的是初始化附近的维度效应：若各维近似独立且方差相当，点积方差会随 <Formula inline tex={String.raw`d_h`} /> 增长。但训练过程中，投影权重可能让 <Formula inline tex={String.raw`\lVert q_i\rVert_2`} /> 或 <Formula inline tex={String.raw`\lVert k_j\rVert_2`} /> 继续增大；固定的 <Formula inline tex={String.raw`1/\sqrt{d_h}`} /> 不会自动阻止这种尺度漂移。</p>
          <Formula label="尺度放大对 score 的影响" tex={String.raw`q_i\leftarrow a q_i,\quad k_j\leftarrow b k_j\quad\Longrightarrow\quad s_{ij}\leftarrow ab\,s_{ij}`} />
          <p>logits 绝对值很大时，Softmax 容易趋近 one-hot：最大项接近 1，其余项接近 0。结果可能是梯度高度集中、数值范围变宽，并让训练对学习率、初始化和精度更加敏感。</p>
          <aside className="boundary-box"><b>它不是在修复“Attention 不够专注”</b><p>问题不在于模型能否形成尖锐注意力，而在于尖锐程度可能通过无约束地放大 Q/K 范数获得。<QKNormLink /> 让模型更多依靠向量方向和受控的可学习尺度来表达匹配强弱。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>DEFINITION AND POSITION</p><h2>QK-Norm 加在 Attention 的哪一步？</h2></div></div>
          <p>省略 Batch 与 Head 轴时，输入序列矩阵 <Formula inline tex={String.raw`X\in\mathbb R^{T\times d_{\mathrm{model}}}`} /> 先投影为 Q、K、V。随后只对 Q 和 K 做归一化：</p>
          <div className="formula-sequence">
            <div><span>PROJECT</span><Formula className="sequence-latex" tex={String.raw`Q=XW_Q,\quad K=XW_K,\quad V=XW_V`} /></div>
            <div><span>NORMALIZE</span><Formula className="sequence-latex" tex={String.raw`\bar Q=\operatorname{Norm}_Q(Q),\quad \bar K=\operatorname{Norm}_K(K)`} /></div>
            <div><span>SCORE</span><Formula className="sequence-latex" tex={String.raw`S=\frac{\bar Q\bar K^{\mathsf T}}{\sqrt{d_h}}+M`} /></div>
            <div><span>AGGREGATE</span><Formula className="sequence-latex" tex={String.raw`O=\operatorname{softmax}_{\mathrm{row}}(S)V`} /></div>
          </div>
          <aside className="answer-first"><span>这里的 S 不是新增步骤</span><p>普通 Attention 本来就要先得到每个 Query 与所有 Keys 的匹配分数。教程常把这一步直接写进 <Formula inline tex={String.raw`\operatorname{softmax}(QK^{\mathsf T}/\sqrt{d_h})V`} />，所以没有单独命名 <Formula inline tex={String.raw`S`} />。这里把它拆出来，是为了明确显示归一化与 Mask 分别发生在哪里。</p></aside>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3><Formula inline tex={String.raw`\bar Q\bar K^{\mathsf T}`} />：计算所有 Query–Key 匹配</h3><p>若 <Formula inline tex={String.raw`\bar Q,\bar K\in\mathbb R^{T\times d_h}`} />，乘积得到 <Formula inline tex={String.raw`T\times T`} /> 的 score matrix；其中 <Formula inline tex={String.raw`S_{ij}`} /> 表示位置 <Formula inline tex={String.raw`i`} /> 对位置 <Formula inline tex={String.raw`j`} /> 的关注倾向。</p></div></article>
            <article><span>02</span><div><h3><Formula inline tex={String.raw`1/\sqrt{d_h}`} />：控制维度带来的点积尺度</h3><p>它避免 head dimension 增大时 logits 的统计方差同步变大；这也是标准 Scaled Dot-Product Attention 的组成部分。</p></div></article>
            <article><span>03</span><div><h3><Formula inline tex={String.raw`M`} />：禁止不允许访问的位置</h3><p>Decoder 的 Causal Mask 通常令 <Formula inline tex={String.raw`M_{ij}=0`} />（<Formula inline tex={String.raw`j\leq i`} />）而 <Formula inline tex={String.raw`M_{ij}=-\infty`} />（<Formula inline tex={String.raw`j>i`} />）。经过 Softmax 后，未来位置的权重变为 0。Padding Mask 也可合并进 <Formula inline tex={String.raw`M`} />。</p></div></article>
          </div>
          <Formula label="普通 Decoder Attention 与 QK-Norm Attention 的唯一区别" className="compact-latex" tex={String.raw`\underbrace{\operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_h}}+M\right)V}_{\text{普通 Decoder Attention}}\quad\longrightarrow\quad\underbrace{\operatorname{softmax}\!\left(\frac{\bar Q\bar K^{\mathsf T}}{\sqrt{d_h}}+M\right)V}_{\text{加入 QK-Norm}}`} />
          <p>因此，真正由 <QKNormLink /> 新增的只有 <Formula inline tex={String.raw`Q,K\rightarrow\bar Q,\bar K`} /> 这一步。<Formula inline tex={String.raw`S`} /> 只是给中间 score matrix 起的名字；<Formula inline tex={String.raw`M`} /> 属于 Decoder 的因果约束，而不是归一化。如果场景不需要 Mask，可以令 <Formula inline tex={String.raw`M=0`} /> 并从公式中省略。</p>
          <p>Value 不参与 Q–K 点积，因此通常不属于 <QKNormLink />。它仍按 Attention weights 加权汇聚，保留内容幅度供输出投影使用。</p>
          <aside className="text-note"><b>名称描述的是位置，不是唯一算法</b><p>“QK-Norm”表示对 Query/Key 做 Norm。具体实现可以采用 RMSNorm、LayerNorm 或 L2 normalization；必须查看模型配置与实现，不能只凭名字推断公式。Qwen3 采用的是按 head dimension 计算的 RMSNorm 形式。</p></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>PER-HEAD NORMALIZATION</p><h2>它是对整个 Q 矩阵归一化，还是对每个 Head 分别归一化？</h2></div></div>
          <p>现代 Multi-Head Attention 通常把投影结果拆成 heads。对第 <Formula inline tex={String.raw`h`} /> 个 Query head、位置 <Formula inline tex={String.raw`i`} />，有：</p>
          <Formula label="单个 Query/Key head 向量" tex={String.raw`q_{i,h}\in\mathbb R^{d_h\times1},\qquad k_{j,g}\in\mathbb R^{d_h\times1}`} />
          <p>RMSNorm 版本会沿最后的 <Formula inline tex={String.raw`d_h`} /> 个特征计算均方根：</p>
          <Formula label="按 Head Dimension 计算 RMS" tex={String.raw`\operatorname{rms}(q_{i,h})=\sqrt{\frac{1}{d_h}\sum_{r=1}^{d_h}q_{i,h,r}^{,2}+\varepsilon}`} />
          <Formula label="Q/K 分别拥有可学习缩放" className="compact-latex" tex={String.raw`\bar q_{i,h}=\gamma_Q\odot\frac{q_{i,h}}{\operatorname{rms}(q_{i,h})},\qquad \bar k_{j,g}=\gamma_K\odot\frac{k_{j,g}}{\operatorname{rms}(k_{j,g})}`} />
          <p><Formula inline tex={String.raw`\gamma_Q,\gamma_K\in\mathbb R^{d_h}`} /> 是两组独立的可学习参数，<Formula inline tex={String.raw`\varepsilon`} /> 是防止分母过小的固定数值常量。归一化不会跨 token 求均值，也不会把不同 heads 的内容混合起来。</p>
          <aside className="boundary-box"><b>轴选错，含义就变了</b><p>如果把整个 <Formula inline tex={String.raw`T\times d_h`} /> 矩阵一起归一化，不同 token 会相互影响；这不是常见的 QK-Norm。标准实现针对每个 token、每个 head 的最后一维独立处理。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>LOGIT SCALE CONTROL</p><h2>归一化后，Attention logits 为什么更稳定？</h2></div></div>
          <p>先忽略 <Formula inline tex={String.raw`\gamma`} /> 与 <Formula inline tex={String.raw`\varepsilon`} />。RMS 归一化后的向量满足：</p>
          <Formula label="RMS 归一化后的平方范数" tex={String.raw`\frac{1}{d_h}\sum_{r=1}^{d_h}\bar q_{i,h,r}^{,2}=1\quad\Longrightarrow\quad\lVert\bar q_{i,h}\rVert_2=\sqrt{d_h}`} />
          <p>由 Cauchy–Schwarz 不等式：</p>
          <Formula label="归一化点积的上界" tex={String.raw`\left|\frac{\bar q_{i,h}^{\mathsf T}\bar k_{j,g}}{\sqrt{d_h}}\right|\leq\frac{\lVert\bar q_{i,h}\rVert_2\lVert\bar k_{j,g}\rVert_2}{\sqrt{d_h}}=\sqrt{d_h}`} />
          <p>这个理想化上界不会随着原始 <Formula inline tex={String.raw`q,k`} /> 范数任意增长。实际 RMSNorm 带可学习的逐维 <Formula inline tex={String.raw`\gamma_Q,\gamma_K`} />，所以并非严格固定范数；但原始投影尺度被显式除掉，剩余尺度受到更直接、结构化的参数控制。</p>
          <div className="compare-columns">
            <article><span>WITHOUT QK-NORM</span><h3>内容方向与向量长度共同决定 score</h3><p>模型既能转动向量，也能通过放大两个范数成倍增大 logits。</p></article>
            <article className="accent-card"><span>WITH QK-NORM</span><h3>主要保留方向，尺度单独受控</h3><p>原始范数被压回稳定范围，方向信息和可学习缩放继续决定匹配。</p></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>WHY BOTH Q AND K</p><h2>为什么 Query 与 Key 要分别归一化？</h2></div></div>
          <p>未归一化 score 同时受到两端范数影响：</p>
          <Formula label="Q/K 两端共同决定 logit 尺度" tex={String.raw`s_{ij}=\frac{\lVert q_i\rVert_2\lVert k_j\rVert_2}{\sqrt{d_h}}\cos\phi_{ij}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>只归一化 Q</h3><p>可以移除每个 Query 自身的长度变化，但不同 Keys 仍能通过增大 <Formula inline tex={String.raw`\lVert k_j\rVert_2`} /> 普遍抬高匹配强度。</p></div></article>
            <article><span>02</span><div><h3>只归一化 K</h3><p>可以约束被检索向量的长度，但不同 Queries 仍能通过 <Formula inline tex={String.raw`\lVert q_i\rVert_2`} /> 控制整行 logits 的温度。</p></div></article>
            <article><span>03</span><div><h3>Q、K 分别归一化</h3><p>移除两端原始范数的乘性耦合，让相似方向和显式缩放参数成为主要信号。</p></div></article>
          </div>
          <p>不直接归一化 <Formula inline tex={String.raw`QK^{\mathsf T}`} />，是因为 score matrix 已经把每个 Query–Key 对混合在一起。对 logits 做行级标准化会改变不同 Keys 之间的相对结构，并且无法阻止产生这些 logits 之前的 Q/K 数值变大。</p>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>ORDER WITH ROPE</p><h2>QK-Norm 与 RoPE 谁先谁后？</h2></div></div>
          <p>一种常见计算顺序是先投影，再按 head 归一化，最后施加 RoPE：</p>
          <Formula label="Norm → RoPE → Dot Product" className="compact-latex" tex={String.raw`q_i=W_Q^{\mathsf T}x_i,\quad \bar q_i=\operatorname{Norm}_Q(q_i),\quad \widetilde q_i=R(i\theta)\bar q_i`} />
          <Formula className="compact-latex" tex={String.raw`k_j=W_K^{\mathsf T}x_j,\quad \bar k_j=\operatorname{Norm}_K(k_j),\quad \widetilde k_j=R(j\theta)\bar k_j`} />
          <Formula label="最终 Attention score" tex={String.raw`s_{ij}=\frac{\widetilde q_i^{\mathsf T}\widetilde k_j}{\sqrt{d_h}}=\frac{\bar q_i^{\mathsf T}R((j-i)\theta)\bar k_j}{\sqrt{d_h}}`} />
          <p>理想的二维旋转块是正交矩阵，因此保持 L2 范数：<Formula inline tex={String.raw`\lVert R(i\theta)z\rVert_2=\lVert z\rVert_2`} />。但 RMSNorm 还包含逐维 <Formula inline tex={String.raw`\gamma`} />，而 RoPE 与逐维缩放一般不可交换，所以实现顺序仍然重要。</p>
          <aside className="text-note"><b>不要仅靠名称猜顺序</b><p>不同模型可能采用不同 Norm 类型、放置方式或 fused kernel。阅读具体模型时，应检查“reshape heads → norm → rotary embedding → dot product”的真实调用链。Qwen3 的常见实现是先对拆分后的 Q/K heads 做 RMSNorm，再应用 RoPE。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>NOT A SOFTMAX REPLACEMENT</p><h2>它与缩放因子、温度和 Softmax 有什么区别？</h2></div></div>
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>机制</th><th>作用位置</th><th>主要作用</th></tr></thead>
              <tbody>
                <tr><td><Formula inline tex={String.raw`1/\sqrt{d_h}`} /></td><td>点积之后</td><td>抵消 head dimension 带来的统计尺度增长</td></tr>
                <tr><td><QKNormLink /></td><td>点积之前</td><td>移除每个 Q/K 向量原始范数的漂移</td></tr>
                <tr><td>Temperature</td><td>logits 上</td><td>整体调节 Softmax 分布的尖锐程度</td></tr>
                <tr><td>Softmax</td><td>每行 scores 上</td><td>转为非负且和为 1 的 Attention weights</td></tr>
              </tbody>
            </table>
          </div>
          <Formula label="完整关系" tex={String.raw`\alpha_{ij}=\operatorname{softmax}_j\!\left(\frac{\bar q_i^{\mathsf T}\bar k_j}{\tau\sqrt{d_h}}+M_{ij}\right)`} />
          <p><Formula inline tex={String.raw`\tau`} /> 是可选温度，<Formula inline tex={String.raw`M_{ij}`} /> 是 Causal/Padding Mask。四者处理的是不同问题，可以同时存在。<QKNormLink /> 不会建立概率分布，也不会执行因果遮挡。</p>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>RELATION TO OTHER MODULES</p><h2>QK-Norm 与 RMSNorm、QKV Bias、GQA 有什么关系？</h2></div></div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>与 block RMSNorm</h3><p>Pre-Norm 处理进入 Attention/FFN 的整段 hidden state；<QKNormLink /> 处理投影并拆分 head 后的 Q/K。底层都可使用 RMSNorm，但对象、维度和目标不同。</p></div></article>
            <article><span>02</span><div><h3>与 QKV Bias</h3><p>Bias 决定 Q/K/V 投影是否拥有可学习偏移；Norm 决定投影结果怎样控制尺度。若 Bias 位于 Norm 之前，它也会参与 RMS 计算并影响最终方向。</p></div></article>
            <article><span>03</span><div><h3>与 GQA</h3><p>GQA 改变 Q heads 与 KV heads 的共享映射；Norm 仍对每个实际 Q/K head 向量沿 <Formula inline tex={String.raw`d_h`} /> 处理，不改变共享关系。</p></div></article>
            <article><span>04</span><div><h3>与 RoPE</h3><p>RoPE 注入相对位置信息，Norm 控制点积前的尺度。二者互补，不能互相替代。</p></div></article>
          </div>
          <aside className="qwen-connection"><span>KNOWLEDGE LINKS</span><p>分别查看基础模块：<a href="/normalization/rmsnorm">RMSNorm</a>、<a href="/attention/qkv-bias">QKV Bias</a>、<a href="/attention/gqa">GQA</a> 与 <a href="/position-encoding/rope">RoPE</a>。</p></aside>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>BENEFITS AND BOUNDARIES</p><h2>QK-Norm 带来了什么，又不能解决什么？</h2></div></div>
          <div className="compare-columns">
            <article className="accent-card"><span>WHAT IT CONTROLS</span><h3>直接控制 Attention 数值路径</h3><ul><li>减少 Q/K 原始范数漂移</li><li>降低 logits 无约束放大的风险</li><li>让训练对大规模和低精度更稳健</li><li>把方向与尺度的学习部分解耦</li></ul></article>
            <article><span>WHAT IT DOES NOT SOLVE</span><h3>不等于所有 Attention 问题的答案</h3><ul><li>不扩大上下文窗口</li><li>不减少 KV Cache</li><li>不改善 GQA 的共享粒度</li><li>不保证模型一定检索到正确 token</li></ul></article>
          </div>
          <p>Qwen3 将它作为 Attention 架构更新之一：相较 Qwen2，移除 QKV Bias，并引入 <QKNormLink /> 以支持稳定训练。这是完整训练系统中的组合选择，不能据此断言“只加入一个 Norm 就一定提升模型能力”。</p>
          <aside className="boundary-box"><b>能力与稳定性要分开</b><p>它首先是一种优化与数值稳定设计。更稳定的训练可能让模型成功扩大规模或使用更激进的训练配置，但最终能力仍由数据、参数规模、优化过程和其他架构共同决定。</p></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>QK-Norm 与 Transformer block 外层的 RMSNorm 是一回事吗？</summary><div><p>不是同一个位置。block 的 Pre-Norm 对 <Formula inline tex={String.raw`d_{\mathrm{model}}`} /> 维 hidden state 归一化，然后才进入整个 Attention；<QKNormLink /> 在 Q/K 投影和 head 拆分后，对每个 <Formula inline tex={String.raw`d_h`} /> 维 head 向量归一化。两者可以使用相同 RMSNorm 原理并同时存在。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>为什么要分别归一化 Q 和 K，而不是归一化 QKᵀ？</summary><div><p>分别处理 Q/K 可以在点积形成之前移除两端原始范数的乘性耦合。对 <Formula inline tex={String.raw`QK^{\mathsf T}`} /> 再做行级 Norm 已经混合了所有 Query–Key pairs，会改变 score 的相对结构，也没有约束上游 Q/K 自身的数值范围。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>QK-Norm 会不会消除 Query 和 Key 携带的信息？</summary><div><p>它主要移除“整体长度”这一自由度，不会把所有向量变成同一个向量。不同 token 的方向、各维相对比例以及可学习 <Formula inline tex={String.raw`\gamma`} /> 仍然保留，因此内容差异仍能进入点积。不过原始范数中若携带信息，模型需要改用方向或显式尺度参数来表达。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>使用 RMSNorm 后，Attention score 一定落在负一到一吗？</summary><div><p>不一定。L2 单位归一化后的纯点积才自然落在 <Formula inline tex={String.raw`[-1,1]`} />。RMSNorm 令未加缩放时的向量 L2 范数约为 <Formula inline tex={String.raw`\sqrt{d_h}`} />，并且还有可学习 <Formula inline tex={String.raw`\gamma`} />，所以它是控制尺度而不是强制 cosine score。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>归一化应该放在 RoPE 之前还是之后？</summary><div><p>取决于具体模型，不能脱离实现一概而论。Qwen3 的常见实现先按 head dimension 归一化 Q/K，再应用 RoPE。虽然纯旋转保持 L2 范数，但 RMSNorm 的逐维缩放与旋转一般不可交换，因此顺序会影响结果。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>QK-Norm 能替代除以根号 d_h 或 Softmax 吗？</summary><div><p>不能。Norm 控制每个 Q/K 向量进入点积前的尺度，<Formula inline tex={String.raw`1/\sqrt{d_h}`} /> 处理维度带来的统计尺度，Softmax 把一行 logits 变成概率权重。三者所在步骤和数学作用都不同。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>QK-Norm 与 cosine attention 是一回事吗？</summary><div><p>只有使用严格 L2 单位归一化，并把 score 写为归一化向量点积时，才直接等价于 cosine similarity。RMSNorm 不减均值、目标 RMS 为 1，而且通常含逐维可学习缩放，因此与纯 cosine attention 相关但不完全相同。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>GQA 中 Query heads 和 KV heads 数不同，怎样归一化？</summary><div><p>先分别对每个 Q head 和每个实际 KV head 沿 <Formula inline tex={String.raw`d_h`} /> 归一化，再按 GQA 映射让多个 Q heads 读取同一个 K/V head。归一化不需要复制 K/V，也不会把 <Formula inline tex={String.raw`n_{kv}`} /> 改成 <Formula inline tex={String.raw`n_q`} />。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>Qwen3 为什么同时移除 QKV Bias 并加入 QK-Norm？</summary><div><p>这是 Attention 数值设计的一次组合调整：移除投影中的常量偏移路径，同时显式约束 Q/K 点积尺度。Qwen3 报告把 QK-Norm 的目的描述为确保稳定训练，但没有证明两项改动中任何一项单独解释全部效果，因此不能做简单的单变量归因。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span><Formula inline tex={String.raw`S=\bar Q\bar K^{\mathsf T}/\sqrt{d_h}+M`} /> 是 QK-Norm 新增的步骤吗？</summary><div><p>不是。普通 Scaled Dot-Product Attention 本来就会计算 <Formula inline tex={String.raw`QK^{\mathsf T}/\sqrt{d_h}`} />；Decoder 还会在 Softmax 前加入 Causal/Padding Mask <Formula inline tex={String.raw`M`} />。很多简写公式没有单独定义 <Formula inline tex={String.raw`S`} />，而是直接把它放进 Softmax。QK-Norm 真正新增的是先把 <Formula inline tex={String.raw`Q,K`} /> 变成 <Formula inline tex={String.raw`\bar Q,\bar K`} />，其余 score、Mask、Softmax 和 Value 聚合步骤仍属于普通 Attention。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>实现、技术报告与基础论文</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2505.09388" target="_blank" rel="noreferrer">Qwen3 Technical Report</a><span>2025</span></li>
            <li><a href="https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen3/modeling_qwen3.py" target="_blank" rel="noreferrer">Qwen3 Reference Implementation</a><span>Hugging Face</span></li>
            <li><a href="https://arxiv.org/abs/2302.05442" target="_blank" rel="noreferrer">Scaling Vision Transformers to 22 Billion Parameters</a><span>QK normalization</span></li>
            <li><a href="https://arxiv.org/abs/2010.04245" target="_blank" rel="noreferrer">Query-Key Normalization for Transformers</a><span>L2 variant</span></li>
            <li><a href="https://arxiv.org/abs/1910.07467" target="_blank" rel="noreferrer">Root Mean Square Layer Normalization</a><span>RMSNorm</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从 Attention 的尺度控制继续理解 QKV Bias、RoPE、GQA 与普通 RMSNorm。</strong></div>
          <div className="footer-links"><a href="/attention/qkv-bias">QKV Bias ↗</a><a href="/position-encoding/rope">RoPE ↗</a><a href="/normalization/rmsnorm">RMSNorm ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "10" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>10 章</span><div><i></i></div><small>公式密度 · 中高</small></div>
      </aside>
    </div>
  );
}
