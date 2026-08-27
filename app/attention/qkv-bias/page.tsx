import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 QKV Bias？";
const description = "从仿射投影、Attention score 与 Softmax 出发，理解 Query、Key、Value 三个 Bias 分别做了什么，以及 Qwen 为什么从保留走向移除。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "Bias 加在哪里"],
  ["02", "形状与广播"],
  ["03", "Query Bias 的作用"],
  ["04", "Key Bias 的特殊性"],
  ["05", "Value Bias 的作用"],
  ["06", "与位置和归一化的关系"],
  ["07", "参数量与 KV Cache"],
  ["08", "为什么保留或移除"],
  ["09", "Qwen 中的演进"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "QKV Bias 是可学习参数吗？每个 token 都不同吗？",
  "QKV Bias 和 Causal Mask、Attention Bias 是一回事吗？",
  "为什么没有 RoPE 时，Key Bias 可能被 Softmax 抵消？",
  "有 RoPE 后，Key Bias 为什么又可能产生影响？",
  "Value Bias 是否只是给输出加一个常量？",
  "移除 QKV Bias 会降低 KV Cache 大小吗？",
  "QKV Bias 与 GQA 的 head 共享有什么关系？",
  "QKV Bias 包含输出投影的 Bias 吗？",
  "为什么 Qwen2.5 保留 QKV Bias，Qwen3 又将它移除？",
];

