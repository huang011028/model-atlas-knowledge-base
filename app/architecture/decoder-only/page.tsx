import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 Decoder-only？";
const description = "从原始 Transformer Decoder、因果掩码与自回归目标出发，理解 Decoder-only 为什么能统一语言理解与生成。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "名字到底是什么意思"],
  ["02", "一个 Block 如何计算"],
  ["03", "Causal Mask"],
  ["04", "自回归训练目标"],
  ["05", "训练并行，生成串行"],
  ["06", "三类 Transformer 对比"],
  ["07", "Prefill、Decode 与 KV Cache"],
  ["08", "能力来源与边界"],
  ["09", "关联 QA"],
];

const qaQuestions = [
  "只有 Decoder，没有 Encoder，为什么还能理解输入？",
  "它与原始 Transformer Decoder 完全相同吗？",
  "训练时能并行，为什么生成时不能？",
  "Causal Mask 和 Padding Mask 有什么不同？",
  "Decoder-only 是否永远只能看左边？",
  "预测下一个 token 为什么能学会多种任务？",
  "输出分类矩阵位于架构的哪里？",
  "Causal Mask 和 Padding Mask 把位置设为负无穷后，如何参与计算？",
];

export default function DecoderOnlyPage() {
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
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a><span className="rail-subhead">概率、采样与估计</span><a href="/foundations/importance-sampling">Importance Sampling</a></div>
        <div className="rail-group">
          <p>01 · 模型与架构</p>
          <a href="/">Qwen 系列演进</a>
          <a className="selected" href="/architecture/decoder-only">Decoder-only Transformer</a>
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

      <main className="article rms-article decoder-article">
        <section className="hero rms-hero decoder-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 模型与架构 <span>/</span> Decoder-only</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 004</span></div>
          <p className="original-question">“什么是 Decoder-only？为什么没有 Encoder，它仍然能理解问题、翻译文本、调用工具并完成复杂推理？”</p>
          <div className="eyebrow"><span></span> TRANSFORMER ARCHITECTURE · 01</div>
          <h1>什么是<br/>Decoder-only？</h1>
          <p className="dek">它是一类只堆叠因果自注意力 Decoder blocks、通过预测下一个 token 学习语言分布的 Transformer。GPT、Llama 与 Qwen 的主线模型都属于这一家族。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>22 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first">
            <span>一句话答案</span>
            <p>Decoder-only 用同一段 token 序列同时承载“输入”和“输出”，每个位置只能读取自己及其左侧信息；模型把所有语言任务统一成一个问题：<b>给定此前 token，下一个 token 最可能是什么？</b></p>
          </aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>WHAT THE NAME MEANS</p><h2>“只有 Decoder”到底删掉了什么？</h2></div></div>
          <p>2017 年的原始 Transformer 是为机器翻译设计的 Encoder–Decoder 架构。Encoder 先把源语言序列编码成一组表示；Decoder 一边读取已经生成的目标 token，一边通过 Cross-Attention 读取 Encoder 输出。</p>
          <div className="decoder-origin-compare">
            <article><span>ORIGINAL TRANSFORMER</span><h3>Encoder–Decoder</h3><div className="origin-flow"><b>Source tokens</b><i>→</i><b>Encoder</b><i>→</i><b>Cross-Attention</b><i>→</i><b>Decoder</b></div><p>Decoder block 含 Masked Self-Attention、Encoder–Decoder Cross-Attention 和 FFN。</p></article>
            <article className="decoder-focus"><span>MODERN LANGUAGE MODEL</span><h3>Decoder-only</h3><div className="origin-flow"><b>All tokens</b><i>→</i><b>Causal Self-Attention</b><i>→</i><b>FFN</b><i>→</i><b>Next token</b></div><p>移除独立 Encoder 与 Cross-Attention；提示词、示例、工具结果和回答都进入同一条 token 时间线。</p></article>
          </div>
          <Formula label="结构上的核心删减" tex={String.raw`\underbrace{\mathrm{Masked\ Self\!\!-\!\!Attention}+\mathrm{Cross\!\!-\!\!Attention}+\mathrm{FFN}}_{\text{原始 Transformer Decoder}}\quad\Longrightarrow\quad\underbrace{\mathrm{Causal\ Self\!\!-\!\!Attention}+\mathrm{FFN}}_{\text{Decoder-only block}}`} />
          <aside className="boundary-box"><b>“Decoder-only”是历史命名，不是能力判断</b><p>这里的 Decoder 指网络结构来源，不表示模型只能机械地“解码”某个 Encoder 的表示。现代模型直接把自然语言输入编码进自身隐藏状态，因此没有独立 Encoder 也能完成理解型任务。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>INSIDE ONE BLOCK</p><h2>一个现代 Decoder block 如何计算？</h2></div></div>
          <p>设第<Formula inline tex={String.raw`\ell`} />层输入为<Formula inline tex={String.raw`X_\ell\in\mathbb{R}^{L\times d}`} />。现代 LLM 常采用 Pre-Norm：Attention 与 FFN 各自先归一化，再把子层输出加回残差主干。</p>
          <div className="decoder-block-stack" aria-label="现代 Decoder-only 模型的数据流">
            <span>Token IDs</span><i>↓</i><span>Embedding + Position</span><i>↓</i>
            <div><b>RMSNorm</b><em>→</em><b>Causal Self-Attention</b><em>→</em><b>Residual Add</b></div><i>↓</i>
            <div><b>RMSNorm</b><em>→</em><b>SwiGLU FFN</b><em>→</em><b>Residual Add</b></div><i>↓ × N</i>
            <span>Final Norm → LM Head → Logits</span>
          </div>
          <Formula label="Pre-Norm Decoder block" tex={String.raw`\begin{aligned}\widetilde X_\ell&=X_\ell+\operatorname{Attn}_{\mathrm{causal}}\!\left(\operatorname{Norm}(X_\ell)\right),\\[0.35em]X_{\ell+1}&=\widetilde X_\ell+\operatorname{FFN}\!\left(\operatorname{Norm}(\widetilde X_\ell)\right)\end{aligned}`} />
          <p>Attention 负责让不同 token 交换信息；FFN 在每个 token 内部变换通道；Residual 让原表示和梯度可以跨层直达。Qwen 基线中的 <a className="term-link" href="/normalization/rmsnorm">RMSNorm</a> 与 <a className="term-link" href="/activations/swiglu">SwiGLU</a> 分别承担 Norm 与 FFN 的角色。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>CAUSAL ATTENTION</p><h2>Causal Mask 如何防止“偷看答案”？</h2></div></div>
          <p>训练文本已经包含整段序列。如果第<Formula inline tex={String.raw`i`} />个位置能看到右侧第<Formula inline tex={String.raw`j>i`} />个 token，它就会直接读到自己应该预测的未来。Causal Mask 将所有未来位置的 attention logit 设为负无穷。</p>
          <Formula label="带因果掩码的缩放点积注意力" tex={String.raw`\operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^{\mathsf T}}{\sqrt{d_h}}+M\right)V,\qquad M_{ij}=\begin{cases}0,&j\le i,\\-\infty,&j>i.\end{cases}`} />
          <div className="causal-mask-demo">
            <div className="mask-axis"><span>Query ↓ / Key →</span><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></div>
            {Array.from({ length: 5 }).map((_, row) => (
              <div className="mask-row" key={`mask-row-${row}`}><b>{row + 1}</b>{Array.from({ length: 5 }).map((__, column) => <i className={column <= row ? "allowed" : "blocked"} key={`mask-${row}-${column}`}>{column <= row ? "●" : "×"}</i>)}</div>
            ))}
            <p><span>● 可见</span><span>× 被屏蔽</span></p>
          </div>
          <p>因此，第 5 个位置可以汇总 1–5 的信息，第 2 个位置只能使用 1–2。所谓“单向”指单次前向传播中的信息依赖方向，而不是模型只能处理从左到右书写的语言。</p>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>AUTOREGRESSIVE OBJECTIVE</p><h2>整套能力被压进一个训练目标</h2></div></div>
          <p>Decoder-only 把长度为<Formula inline tex={String.raw`T`} />的序列联合概率分解为一串条件概率。每一步只需要回答：此前 token 已知时，真实的下一个 token 概率应该有多高？</p>
          <Formula className="main-latex" label="自回归概率分解" tex={String.raw`p_\theta(x_{1:T})=\prod_{t=1}^{T}p_\theta\!\left(x_t\mid x_{<t}\right)`} />
          <Formula label="Next-token prediction 的负对数似然" tex={String.raw`\mathcal L_{\mathrm{NTP}}(\theta)=-\sum_{t=1}^{T}\log p_\theta\!\left(x_t\mid x_{<t}\right)`} />
          <p>模型并没有为问答、翻译、摘要或代码分别配置一套输出头。只要把任务写成 token 序列——例如“问题 → 答案”“英文 → 中文”“工具请求 → 工具结果”——它们都能进入同一个概率模型。</p>
          <aside className="text-note"><b>理解与生成没有两套参数</b><p>“理解”体现在模型如何把上下文压入隐藏状态并改变后续 token 的条件分布；“生成”则是从这个分布中逐步选出 token。二者是同一前向计算的不同观察角度。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>TEACHER FORCING VS. SAMPLING</p><h2>为什么训练能并行，生成却必须串行？</h2></div></div>
          <p>训练时整段正确文本已经存在。通过 Teacher Forcing，位置<Formula inline tex={String.raw`1,\ldots,T`} />的输入可以一次送入模型；Causal Mask 保证每个位置即使并行计算，也只能读取合法前缀。</p>
          <div className="train-decode-compare">
            <article><span>TRAINING</span><h3>答案已知，位置可并行</h3><Formula className="card-latex" tex={String.raw`[x_1,x_2,\ldots,x_T]\;\xrightarrow{\ \mathrm{one\ forward}\ }\;[\hat x_2,\hat x_3,\ldots,\hat x_{T+1}]`} /><p>一次前向传播产生所有位置的 logits，再同时计算损失。</p></article>
            <article className="decode-card"><span>INFERENCE</span><h3>下一个输入尚未出现</h3><Formula className="card-latex accent-latex" tex={String.raw`x_{t+1}\sim p_\theta(\cdot\mid x_{\le t})`} /><p>必须先生成<Formula inline tex={String.raw`x_{t+1}`} />，它才能成为下一步计算的输入。</p></article>
          </div>
          <p>所以“Transformer 可并行”主要描述训练和 Prefill 阶段的位置计算；自回归 Decode 在 token 维度上仍有严格的数据依赖。推测解码、多 token 预测等技术可以减少串行等待，但不会改变目标序列本身的条件依赖。</p>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>THREE TRANSFORMER FAMILIES</p><h2>Encoder-only、Encoder–Decoder、Decoder-only 有何不同？</h2></div></div>
          <div className="norm-table-wrap">
            <table className="norm-table decoder-family-table">
              <thead><tr><th>架构</th><th>可见范围</th><th>典型训练目标</th><th>输入与输出</th><th>代表路线</th></tr></thead>
              <tbody>
                <tr><td>Encoder-only</td><td>通常双向</td><td>掩码恢复、表示学习</td><td>输入 → 表示/分类</td><td>BERT</td></tr>
                <tr><td>Encoder–Decoder</td><td>Encoder 双向；Decoder 因果</td><td>条件序列生成</td><td>源序列 → 目标序列</td><td>原始 Transformer、T5</td></tr>
                <tr className="highlight-row"><td>Decoder-only</td><td>因果可见</td><td>Next-token prediction</td><td>统一 token 序列</td><td>GPT、Llama、Qwen</td></tr>
              </tbody>
            </table>
          </div>
          <p>这不是绝对的任务边界。Encoder-only 也能参与生成系统，Encoder–Decoder 也能做理解任务，Decoder-only 也能分类和抽取信息。差别首先是信息流和训练接口，而不是一张固定的能力清单。</p>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>SERVING THE MODEL</p><h2>Prefill、Decode 与 KV Cache 如何接起来？</h2></div></div>
          <p>实际推理分成两段。Prefill 一次处理整段提示词并产生每层历史 Key/Value；Decode 每次只加入一个新 token，同时读取历史缓存，不再重新计算旧 token 的 K/V。</p>
          <Formula label="第 t 步需要保留的历史状态" tex={String.raw`\mathcal C_t=\left\{K_{1:t}^{(\ell)},V_{1:t}^{(\ell)}\right\}_{\ell=1}^{N},\qquad \mathcal C_{t+1}=\mathcal C_t\cup\left\{K_{t+1}^{(\ell)},V_{t+1}^{(\ell)}\right\}_{\ell=1}^{N}`} />
          <div className="compare-columns decoder-serving">
            <article><p className="mini-label">PREFILL</p><h3>并行建立上下文</h3><ul><li>输入整段 prompt</li><li>计算所有位置隐藏状态</li><li>写入每层 KV Cache</li></ul></article>
            <article className="accent-card"><p className="mini-label">DECODE</p><h3>串行追加 token</h3><ul><li>每一步计算一个新位置</li><li>重复读取历史 K/V</li><li>采样后继续下一步</li></ul></article>
          </div>
          <p>上下文越长、并发越高，KV Cache 越容易成为显存和带宽瓶颈。<a className="term-link" href="/attention/gqa">GQA</a> 正是通过减少 KV heads 来压缩这部分状态；它优化 Decoder-only 的服务成本，但不会改变自回归概率分解。</p>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>WHY IT SCALES — AND WHERE IT BREAKS</p><h2>为什么它成为主流？边界又在哪里？</h2></div></div>
          <div className="reason-list decoder-reasons">
            <article><span>01</span><div><h3>统一而简单的接口</h3><p>任何可序列化任务都能写进上下文，模型始终执行同一个 next-token objective，训练数据和产品交互容易汇合。</p></div></article>
            <article><span>02</span><div><h3>扩展后出现 In-context Learning</h3><p>足够大的自回归模型能从提示中的指令和示例临时适应任务，无需为每个新任务更新参数；这也是通用聊天模型的重要基础。</p></div></article>
            <article><span>03</span><div><h3>生成路径与训练目标一致</h3><p>训练直接优化条件 token 概率，推理则按同一分布采样，架构不需要额外的任务解码器。</p></div></article>
            <article><span>04</span><div><h3>代价仍然真实存在</h3><p>标准全注意力 Prefill 随长度呈二次增长，Decode 严格串行，KV Cache 随上下文增长；因果表示在某些天然需要双向重读的任务上也不一定占优。</p></div></article>
          </div>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>从 Qwen 到 Qwen3，主干一直是 Decoder-only，变化集中在 Norm、位置编码、Attention heads、FFN/<a className="term-link" href="/ffn/moe">MoE</a> 与训练方法。Qwen3-Next 才进一步把部分全注意力层替换为状态更新层，但整体输出仍保持自回归 next-token 接口。</p><a href="/">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>09</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>只有 Decoder，没有 Encoder，为什么还能理解输入？</summary><div><p>因为输入 token 本身会经过 Embedding、Causal Self-Attention 和 FFN，被逐层编码成上下文化隐藏状态。独立 Encoder 不是“理解”发生的必要条件；它只是 Encoder–Decoder 架构中专门处理源序列的模块。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>它与原始 Transformer Decoder 完全相同吗？</summary><div><p>不完全相同。原始 Decoder 还包含读取 Encoder 输出的 Cross-Attention，且论文使用 Post-Norm。现代 Decoder-only 通常移除 Cross-Attention，并常采用 Pre-Norm、RMSNorm、<a className="term-link" href="/position-encoding/rope">RoPE</a>、SwiGLU 与不同的 Attention 变体。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>训练时能并行，为什么生成时不能？</summary><div><p>训练时真实序列已经给出，所有位置可以在 Causal Mask 约束下同时计算；生成时下一个 token 尚不存在，必须先采样出来，才能作为后续步骤的条件。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>Causal Mask 和 Padding Mask 有什么不同？</summary><div><p>Causal Mask 屏蔽未来位置，维护自回归因果关系；Padding Mask 屏蔽为了对齐 batch 而补出的无效 token。实际实现中两者经常合并后一起加到 attention logits 上。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>Decoder-only 是否永远只能看左边？</summary><div><p>在一次标准因果前向传播中，每个 token 只能看左侧和自身。但模型可以把整段待理解文本放在问题之前，也可以通过重新排列、重复输入或专门的 mask 设计改变可见信息。这里的“左”是序列位置关系。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>预测下一个 token 为什么能学会多种任务？</summary><div><p>自然文本本身包含问答、翻译、代码、解释、对话和推理轨迹。模型为了降低这些序列的预测损失，必须学习它们背后的模式；后训练再进一步把目标分布集中到人类希望的指令行为上。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>输出分类矩阵位于架构的哪里？</summary><div><p>它位于最后一个 Decoder block 和 Final Norm 之后，把最后隐藏状态从模型维度投影到词表维度，产生每个候选 token 的 logits。它也常被称为 Output Projection 或 LM Head。</p></div></details>
            <details id="qa-8">
              <summary><span>Q8</span>Causal Mask 和 Padding Mask 把位置设为负无穷后，如何参与计算？</summary>
              <div>
                <p>Mask 不是在 Attention 计算结束后再单独处理，而是在 <Formula inline tex={String.raw`\operatorname{softmax}`} /> 之前，直接加到原始 attention score 上。对第 <Formula inline tex={String.raw`i`} /> 个 Query 与第 <Formula inline tex={String.raw`j`} /> 个 Key，可把完整链路写成：</p>
                <Formula
                  className="compact-latex qa-latex"
                  tex={String.raw`\begin{aligned}
S_{ij}&=\frac{q_i k_j^{\mathsf T}}{\sqrt{d_h}},\\
M_{ij}&=M_{ij}^{\mathrm{causal}}+M_{ij}^{\mathrm{padding}},\\
\widetilde S_{ij}&=S_{ij}+M_{ij},\\
A_{ij}&=\frac{\exp\!\left(\widetilde S_{ij}\right)}{\sum_k \exp\!\left(\widetilde S_{ik}\right)},\\
o_i&=\sum_j A_{ij}v_j.
\end{aligned}`}
                />
                <p>对于允许关注的位置，mask 值为 <Formula inline tex={String.raw`0`} />，原始 score 保持不变；只要 Causal Mask 或 Padding Mask 中任意一个屏蔽该位置，合并后的 mask 就是 <Formula inline tex={String.raw`-\infty`} />。由于 <Formula inline tex={String.raw`\exp(-\infty)=0`} />，该位置经过 Softmax 后得到严格的零权重，随后对应的 Value 在加权求和中也就没有贡献。</p>
                <Formula
                  className="compact-latex qa-latex"
                  tex={String.raw`\begin{aligned}
[2.0,\,1.0,\,0.5]+[0,\,0,\,-\infty]
  &=[2.0,\,1.0,\,-\infty],\\
\operatorname{softmax}([2.0,\,1.0,\,-\infty])
  &\approx[0.731,\,0.269,\,0],\\
o_i&=0.731v_1+0.269v_2+0v_3.
\end{aligned}`}
                />
                <p><strong>因此，Mask 并不需要删除 Key 或 Value 张量；它只是把通往被屏蔽 Value 的注意力权重变成零。</strong> Causal Mask 负责挡住未来位置，Padding Mask 负责挡住补齐 token；二者通常会广播到每个 batch、head 与 Query 位置后，共同参与同一次 score 修正。</p>
                <p>工程实现中不一定真的存入 IEEE <Formula inline tex={String.raw`-\infty`} />：内核也可能接收布尔 mask，或使用当前浮点类型可表示的极小有限值。稳定 Softmax 还会先减去每行最大值，但只要该行至少存在一个有效 Key，被屏蔽位置仍会得到零权重。需要特别避免某个 Query 的整行 Key 全被屏蔽；不同实现下这可能产生 <Formula inline tex={String.raw`\mathrm{NaN}`} />，或得到错误的非零分布，因此框架通常会保证至少保留一个有效位置，或采用专门的安全 masked Softmax。</p>
              </div>
            </details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Attention Is All You Need</a><span>2017</span></li>
            <li><a href="https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" target="_blank" rel="noreferrer">Improving Language Understanding by Generative Pre-Training</a><span>2018</span></li>
            <li><a href="https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf" target="_blank" rel="noreferrer">Language Models are Unsupervised Multitask Learners</a><span>2019</span></li>
            <li><a href="https://arxiv.org/abs/2005.14165" target="_blank" rel="noreferrer">Language Models are Few-Shot Learners</a><span>2020</span></li>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从 Decoder 主干继续理解 Norm、FFN 与注意力缓存。</strong></div>
          <div className="footer-links"><a href="/normalization/rmsnorm">RMSNorm ↗</a><a href="/activations/swiglu">SwiGLU ↗</a><a href="/attention/gqa">GQA ↗</a></div>
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
