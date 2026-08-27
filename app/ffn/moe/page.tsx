import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 MoE？";
const description = "从 Dense FFN、Router 与 Top-k 路由出发，理解 MoE 的总参数、激活参数、负载均衡、细粒度专家以及 Shared/Routed Experts。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "从 Dense FFN 到 MoE"],
  ["02", "Router 与 Top-k"],
  ["03", "参数量与计算量"],
  ["04", "专家为何会分工"],
  ["05", "负载均衡与容量"],
  ["06", "细粒度与共享专家"],
  ["07", "训练和部署代价"],
  ["08", "与 Qwen 的关系"],
  ["09", "SFT 路由漂移与知识干扰"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "MoE 的 Expert 是一个完整模型吗？",
  "总参数很大，为什么每个 token 的计算量仍然较小？",
  "同一个 token 在每一层都会进入相同 Experts 吗？",
  "Top-k 选择不可导，Router 如何训练？",
  "什么是 Expert Collapse？",
  "Shared Experts 和 Routed Experts 有什么区别？",
  "Fine-grained Experts 为什么能增加组合能力？",
  "MoE 一定比同等激活参数的 Dense 模型更快吗？",
  "模型名称中的 A14B、A3B 表示什么？",
  "一个句子有很多 token，MoE 会分别路由后再把结果拼起来吗？",
];