export default function QKVBiasPage() {
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
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a className="selected" href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article qkv-bias-article">
        <section className="hero rms-hero qkv-bias-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 注意力机制与 KV Cache <span>/</span> QKV Bias</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 008</span></div>
          <p className="original-question">“Q、K、V 已经由权重矩阵投影出来了，为什么还要加 Bias？三个 Bias 分别改变什么？为什么早期 Qwen 保留它，Qwen3 又将它移除？”</p>
          <div className="eyebrow"><span></span> ATTENTION PROJECTION · 01</div>
          <h1>什么是 QKV Bias？</h1>
          <p className="dek">QKV Bias 是 Query、Key、Value 三个线性投影中的可学习偏置向量。它把穿过原点的线性映射变成仿射映射，让每个 Attention head 在输入贡献之外拥有一份对所有 token 共享的基线偏移。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>27 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first"><span>一句话答案</span><p>没有 Bias 时，<Formula inline tex={String.raw`q_i=x_iW_Q`} />；加入 Bias 后，<Formula inline tex={String.raw`q_i=x_iW_Q+b_Q`} />。<Formula inline tex={String.raw`b_Q,b_K,b_V`} /> 都是训练得到、对 token 维广播的向量，但它们对 Attention 的影响并不相同：Query Bias 改变“如何提问”，Key Bias 改变“如何被匹配”，Value Bias 则改变“被读取后带回什么基线内容”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>FROM LINEAR TO AFFINE</p><h2>Bias 具体加在 Attention 的哪一步？</h2></div></div>
          <p>Self-Attention 先把 hidden states <Formula inline tex={String.raw`X`} /> 投影为 Query、Key、Value。没有 Bias 时，这是线性映射；加入 Bias 后，它变成仿射映射：</p>
          <div className="formula-sequence">
            <div><span>QUERY</span><Formula className="sequence-latex" tex={String.raw`Q=XW_Q+\mathbf 1_Tb_Q^{\mathsf T}`} /></div>
            <div><span>KEY</span><Formula className="sequence-latex" tex={String.raw`K=XW_K+\mathbf 1_Tb_K^{\mathsf T}`} /></div>
            <div><span>VALUE</span><Formula className="sequence-latex" tex={String.raw`V=XW_V+\mathbf 1_Tb_V^{\mathsf T}`} /></div>
          </div>
          <p><Formula inline tex={String.raw`\mathbf 1_T`} /> 是长度为 <Formula inline tex={String.raw`T`} /> 的全 1 向量，表示同一个 Bias 会复制到序列中的每一行。对第 <Formula inline tex={String.raw`i`} /> 个 token，可以更直观地写为：</p>
          <Formula label="单个 token 的 QKV 投影" tex={String.raw`q_i=x_iW_Q+b_Q,\qquad k_i=x_iW_K+b_K,\qquad v_i=x_iW_V+b_V`} />
          <aside className="boundary-box"><b>Bias 不是额外输入 token</b><p>它是线性层内部的一组参数，不占用上下文长度，也不会在文本中出现。训练开始时常初始化为 0，随后与权重矩阵一起通过梯度更新。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>SHAPES AND BROADCASTING</p><h2>为什么一个 Bias 可以加到整段序列上？</h2></div></div>
          <p>设模型宽度为 <Formula inline tex={String.raw`d_{\mathrm{model}}`} />，Query heads 数为 <Formula inline tex={String.raw`n_q`} />，KV heads 数为 <Formula inline tex={String.raw`n_{kv}`} />，每个 head 维度为 <Formula inline tex={String.raw`d_h`} />。在 GQA 中，三个投影的输出维度可以不同：</p>
          <Formula label="Q、K、V 的输出宽度" tex={String.raw`d_Q=n_qd_h,\qquad d_K=d_V=n_{kv}d_h`} />
          <Formula label="Bias 的形状" tex={String.raw`b_Q\in\mathbb R^{d_Q},\qquad b_K,b_V\in\mathbb R^{d_K}`} />
          <p>矩阵 <Formula inline tex={String.raw`Q\in\mathbb R^{T\times d_Q}`} /> 有 <Formula inline tex={String.raw`T`} /> 行，而 <Formula inline tex={String.raw`b_Q`} /> 只有一行。张量广播会把同一个 <Formula inline tex={String.raw`b_Q`} /> 加到所有 token 上；不同 heads 对应 Bias 向量中的不同切片。</p>
          <aside className="text-note"><b>共享与不共享</b><p>Bias 在 token 之间共享，但不同层、Q/K/V 分支和 head 切片拥有不同参数。因此它不是“每个 token 一个 Bias”，也不是“整个模型只有一个 Bias”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>QUERY BIAS</p><h2>Query Bias 如何改变 Attention score？</h2></div></div>
          <p>先暂时忽略 RoPE 和 <a className="term-link" href="/attention/qk-norm">QK-Norm</a>。一个 Query 与一个 Key 的未缩放点积为：</p>
          <Formula label="带 Q/K Bias 的点积展开" className="compact-latex" tex={String.raw`\begin{aligned}q_ik_j^{\mathsf T}&=(x_iW_Q+b_Q)(x_jW_K+b_K)^{\mathsf T}\\&=(x_iW_Q)(x_jW_K)^{\mathsf T}+(x_iW_Q)b_K^{\mathsf T}+b_Q(x_jW_K)^{\mathsf T}+b_Qb_K^{\mathsf T}.\end{aligned}`} />
          <p>其中 <Formula inline tex={String.raw`b_Q(x_jW_K)^{\mathsf T}`} /> 会随 Key 内容 <Formula inline tex={String.raw`x_j`} /> 改变。即使两个 token 产生相同的内容 Query 部分 <Formula inline tex={String.raw`x_iW_Q`} />，Query Bias 也会为这个 head 增加一份共享的“默认查询方向”，从而改变它对不同 Keys 的相对偏好。</p>
          <aside className="boundary-box"><b>几何直觉</b><p>无 Bias 的投影把输入空间的原点映射到 Q 空间原点；加入 <Formula inline tex={String.raw`b_Q`} /> 后，整个 Query 点云会发生平移。它增加表达自由度，但不意味着模型一定需要这份自由度。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>KEY BIAS AND SOFTMAX</p><h2>为什么 Key Bias 在简化 Attention 中可能被抵消？</h2></div></div>
          <p>对固定 Query <Formula inline tex={String.raw`q_i`} />，如果每个 Key 都只是在内容投影后加同一个 <Formula inline tex={String.raw`b_K`} />，则：</p>
          <Formula label="Key Bias 对同一行所有 logits 增加相同常数" tex={String.raw`S_{ij}=q_i(x_jW_K+b_K)^{\mathsf T}=q_i(x_jW_K)^{\mathsf T}+q_ib_K^{\mathsf T}`} />
          <p>第二项与 Key 位置 <Formula inline tex={String.raw`j`} /> 无关。Softmax 对整行同时加常数不敏感：</p>
          <Formula label="Softmax 的平移不变性" tex={String.raw`\operatorname{softmax}_j(a_{ij}+c_i)=\operatorname{softmax}_j(a_{ij})`} />
          <p>因此在<b>没有 RoPE、没有 <a className="term-link" href="/attention/qk-norm">QK-Norm</a>、Bias 对所有位置完全相同</b>的简化模型里，<Formula inline tex={String.raw`b_K`} /> 不改变这一行的 attention weights。这不代表真实 LLM 中的 Key Bias 永远无效。</p>
          <aside className="answer-first"><span>为什么真实模型不同？</span><p>RoPE 会按位置旋转完整 Key：<Formula inline tex={String.raw`\widetilde k_j=R(j\theta)(x_jW_K+b_K)`} />。于是 Bias 部分也被不同角度旋转，<Formula inline tex={String.raw`q_i^{\mathsf T}R(j\theta)b_K`} /> 会随 <Formula inline tex={String.raw`j`} /> 改变，不再是可被 Softmax 抵消的统一常数。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>VALUE BIAS</p><h2>Value Bias 如何进入 Attention 输出？</h2></div></div>
          <p>设 Attention 权重为 <Formula inline tex={String.raw`\alpha_{ij}`} />，并满足每一行权重和为 1。Value Bias 会在加权求和后完整保留下来：</p>
          <Formula label="Value Bias 的加权结果" tex={String.raw`\begin{aligned}o_i&=\sum_j\alpha_{ij}(x_jW_V+b_V)\\&=\sum_j\alpha_{ij}x_jW_V+\left(\sum_j\alpha_{ij}\right)b_V\\&=\sum_j\alpha_{ij}x_jW_V+b_V.\end{aligned}`} />
          <p>所以在标准 Softmax Attention 中，<Formula inline tex={String.raw`b_V`} /> 不决定“关注谁”，而是给每个 head 聚合出的内容增加同一份基线向量。随后它还会经过 head 拼接与输出投影 <Formula inline tex={String.raw`W_O`} />。</p>
          <aside className="text-note"><b>它不是无条件没有意义</b><p>后续输出投影、残差与归一化会继续处理这份偏移。模型也可能通过其他权重学习到相似效果，因此是否保留 <Formula inline tex={String.raw`b_V`} /> 是表达能力、稳定性和简洁性之间的架构取舍。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>POSITION AND NORMALIZATION</p><h2>RoPE、<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 会怎样改变 Bias 的效果？</h2></div></div>
          <p>现代 Decoder Attention 通常不是“投影后立刻点积”。Q/K 还会经过 RoPE，有些模型还会加入 <a className="term-link" href="/attention/qk-norm">QK-Norm</a>。概念顺序可写为：</p>
          <Formula label={<>带 Bias、<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 与 RoPE 的一种常见顺序</>} className="compact-latex" tex={String.raw`\begin{aligned}q_i&=x_iW_Q+b_Q,&k_j&=x_jW_K+b_K,\\\bar q_i&=\operatorname{Norm}(q_i),&\bar k_j&=\operatorname{Norm}(k_j),\\\widetilde q_i&=R(i\theta)\bar q_i,&\widetilde k_j&=R(j\theta)\bar k_j.\end{aligned}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>RoPE 使 Bias 具有位置相位</h3><p>同一 Bias 向量会在不同位置被不同角度旋转，因此它对 score 的影响可能随相对位置改变。</p></div></article>
            <article><span>02</span><div><h3><a className="term-link" href="/attention/qk-norm">QK-Norm</a> 是非线性尺度处理</h3><p>加入 Bias 后再归一化，不等于“归一化内容后再加 Bias”。Bias 会参与范数计算并改变最终方向。</p></div></article>
            <article><span>03</span><div><h3>不能孤立判断某个 Bias</h3><p>同一 Bias 在纯点积、RoPE、<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 或其他位置机制下可能表现不同，必须结合完整计算顺序分析。</p></div></article>
          </div>
          <aside className="boundary-box"><b>QKV Bias 不等于 Attention Bias</b><p>QKV Bias 是投影层参数 <Formula inline tex={String.raw`b_Q,b_K,b_V`} />；Causal Mask、ALiBi 或 relative position bias 则通常以矩阵 <Formula inline tex={String.raw`B_{ij}`} /> 的形式直接加到 attention logits。二者所在位置和作用机制不同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>PARAMETERS AND CACHE</p><h2>QKV Bias 会增加多少参数和 KV Cache？</h2></div></div>
          <p>在 GQA 中，QKV Bias 的总参数量为：</p>
          <Formula label="每层 QKV Bias 参数量" tex={String.raw`P_{\mathrm{bias}}=(n_q+2n_{kv})d_h`} />
          <p>对应三组投影矩阵的参数量约为：</p>
          <Formula label="每层 QKV 投影矩阵参数量" tex={String.raw`P_{\mathrm{matrix}}=d_{\mathrm{model}}(n_q+2n_{kv})d_h`} />
          <Formula label="Bias 相对投影矩阵的占比" tex={String.raw`\frac{P_{\mathrm{bias}}}{P_{\mathrm{matrix}}}=\frac{1}{d_{\mathrm{model}}}`} />
          <p>当 <Formula inline tex={String.raw`d_{\mathrm{model}}=4096`} /> 时，这个比例约为 <Formula inline tex={String.raw`0.024\%`} />，通常非常小。Bias 会被直接加进 K/V 数值，但不会改变 K/V 张量的 shape，所以不会让每个 token 多缓存一份独立 Bias。</p>
          <aside className="answer-first"><span>结论</span><p>移除 QKV Bias 可以略微减少模型参数和算子分支，但几乎不会改变 KV Cache 容量。KV Cache 主要由层数、序列长度、KV heads 数和 head dimension 决定。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>ARCHITECTURE TRADE-OFF</p><h2>为什么一些模型保留 Bias，另一些选择移除？</h2></div></div>
          <div className="compare-columns">
            <article className="accent-card"><span>KEEP BIAS</span><h3>增加仿射表达自由度</h3><ul><li>允许每个投影学习共享的基线方向</li><li>不要求投影结果必须穿过原点</li><li>参数成本相对于大矩阵很低</li><li>可以与位置机制共同形成额外偏移模式</li></ul></article>
            <article><span>REMOVE BIAS</span><h3>简化尺度与数值路径</h3><ul><li>减少持续叠加的常量偏移</li><li>让投影保持更纯粹的线性结构</li><li>便于与 RMSNorm、<a className="term-link" href="/attention/qk-norm">QK-Norm</a> 配合分析</li><li>在大规模模型中额外自由度未必必要</li></ul></article>
          </div>
          <p>不能只根据“有 Bias”判断模型更强，也不能只根据“无 Bias”判断训练更稳定。模型可以通过相邻层权重学习部分相似作用，而 Bias 与 Norm、RoPE、残差结构和初始化存在耦合。是否保留通常来自完整训练实验，而不是单一公式的必然结论。</p>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>BACK TO QWEN</p><h2>QKV Bias 在 Qwen 演进中发生了什么变化？</h2></div></div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>初代 Qwen：只在 QKV 投影保留 Bias</h3><p>官方技术说明称，大部分层移除 Bias，但在 Attention 的 QKV 层加入 Bias；报告将增强模型外推能力列为当时的设计动机。输入 embedding 与输出 projection 也不共享参数。</p></div></article>
            <article><span>02</span><div><h3>Qwen2 / Qwen2.5：继续保留</h3><p>Qwen2.5 技术报告仍把 QKV Bias 与 GQA、RoPE、RMSNorm、SwiGLU 一起列为 Dense 模型的基础架构组件。</p></div></article>
            <article><span>03</span><div><h3>Qwen3：移除 QKV Bias，引入 <a className="term-link" href="/attention/qk-norm">QK-Norm</a></h3><p>Qwen3 技术报告明确说明移除 Qwen2 使用的 QKV Bias，并在 Attention 中加入 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 以确保稳定训练。它是整套 Attention 数值设计的调整，不能理解为简单节省参数。</p></div></article>
          </div>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>这条变化说明现代 LLM 架构不是只会不断“加模块”：当训练规模、归一化方法和位置机制变化后，早期有用的自由度也可能被重新评估并移除。</p><a href="/#chapter-1">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>QKV Bias 是可学习参数吗？每个 token 都不同吗？</summary><div><p>它是可学习参数，会与权重矩阵一起接受梯度更新。同一层同一投影中的 Bias 对所有 token 广播，因此不是每个 token 一份；但不同层、Q/K/V 分支和 head 切片拥有各自的 Bias 参数。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>QKV Bias 和 Causal Mask、Attention Bias 是一回事吗？</summary><div><p>不是。QKV Bias 位于投影层中，产生 <Formula inline tex={String.raw`XW+b`} />；Causal Mask 或相对位置 Bias 通常直接加到 score matrix：<Formula inline tex={String.raw`S_{ij}+B_{ij}`} />。前者改变 Q/K/V 表示，后者改变特定 Query–Key 对的 logit。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>为什么没有 RoPE 时，Key Bias 可能被 Softmax 抵消？</summary><div><p>对固定 Query，统一的 <Formula inline tex={String.raw`b_K`} /> 会给这一行所有 logits 增加相同常数 <Formula inline tex={String.raw`q_ib_K^{\mathsf T}`} />。Softmax 对整行平移不敏感，所以 attention weights 不变。这个结论依赖简化条件，不能直接推广到带 RoPE 或 <a className="term-link" href="/attention/qk-norm">QK-Norm</a> 的真实模型。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>有 RoPE 后，Key Bias 为什么又可能产生影响？</summary><div><p>RoPE 会按位置 <Formula inline tex={String.raw`j`} /> 旋转整个 Key，包括 Bias：<Formula inline tex={String.raw`R(j\theta)b_K`} />。不同位置得到不同旋转方向，因此 Bias 对 score 的贡献不再是整行相同常数，不能被 Softmax 简单抵消。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>Value Bias 是否只是给输出加一个常量？</summary><div><p>在标准 Softmax 权重和为 1 的条件下，每个 head 的聚合结果确实会完整保留一份 <Formula inline tex={String.raw`b_V`} />。但它随后还会通过输出投影、残差与后续层，因此对最终模型而言仍是一份可学习的基线偏移，而不是可以随意忽略的文本常量。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>移除 QKV Bias 会降低 KV Cache 大小吗？</summary><div><p>不会显著降低。Bias 已经融合进每个 K/V 向量，是否存在 Bias 不改变缓存张量的维度。移除它只减少极少量模型参数；降低 KV Cache 更依赖 GQA/MQA、量化、滑窗或状态压缩。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>QKV Bias 与 GQA 的 head 共享有什么关系？</summary><div><p>GQA 决定多个 Query heads 如何共享较少的 K/V heads；QKV Bias 决定各投影是否加入偏置。采用 GQA 时，<Formula inline tex={String.raw`b_K,b_V`} /> 的长度随 KV heads 数减少，但 Bias 本身不会改变共享规则。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>QKV Bias 包含输出投影的 Bias 吗？</summary><div><p>通常不包含。QKV Bias 专指生成 Query、Key、Value 的三个输入投影偏置。Attention 聚合后的输出投影 <Formula inline tex={String.raw`W_O`} /> 是否带 <Formula inline tex={String.raw`b_O`} /> 是另一项独立配置。初代 Qwen 的“除 QKV 外无 Bias”意味着输出投影也不保留 Bias。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>为什么 Qwen2.5 保留 QKV Bias，Qwen3 又将它移除？</summary><div><p>这是完整架构与训练系统演进后的经验取舍。Qwen2.5 延续早期 Qwen 的投影设计；Qwen3 同时移除 QKV Bias 并引入 <a className="term-link" href="/attention/qk-norm">QK-Norm</a>，把 Attention 稳定性更多交给显式范数约束。官方报告没有证明“移除 Bias 单独导致全部提升”，因此不应把两代差异归因于一个开关。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>Qwen 官方资料与基础论文</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
            <li><a href="https://github.com/QwenLM/Qwen/blob/main/tech_memo.md" target="_blank" rel="noreferrer">Qwen Official Technical Memo</a><span>GitHub</span></li>
            <li><a href="https://arxiv.org/abs/2412.15115" target="_blank" rel="noreferrer">Qwen2.5 Technical Report</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2505.09388" target="_blank" rel="noreferrer">Qwen3 Technical Report</a><span>2025</span></li>
            <li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Attention Is All You Need</a><span>2017</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从投影 Bias 继续理解 <a className="term-link" href="/attention/qk-norm">QK-Norm</a>、GQA 与 RoPE 如何共同塑造 Attention。</strong></div>
          <div className="footer-links"><a href="/attention/qk-norm">QK-Norm ↗</a><a href="/attention/gqa">GQA ↗</a><a href="/position-encoding/rope">RoPE ↗</a><a href="/normalization/rmsnorm">RMSNorm ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "10" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>10 章</span><div><i></i></div><small>公式密度 · 中等</small></div>
      </aside>
    </div>
  );
}