export default function MoEPage() {
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
        <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a className="selected" href="/ffn/moe">MoE</a></div>
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article moe-article">
        <section className="hero rms-hero moe-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 激活函数与前馈网络 <span>/</span> MoE</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 006</span></div>
          <p className="original-question">“什么是 MoE？为什么模型可以拥有非常大的总参数量，却只让每个 token 激活其中一小部分？细粒度、Shared 与 Routed Experts 又分别解决什么问题？”</p>
          <div className="eyebrow"><span></span> MIXTURE OF EXPERTS · 01</div>
          <h1>什么是 MoE？</h1>
          <p className="dek">Mixture of Experts 用多组相互独立的 FFN 作为 Experts，再由 Router 为每个 token 选择少数 Experts。它用稀疏激活把“模型能容纳多少参数”与“一个 token 实际计算多少参数”部分解耦。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>26 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first"><span>一句话答案</span><p>Dense FFN 让所有 token 经过同一套参数；MoE 准备 <Formula inline tex={String.raw`N`} /> 个 Experts，但 Router 通常只为每个 token 激活 Top-<Formula inline tex={String.raw`k`} /> 个，因此总参数可随 <Formula inline tex={String.raw`N`} /> 增长，单 token 的主要 Expert 计算却更接近 <Formula inline tex={String.raw`k`} /> 个 Experts。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>FROM DENSE TO SPARSE FFN</p><h2>MoE 替换了 Transformer 的哪一部分？</h2></div></div>
          <p>在多数 Decoder LLM 中，MoE 主要替换 Transformer block 里的 FFN，而不是替换 Self-Attention。Dense 模型的每一层只有一套 FFN，所有 token 都经过相同参数。以 SwiGLU 为例，可以概念化写成：</p>
          <Formula label="Dense SwiGLU FFN" tex={String.raw`E(x)=W_d\!\left(\operatorname{SiLU}(W_gx)\odot W_ux\right)`} />
          <p>MoE 层复制出多套结构相同、参数独立的 FFN：</p>
          <Formula label="N 个参数独立的 Experts" tex={String.raw`E_1(x),E_2(x),\ldots,E_N(x)`} />
          <p>每个 Expert 通常都是一个完整的 FFN 子网络，但不是一个完整的语言模型。Attention、Embedding、Normalization、LM Head 等组件通常仍由所有 token 共享。Router 根据当前 token 表示决定这一层调用哪些 Experts。</p>
          <aside className="boundary-box"><b>稀疏发生在 Expert 选择，不一定发生在 Expert 内部</b><p>一个被选中的 Expert 内部仍可以是普通的稠密 SwiGLU FFN。MoE 的“Sparse”通常指每个 token 只执行少数 Experts，而不是每个矩阵自身变成稀疏矩阵。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>ROUTER AND TOP-K</p><h2>Router 如何为每个 token 选择 Experts？</h2></div></div>
          <p>设输入 token 表示为 <Formula inline tex={String.raw`x\in\mathbb R^d`} />。最简单的 Router 是一个线性投影，它为每个 Expert 产生一个 logit，再经过 Softmax 得到路由分数：</p>
          <Formula label="Router 概率" tex={String.raw`z=W_rx\in\mathbb R^N,\qquad p_i(x)=\frac{\exp(z_i)}{\sum_{j=1}^{N}\exp(z_j)}`} />
          <p>随后只保留分数最高的 <Formula inline tex={String.raw`k`} /> 个 Experts，并在被选集合中重新归一化：</p>
          <Formula label="Top-k 选择与归一化" tex={String.raw`\mathcal T_k(x)=\operatorname{TopK}\!\left(\{p_i(x)\}_{i=1}^{N}\right),\qquad \widetilde p_i(x)=\frac{p_i(x)}{\sum_{j\in\mathcal T_k(x)}p_j(x)}`} />
          <p>MoE 输出是被选 Expert 输出的加权和：</p>
          <Formula label="Routed MoE 输出" tex={String.raw`y=\sum_{i\in\mathcal T_k(x)}\widetilde p_i(x)E_i(x)`} />
          <p>对一个包含 <Formula inline tex={String.raw`T`} /> 个 token 的句子，进入某个 MoE 层的是一个序列张量 <Formula inline tex={String.raw`X\in\mathbb R^{T\times d}`} />。Router 对每一行 <Formula inline tex={String.raw`x_t`} /> 分别选择 Expert 组合；加权结果 <Formula inline tex={String.raw`y_t`} /> 随后放回第 <Formula inline tex={String.raw`t`} /> 个序列位置，因此该层输入和输出的形状保持一致：</p>
          <Formula label="逐 token 路由后恢复原序列位置" tex={String.raw`X=\begin{bmatrix}x_1^{\mathsf T}\\x_2^{\mathsf T}\\\vdots\\x_T^{\mathsf T}\end{bmatrix}\in\mathbb R^{T\times d},\qquad y_t=\sum_{i\in\mathcal T_k(x_t)}\widetilde p_{t,i}E_i(x_t),\qquad Y=\begin{bmatrix}y_1^{\mathsf T}\\y_2^{\mathsf T}\\\vdots\\y_T^{\mathsf T}\end{bmatrix}\in\mathbb R^{T\times d}`} />
          <aside className="text-note"><b>实现会重排，模型语义不乱序</b><p>为了批量执行同一个 Expert，系统可能暂时把来自不同句子、不同位置的 token 按 Expert 分组；计算结束后会通过原位置索引 scatter 回去。这里是“恢复张量位置”，不是把文本片段重新拼接。Experts 本身逐 token 变换，token 之间的信息交换主要发生在 Attention。</p></aside>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Token-level routing</h3><p>同一条序列里的不同 token 可以进入不同 Experts；选择通常还会随层数改变。</p></div></article>
            <article><span>02</span><div><h3>Top-1 与 Top-2/Top-k</h3><p><Formula inline tex={String.raw`k`} /> 越小，计算和通信越省；<Formula inline tex={String.raw`k`} /> 越大，可组合的 Expert 信息更多，但激活参数也随之增加。</p></div></article>
            <article><span>03</span><div><h3>Soft weights</h3><p>被选 Experts 通常不是简单平均，而是按 Router 分数加权。具体实现也可能使用 Sigmoid、分组路由或其他归一化方式。</p></div></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>PARAMETERS VS. COMPUTE</p><h2>总参数与激活参数为什么必须分开看？</h2></div></div>
          <p>为了抓住核心关系，先假设 <Formula inline tex={String.raw`N`} /> 个 Experts 大小相同，每个有 <Formula inline tex={String.raw`P_E`} /> 个参数，每个 token 选择 <Formula inline tex={String.raw`k`} /> 个。忽略共享骨干后：</p>
          <Formula label="Expert 参数规模的近似关系" tex={String.raw`P_{\mathrm{total}}^{\mathrm{expert}}\approx NP_E,\qquad P_{\mathrm{active}}^{\mathrm{expert}}\approx kP_E`} />
          <p>因此二者比例近似为：</p>
          <div className="derivation-box"><p className="mini-label">SPARSE ACTIVATION RATIO</p><Formula className="dark-latex bare-latex" tex={String.raw`\frac{P_{\mathrm{active}}^{\mathrm{expert}}}{P_{\mathrm{total}}^{\mathrm{expert}}}\approx\frac{k}{N}`} /></div>
          <p>但模型还有所有 token 都要经过的 Attention、Norm、Embedding、Router 和可能存在的 Shared Experts，所以整模型激活参数并不严格等于总参数乘 <Formula inline tex={String.raw`k/N`} />。此外，“激活参数”是理解计算规模的近似指标，不等同于精确 FLOPs、显存占用或端到端延迟。</p>
          <aside className="text-note"><b>容量与计算被部分解耦</b><p>增加 Experts 可以扩大总参数与潜在知识容量，而不让每个 token 执行全部 Experts；但所有 Expert 权重通常仍需被设备集群容纳，路由和通信也会产生额外成本。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>EXPERT SPECIALIZATION</p><h2>Experts 为什么可能形成不同分工？</h2></div></div>
          <p>Router 与 Experts 会共同训练。某个 Expert 若对一类 token 产生更有利的梯度，Router 会更倾向把相似 token 分给它；该 Expert 又会接收更多这类训练信号，从而逐步形成专门化。这是一种由优化动态产生的软分工，并没有规定某个 Expert 必须负责数学、代码或某种语言。</p>
          <Formula label="对单个 token 的任务损失路径" tex={String.raw`\mathcal L_{\mathrm{task}}(x)\longrightarrow\widetilde p_i(x)\longrightarrow E_i(x),\qquad i\in\mathcal T_k(x)`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Expert 参数独立</h3><p>不同 Experts 的 FFN 权重不共享，因此可以学习不同的通道变换。</p></div></article>
            <article><span>02</span><div><h3>Router 输入依赖 token</h3><p>选择由当前层、当前位置的 hidden state 决定，同一个词在不同语境中可能走不同路径。</p></div></article>
            <article><span>03</span><div><h3>组合而非固定标签</h3><p>Top-<Formula inline tex={String.raw`k`} /> 允许多个 Experts 共同处理一个 token。理论组合数量可达 <Formula inline tex={String.raw`\binom Nk`} />，但实际 Router 分布通常远非均匀。</p></div></article>
          </div>
          <aside className="boundary-box"><b>不要把 Expert 名字拟人化</b><p>可视化有时会观察到语言、语法或领域偏好，但 Expert 通常不是干净、稳定、唯一的知识模块。它的行为会跨层、跨上下文变化，也可能同时承担多种模式。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>BALANCE AND CAPACITY</p><h2>为什么 Router 不能只选“最强”的几个 Experts？</h2></div></div>
          <p>若只优化语言建模损失，Router 可能长期把大量 token 送到少数 Experts，造成其他 Experts 几乎得不到梯度。这称为负载不均衡，严重时会出现 Expert Collapse。训练系统通常加入负载均衡目标。</p>
          <Formula label="一种常见的负载均衡概念式" tex={String.raw`f_i=\frac{1}{T}\sum_{t=1}^{T}\mathbf 1\!\left[i\in\mathcal T_k(x_t)\right],\qquad \bar p_i=\frac{1}{T}\sum_{t=1}^{T}p_i(x_t),\qquad \mathcal L_{\mathrm{bal}}=\lambda N\sum_{i=1}^{N}f_i\bar p_i`} />
          <p><Formula inline tex={String.raw`f_i`} /> 表示 Expert <Formula inline tex={String.raw`i`} /> 实际接收的 token 比例，<Formula inline tex={String.raw`\bar p_i`} /> 表示平均路由倾向。不同模型会使用不同的辅助损失、无辅助损失策略或全局统计范围，上式用于说明“同时约束选择结果和概率倾向”的基本思路。</p>
          <p>分布式训练还会给每个 Expert 设置容量。若一批共有 <Formula inline tex={String.raw`T`} /> 个 token，每个 token 产生 <Formula inline tex={String.raw`k`} /> 次 Expert 分配，则平均负载为 <Formula inline tex={String.raw`Tk/N`} />。容量因子 <Formula inline tex={String.raw`\alpha`} /> 给出余量：</p>
          <Formula label="单个 Expert 的近似容量" tex={String.raw`C=\left\lceil\alpha\frac{Tk}{N}\right\rceil`} />
          <p>超过容量的 token 可能被丢弃、改送备选 Expert，或由动态 kernel 继续处理，具体行为取决于实现。容量越宽松越不容易溢出，但显存预留和通信成本也越高。</p>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>FINE-GRAINED AND SHARED EXPERTS</p><h2>细粒度、Shared 与 Routed Experts 分别做什么？</h2></div></div>
          <p>传统 MoE 可以把一个大 FFN 复制成少量大 Experts。细粒度 MoE 则沿 FFN 中间维度把大 Expert 拆成更多小 Experts。在相近激活预算下，Router 可以从更大的候选集合中组合更多路径。</p>
          <Formula label="把一个大 Expert 拆成 m 个小 Experts" tex={String.raw`P_{\mathrm{large}}\approx mP_{\mathrm{small}},\qquad k_{\mathrm{small}}\approx mk_{\mathrm{large}}`} />
          <p>如果同时引入 Shared Experts，完整输出可以写成：</p>
          <Formula label="Shared + Routed Experts" tex={String.raw`y=\sum_{s=1}^{N_s}E_s^{\mathrm{shared}}(x)+\sum_{i\in\mathcal T_k(x)}\widetilde p_i(x)E_i^{\mathrm{routed}}(x)`} />
          <div className="compare-columns">
            <article><p className="mini-label">SHARED EXPERTS</p><h3>每个 token 都经过</h3><ul><li>不参加竞争性 Top-k 路由</li><li>承接跨 token 常见的基础变换</li><li>减少 Routed Experts 重复学习公共能力的压力</li></ul></article>
            <article className="accent-card"><p className="mini-label">ROUTED EXPERTS</p><h3>按 token 稀疏选择</h3><ul><li>只有被选中时才参与计算</li><li>更容易形成条件化分工</li><li>决定主要的稀疏容量扩展空间</li></ul></article>
          </div>
          <aside className="text-note"><b>Shared 不是必选项</b><p>不同 MoE 家族会选择保留、增加或取消 Shared Experts。它是架构超参数，不是所有 MoE 的定义性组成部分。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>SYSTEM COSTS</p><h2>少算 Experts，为什么不一定直接更快？</h2></div></div>
          <p>MoE 减少的是每个 token 执行的 Expert 计算，但 Router 会把 token 按 Expert 重新分组。在 Expert Parallelism 中，不同 Experts 常分布在不同设备上，这会产生 All-to-All 通信：先把 token 发到目标 Expert，计算后再把结果送回原设备。</p>
          <div className="formula-sequence">
            <div><span>01 · ROUTE</span><Formula className="sequence-latex" tex={String.raw`x_t\longrightarrow\mathcal T_k(x_t)`} /></div>
            <div><span>02 · DISPATCH</span><Formula className="sequence-latex" tex={String.raw`\mathrm{tokens}\xrightarrow{\text{All-to-All}}\mathrm{expert\ devices}`} /></div>
            <div><span>03 · COMBINE</span><Formula className="sequence-latex" tex={String.raw`\{E_i(x_t)\}_{i\in\mathcal T_k}\longrightarrow y_t`} /></div>
          </div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>权重显存</h3><p>即使单 token 只激活少量 Experts，整个服务集群仍需存放或按需加载全部 Expert 权重。</p></div></article>
            <article><span>02</span><div><h3>通信与小矩阵效率</h3><p>Experts 越细、token batch 越小，单次矩阵乘可能越难充分利用硬件；跨卡通信也可能超过节省的计算。</p></div></article>
            <article><span>03</span><div><h3>负载长尾</h3><p>一步计算通常要等待最忙的 Expert。平均负载相同并不保证尾部负载相同。</p></div></article>
            <article><span>04</span><div><h3>推理 kernel</h3><p>高效部署依赖 grouped GEMM、token permutation、通信融合、量化与并行拓扑共同优化。</p></div></article>
          </div>
          <aside className="boundary-box"><b>MoE 的优势首先是参数容量效率</b><p>它常能在相近激活计算下容纳更多参数，但是否降低延迟、提高吞吐，需要在具体 batch、硬件、并行方式和上下文长度上测量。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>BACK TO QWEN</p><h2>MoE 在 Qwen 演进中如何变化？</h2></div></div>
          <p>Qwen1.5-MoE 开始系统使用细粒度 Experts，并组合 Shared 与 Routed Experts；Qwen2 MoE 继续扩大总容量；Qwen3 的代表性 MoE 配置增加 Routed Experts 数量并取消早期 Shared Expert，同时调整负载均衡方式；Qwen3-Next 与后续混合主干又进一步走向 Ultra-sparse MoE。</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Qwen1.5-MoE</h3><p>64 个 Experts：4 个 Shared 始终激活，从 60 个 Routed 中选择 4 个，突出细粒度和共享知识隔离。</p></div></article>
            <article><span>02</span><div><h3>Qwen2-57B-A14B</h3><p>总参数约 57B，激活参数约 14B；使用 64 个 Routed Experts、激活 8 个，并有 8 个 Shared Experts。</p></div></article>
            <article><span>03</span><div><h3>Qwen3 MoE</h3><p>代表性配置使用 128 个 Routed Experts、每 token 选择 8 个，并取消 Shared Experts，强调更细的稀疏路由。</p></div></article>
            <article><span>04</span><div><h3>Qwen3-Next</h3><p>典型 Ultra-sparse 配置扩展到 512 个 Routed Experts、选择 10 个并配合 1 个 Shared Expert，同时与 Hybrid Attention 主干组合。</p></div></article>
          </div>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>阅读型号名称时，必须把总参数、激活参数、Routed/Shared 数量和 Top-k 一起看；只比较“总 B 数”无法推断单 token 计算量，也无法直接推断部署速度。</p><a href="/#chapter-2">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>SFT ROUTING DRIFT &amp; INTERFERENCE</p><h2>SFT 后某个 token 换了 Expert，原来的知识怎么办？</h2></div></div>
          <p>首先要修正“某个 Expert 保存了某个 token 的知识”这个直觉。MoE Router 通常不直接根据 token ID 做固定查表，而是读取当前层的上下文化 hidden state <Formula inline tex={String.raw`h_{t,\ell}`} />。同一个 token 在不同句子、不同位置和不同层中，本来就可能进入不同的 Expert 组合：</p>
          <Formula label="路由依赖层、位置与上下文" tex={String.raw`p_{t,\ell}=\operatorname{softmax}\!\left(W_{r,\ell}h_{t,\ell}\right),\qquad \mathcal T_{t,\ell}=\operatorname{TopK}(p_{t,\ell})`} />
          <p>SFT 会更新共享骨干、Router 和被选中的 Experts，除非训练配置显式冻结其中一部分。于是 hidden state、Router 边界或两者都可能变化，使同一批样本在 SFT 前后选择不同 Experts。这种现象可以称为 <b>routing drift</b>：</p>
          <Formula label="SFT 前后的路由变化" tex={String.raw`\mathcal T_{t,\ell}^{(0)}=\operatorname{TopK}\!\left(p_{t,\ell}^{(0)}\right),\qquad \mathcal T_{t,\ell}^{(1)}=\operatorname{TopK}\!\left(p_{t,\ell}^{(1)}\right)`} />
          <Formula className="soft-latex" label="一种路由集合变化度量" tex={String.raw`D_{t,\ell}^{\mathrm{route}}=1-\frac{\left|\mathcal T_{t,\ell}^{(0)}\cap\mathcal T_{t,\ell}^{(1)}\right|}{\left|\mathcal T_{t,\ell}^{(0)}\cup\mathcal T_{t,\ell}^{(1)}\right|}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>换路由不等于旧知识被删除</h3><p>原 Expert 的参数仍然存在，除非它在 SFT 中也被更新或覆盖。只是对于这个具体上下文，新的 Router 不再调用它，因此原路径中的能力可能暂时不可达。</p></div></article>
            <article><span>02</span><div><h3>知识不是按 token 独占存储</h3><p>Expert 学到的是对一片 contextual hidden-state 区域的非线性变换，不是“这个 Expert 专门保存 token A”。词义和任务能力还分布在 Embedding、Attention、共享层、其他 Experts 及它们的组合中。</p></div></article>
            <article><span>03</span><div><h3>未被选 Expert 通常收不到该 token 的任务梯度</h3><p>对 Routed Expert 参数而言，硬 Top-<Formula inline tex={String.raw`k`} /> 之外的 Expert 通常不参与该 token 前向路径，因此不会获得该 token 的直接 SFT 任务梯度；辅助路由损失是另一条梯度来源。</p></div></article>
            <article><span>04</span><div><h3>被更新 Expert 可能影响其他 token</h3><p>如果许多不同 token 或上下文都路由到同一个 Expert，那么用当前 SFT 样本更新它之后，所有未来经过该 Expert 的输入都可能受影响。这既可能产生迁移收益，也可能造成能力干扰或遗忘。</p></div></article>
          </div>
          <Formula label="Expert 更新会汇聚所有被路由样本的梯度" tex={String.raw`\theta_i\leftarrow\theta_i-\eta\sum_{t:\,i\in\mathcal T_{t,\ell}}\nabla_{\theta_i}\mathcal L_t,\qquad \nabla_{\theta_i}\mathcal L_t\approx0\ \text{if}\ i\notin\mathcal T_{t,\ell}`} />
          <aside className="boundary-box">
            <b>真正的风险有两种</b>
            <div className="boundary-definitions">
              <p><strong>路由遗忘：</strong>能力仍可能保存在旧 Expert 中，但新 Router 不再把相关输入送过去。</p>
              <p><strong>参数干扰：</strong>SFT 更新了某个热门 Expert，使原本依赖它的其他输入也发生变化。实际退化还可能来自共享 Attention 或 hidden state 改变，不能只归因于 Router。</p>
            </div>
          </aside>
          <p>训练时的目标不是强迫所有 token 永远走原路线，因为适度 routing drift 正是任务适配的一部分；真正要控制的是无意义的剧烈漂移、负载坍缩和通用能力损失。常见策略包括：</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>数据回放与混合 SFT</h3><p>在专项数据中混入通用指令、预训练回放或关键能力样本，让旧能力持续产生梯度约束，降低窄领域数据把少数 Experts 拉偏的风险。</p></div></article>
            <article><span>02</span><div><h3>限制可训练参数</h3><p>使用较小学习率、LoRA/Adapter，或冻结 Router、部分 Experts、共享骨干。冻结 Router 能保持分配边界，但也会限制任务所需的新路由，因此需要按目标选择。</p></div></article>
            <article><span>03</span><div><h3>路由稳定与负载约束</h3><p>保留负载均衡损失，也可以对 SFT Router 与基座 Router 的分布加入 KL、logit 或路由重合约束。它们是可选稳定手段，不是所有模型的固定训练配方。</p></div></article>
            <article><span>04</span><div><h3>同时监控路由和能力</h3><p>比较 SFT 前后的每层 Expert load、路由熵、Top-<Formula inline tex={String.raw`k`} /> 重合率、溢出率，并配合通用与专项评测。只看 loss 不能区分“有效适配”和“路由坍缩”。</p></div></article>
          </div>
          <Formula label="可选的稳定化目标（概念式）" tex={String.raw`\mathcal L=\mathcal L_{\mathrm{SFT}}+\lambda_{\mathrm{bal}}\mathcal L_{\mathrm{bal}}+\lambda_{\mathrm{route}}\sum_{t,\ell}\operatorname{KL}\!\left(p_{t,\ell}^{(0)}\,\|\,p_{t,\ell}^{(1)}\right)`} />
          <aside className="text-note"><b>一句话结论</b><p>SFT 后换 Expert 并不自动意味着知识消失；旧 Expert 的参数可能仍在，但访问路径变了。更需要警惕的是新路由是否失去原能力，以及被更新的 Experts 是否对其他 routed token 产生负迁移。</p></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>MoE 的 Expert 是一个完整模型吗？</summary><div><p>通常不是。Transformer MoE 中的 Expert 多数是一套 FFN 参数，只替换 block 里的 Dense FFN。Attention、Norm、Embedding 和输出层仍由整个模型共享。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>总参数很大，为什么每个 token 的计算量仍然较小？</summary><div><p>因为 Router 只选择 Top-<Formula inline tex={String.raw`k`} /> Experts。若共有 <Formula inline tex={String.raw`N`} /> 个等大 Experts，Expert 部分的激活比例约为 <Formula inline tex={String.raw`k/N`} />；未被选中的 Experts 不执行该 token 的前向计算。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>同一个 token 在每一层都会进入相同 Experts 吗？</summary><div><p>不会。每个 MoE 层通常拥有自己的 Router 和 Experts，而且 token hidden state 会逐层变化，因此同一个 token 在不同层可以被分配到完全不同的 Expert 组合。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>Top-k 选择不可导，Router 如何训练？</summary><div><p>离散的“谁进入 Top-k”本身不可导，但被选路由权重仍参与后续加权，梯度可以回到对应 Router logits；训练还常加入负载均衡损失、噪声或其他稳定策略。未入选项如何获得信号取决于具体路由算法。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>什么是 Expert Collapse？</summary><div><p>Router 长期集中选择少数 Experts，导致热门 Experts 过载、其他 Experts 缺少 token 和梯度，整个大参数池没有被有效利用。负载均衡目标、容量控制和初始化策略都用于缓解这一问题。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>Shared Experts 和 Routed Experts 有什么区别？</summary><div><p>Shared Experts 对每个 token 始终执行，适合承接公共变换；Routed Experts 只有被 Router 选中才执行，提供稀疏的条件容量。二者可以同时存在，也可以只保留 Routed Experts。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>Fine-grained Experts 为什么能增加组合能力？</summary><div><p>把少量大 Experts 拆成更多小 Experts后，在相近激活参数预算下可以选择更多小模块。候选集合更大、组合粒度更细，Router 能形成更丰富的路径；代价是路由、调度与小矩阵计算更复杂。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>MoE 一定比同等激活参数的 Dense 模型更快吗？</summary><div><p>不一定。MoE 还要承担 Router、token 重排、跨设备 All-to-All、负载长尾和全部权重驻留等成本。它可能提高吞吐，也可能在小 batch 或通信受限环境中延迟更高，必须实测。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>模型名称中的 A14B、A3B 表示什么？</summary><div><p><Formula inline tex={String.raw`A`} /> 通常表示每个 token 近似激活的参数规模，例如 A14B 表示约 14B activated parameters。它不是统一强制标准，统计是否包含 Embedding、Attention、Shared Experts 等可能因发布方而异，应以模型技术报告的口径为准。</p></div></details>
            <details id="qa-10">
              <summary><span>Q10</span>一个句子有很多 token，MoE 会分别路由后再把结果拼起来吗？</summary>
              <div>
                <p>基本方向是对的：在每一个 MoE 层中，不同 token 通常会各自选择 Top-<Formula inline tex={String.raw`k`} /> Expert 组合。但每个 Expert 接收的不是原始单词，而是该 token 在当前层的 hidden state <Formula inline tex={String.raw`x_t\in\mathbb R^d`} />；它已经包含此前 Attention 汇入的上下文信息。</p>
                <Formula className="compact-latex qa-latex" tex={String.raw`x_t\xrightarrow{\mathrm{Router}}\mathcal T_k(x_t)\xrightarrow{\mathrm{Experts}}y_t,\qquad Y=[y_1,\ldots,y_T]^{\mathsf T}\in\mathbb R^{T\times d}`} />
                <p>被选 Experts 的输出通常先按 Router 权重<strong>加权求和</strong>成一个 <Formula inline tex={String.raw`d`} /> 维向量 <Formula inline tex={String.raw`y_t`} />，而不是把 Top-<Formula inline tex={String.raw`k`} /> 个输出沿特征维度直接拼接。系统再把 <Formula inline tex={String.raw`y_t`} /> 放回 token <Formula inline tex={String.raw`t`} /> 的原序列位置；所有位置恢复后仍是 <Formula inline tex={String.raw`T\times d`} /> 张量，然后进行残差相加并进入下一子层。</p>
                <p><strong>所以，更准确的表述是“逐 token 路由、按 Expert 临时分组、对每个 token 加权合并、再恢复原序列顺序”。</strong> 这时得到的只是当前 MoE 层输出，不是最终 embedding。经过后续 Transformer layers 和 Final Norm 后才得到最终 hidden states，再由 LM Head 产生各位置的 token logits；自回归生成时通常使用最后一个有效位置的 logits 预测下一个 token。</p>
              </div>
            </details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/1701.06538" target="_blank" rel="noreferrer">Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer</a><span>2017</span></li>
            <li><a href="https://arxiv.org/abs/2006.16668" target="_blank" rel="noreferrer">GShard: Scaling Giant Models with Conditional Computation</a><span>2020</span></li>
            <li><a href="https://arxiv.org/abs/2101.03961" target="_blank" rel="noreferrer">Switch Transformers: Scaling to Trillion Parameter Models</a><span>2021</span></li>
            <li><a href="https://arxiv.org/abs/2202.08906" target="_blank" rel="noreferrer">ST-MoE: Designing Stable and Transferable Sparse Expert Models</a><span>2022</span></li>
            <li><a href="https://arxiv.org/abs/2401.06066" target="_blank" rel="noreferrer">DeepSeekMoE: Towards Ultimate Expert Specialization</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2403.10145" target="_blank" rel="noreferrer">Qwen1.5-MoE: Matching 7B Model Performance with 1/3 Activated Parameters</a><span>2024</span></li>
          </ol>
        </section>

        <footer className="article-footer"><div><span>继续连接知识</span><strong>从单个 Expert 的 SwiGLU FFN，继续理解 Decoder 主干与 Qwen 的稀疏模型路线。</strong></div><div className="footer-links"><a href="/activations/swiglu">SwiGLU ↗</a><a href="/architecture/decoder-only">Decoder-only ↗</a><a href="/">Qwen 演进 ↗</a></div></footer>
      </main>

      <aside className="right-rail" aria-label="本页目录"><p>本页目录</p>{chapters.map(([no, label]) => <a href={no === "10" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}<RightQaIndex questions={qaQuestions} /><div className="reading-note"><span>10 章</span><div><i></i></div><small>公式密度 · 中等</small></div></aside>
    </div>
  );
}
