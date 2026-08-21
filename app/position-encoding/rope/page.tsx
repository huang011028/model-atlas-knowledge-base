import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 RoPE？";
const description = "从二维旋转与 Query-Key 内积出发，理解 RoPE 如何把绝对位置注入注意力，并让相对位移自然进入 attention score。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "为什么需要位置"],
  ["02", "二维旋转的定义"],
  ["03", "相对位置如何出现"],
  ["04", "多频率位置编码"],
  ["05", "复数形式与直觉"],
  ["06", "在 Attention 中实现"],
  ["07", "长上下文与外推"],
  ["08", "与 Qwen 的关系"],
  ["09", "关联 QA"],
];

const qaQuestions = [
  "RoPE 为什么只作用于 Query 和 Key，不作用于 Value？",
  "RoPE 没有给输入加位置向量，模型怎么知道绝对位置？",
  "旋转基数与旋转频率分别表示什么？",
  "RoPE 在任意长度上都有定义，为什么仍会超出上下文窗口？",
  "位置 0 的 token 会发生旋转吗？",
  "head dimension 是奇数时怎么办？",
  "KV Cache 中保存的是旋转前还是旋转后的 Key？",
  "YaRN 和 RoPE 是同一种位置编码吗？",
  "q_m 只是第 m 个位置，为什么可以乘旋转矩阵？",
];

export default function RoPEPage() {
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
          <a href="/attention/gqa">GQA</a>
          <a href="/attention/qkv-bias">QKV Bias</a>
          <a href="/attention/qk-norm">QK-Norm</a>
        </div>
        <div className="rail-group">
          <p>07 · 位置编码与上下文</p>
          <a className="selected" href="/position-encoding/rope">RoPE</a>
          <a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a>
        </div>
      </aside>

      <main className="article rms-article rope-article">
        <section className="hero rms-hero rope-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 位置编码与上下文 <span>/</span> RoPE</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 005</span></div>
          <p className="original-question">“什么是 RoPE？为什么把 Query 和 Key 旋转一下，就能同时表达绝对位置与相对距离？它又为什么会影响长上下文外推？”</p>
          <div className="eyebrow"><span></span> POSITION ENCODING · 01</div>
          <h1>什么是 RoPE？</h1>
          <p className="dek">Rotary Position Embedding 不把位置向量直接加到 token embedding 上，而是按照 token 位置旋转 Query 与 Key。旋转后的点积会自然依赖两个 token 的相对位移。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>24 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first">
            <span>一句话答案</span>
            <p>RoPE 把每两维特征看成一个二维平面，让位置 <Formula inline tex={String.raw`m`} /> 对应一次角度为 <Formula inline tex={String.raw`m\theta`} /> 的旋转；由于旋转矩阵满足 <Formula inline tex={String.raw`R(m\theta)^{\mathsf T}R(n\theta)=R((n-m)\theta)`} />，Query 与 Key 的内积会直接包含相对位置 <Formula inline tex={String.raw`n-m`} />。</p>
          </aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>WHY POSITION IS NEEDED</p><h2>Self-Attention 为什么必须补充位置信息？</h2></div></div>
          <p>普通 Self-Attention 根据 token 内容生成 Query、Key 与 Value。若没有位置编码，同时对输入序列做同一个置换，输出也只会跟着做同一个置换；模型能看见“有哪些 token”，却没有天然机制区分它们的先后次序。</p>
          <Formula label="不含位置时的置换等变性" tex={String.raw`\operatorname{Attn}(PX)=P\operatorname{Attn}(X)`} />
          <p>这里 <Formula inline tex={String.raw`P`} /> 是任意置换矩阵。语言显然不是词袋：“狗追猫”和“猫追狗”包含相同 token，却表达不同关系。因此模型必须把位置注入计算。绝对位置 embedding 选择把位置向量加到输入；RoPE 则选择修改 Query 与 Key 的几何方向。</p>
          <aside className="boundary-box"><b>Causal Mask 与位置编码不是一回事</b><p>Causal Mask 只规定当前位置能看哪些位置，防止看到未来；位置编码则告诉 Attention，被看到的 token 分别位于哪里、相隔多远。二者在 Decoder-only 模型中通常同时存在。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>ROTATION IN TWO DIMENSIONS</p><h2>把两维特征旋转，具体做了什么？</h2></div></div>
          <p>先取 Query 或 Key 中相邻的两个维度，把它们看成二维向量。二维旋转矩阵为：</p>
          <Formula label="二维旋转矩阵" tex={String.raw`R(\phi)=\begin{bmatrix}\cos\phi&-\sin\phi\\[0.2em]\sin\phi&\cos\phi\end{bmatrix}`} />
          <p>对位于序列位置 <Formula inline tex={String.raw`m`} /> 的向量，RoPE 使用角度 <Formula inline tex={String.raw`\phi_m=m\theta`} />。设原始二维特征为 <Formula inline tex={String.raw`[x_0,x_1]^{\mathsf T}`} />，旋转后得到：</p>
          <Formula label="位置 m 对应的特征旋转" tex={String.raw`\begin{bmatrix}\widetilde x_0\\[0.2em]\widetilde x_1\end{bmatrix}=R(m\theta)\begin{bmatrix}x_0\\[0.2em]x_1\end{bmatrix}=\begin{bmatrix}x_0\cos(m\theta)-x_1\sin(m\theta)\\[0.2em]x_0\sin(m\theta)+x_1\cos(m\theta)\end{bmatrix}`} />
          <p>旋转保持向量长度不变，只改变方向：<Formula inline tex={String.raw`\lVert R(\phi)x\rVert_2=\lVert x\rVert_2`} />。因此它不会像直接缩放那样系统性放大或缩小 Query、Key 的范数，而是让同一份内容特征在不同位置呈现不同相位。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>RELATIVE POSITION IN THE DOT PRODUCT</p><h2>为什么旋转后，Attention 会感知相对位置？</h2></div></div>
          <p>设位置 <Formula inline tex={String.raw`m`} /> 的 Query 为 <Formula inline tex={String.raw`q_m`} />，位置 <Formula inline tex={String.raw`n`} /> 的 Key 为 <Formula inline tex={String.raw`k_n`} />。这里下标 <Formula inline tex={String.raw`m`} /> 只是位置标签；<Formula inline tex={String.raw`q_m`} /> 不是位置值或标量，而是由该位置的 hidden state 投影得到的向量：</p>
          <Formula label="位置标签与 Query 向量" tex={String.raw`q_m=h_mW_Q\in\mathbb{R}^{d_h},\qquad q_m^{(r)}=\begin{bmatrix}q_{m,2r}\\q_{m,2r+1}\end{bmatrix}\in\mathbb{R}^{2}`} />
          <p>二维旋转矩阵实际乘的是第 <Formula inline tex={String.raw`r`} /> 对特征 <Formula inline tex={String.raw`q_m^{(r)}`} />。位置 <Formula inline tex={String.raw`m`} /> 只用来确定这一对维度应该旋转多少角度。把逐对旋转简写到整个向量上，就得到：</p>
          <Formula label="旋转后的 Query 与 Key" tex={String.raw`\widetilde q_m=R(m\theta)q_m,\qquad \widetilde k_n=R(n\theta)k_n`} />
          <p>Attention score 使用两者的内积。利用旋转矩阵的正交性与角度可加性，可以得到：</p>
          <div className="derivation-box">
            <p className="mini-label">关键推导 · RELATIVE OFFSET</p>
            <Formula className="dark-latex bare-latex" tex={String.raw`\begin{aligned}\widetilde q_m^{\mathsf T}\widetilde k_n&=q_m^{\mathsf T}R(m\theta)^{\mathsf T}R(n\theta)k_n\\&=q_m^{\mathsf T}R((n-m)\theta)k_n.\end{aligned}`} />
          </div>
          <p>右侧位置项只通过 <Formula inline tex={String.raw`n-m`} /> 出现，而不是分别依赖 <Formula inline tex={String.raw`m`} /> 和 <Formula inline tex={String.raw`n`} />。也就是说，向量各自携带绝对位置相位，但二者在点积中比较时，留下的是相对位移。这正是 RoPE 最重要的结构性质。</p>
          <aside className="text-note"><b>相同距离不等于相同 score</b><p>相对位置只决定旋转关系；最终 score 仍同时依赖 Query 与 Key 的内容。两个 token 间距相同，并不意味着它们的注意力权重必然相同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>MULTIPLE ROTARY FREQUENCIES</p><h2>真实模型为什么要使用很多旋转频率？</h2></div></div>
          <p>一个 Attention head 通常不只有两维。RoPE 会把参与旋转的 <Formula inline tex={String.raw`d_{\mathrm{rot}}`} /> 个维度拆成 <Formula inline tex={String.raw`d_{\mathrm{rot}}/2`} /> 对，每一对使用不同角频率。常见定义为：</p>
          <Formula label="第 r 个二维平面的角频率" tex={String.raw`\theta_r=b^{-2r/d_{\mathrm{rot}}},\qquad r=0,1,\ldots,\frac{d_{\mathrm{rot}}}{2}-1`} />
          <p><Formula inline tex={String.raw`b`} /> 是旋转基数，常见实现把它称为 <code>rope_theta</code>。位置 <Formula inline tex={String.raw`m`} /> 在第 <Formula inline tex={String.raw`r`} /> 对维度上的相位为：</p>
          <Formula label="位置、频率与相位" tex={String.raw`\phi_{m,r}=m\theta_r`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>高频维度</h3><p><Formula inline tex={String.raw`\theta_r`} /> 较大，位置前进一步就旋转较多，对局部顺序和短距离变化更敏感。</p></div></article>
            <article><span>02</span><div><h3>低频维度</h3><p><Formula inline tex={String.raw`\theta_r`} /> 较小，完成一圈需要更长距离，可以在更大尺度上缓慢改变相位。</p></div></article>
            <article><span>03</span><div><h3>多尺度组合</h3><p>不同频率共同工作，使 Attention 能同时利用局部邻接与较长距离关系，而不是只依赖单一周期。</p></div></article>
          </div>
          <aside className="boundary-box"><b>周期性不等于位置会简单重复</b><p>单个二维频率会周期旋转，但许多不同频率组合后的整体相位模式具有更丰富的区分能力；实际可用长度仍受训练分布、数值精度和频率设计共同限制。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>COMPLEX-NUMBER VIEW</p><h2>为什么 RoPE 也常被写成复数乘法？</h2></div></div>
          <p>二维旋转等价于复平面上的相位乘法。把一对实数特征写成复数 <Formula inline tex={String.raw`z_r=x_{2r}+\mathrm{i}x_{2r+1}`} />，位置 <Formula inline tex={String.raw`m`} /> 的旋转就是：</p>
          <Formula label="复数形式的旋转" tex={String.raw`\widetilde z_{m,r}=z_r\exp(\mathrm{i}m\theta_r)`} />
          <p>复数的模长对应二维向量长度，复数的辐角对应方向。乘上 <Formula inline tex={String.raw`\exp(\mathrm{i}m\theta_r)`} /> 不改变模长，只把相位增加 <Formula inline tex={String.raw`m\theta_r`} />。两个位置做共轭内积时，相位相减：</p>
          <Formula label="内积中的相位差" tex={String.raw`\overline{\widetilde z_{m,r}}\,\widetilde z_{n,r}=\overline{z_{m,r}}z_{n,r}\exp(\mathrm{i}(n-m)\theta_r)`} />
          <p>这与旋转矩阵推导完全等价。工程代码通常仍使用实数张量和成对的 <Formula inline tex={String.raw`\sin`} />、<Formula inline tex={String.raw`\cos`} />；复数形式主要帮助理解“绝对相位进入、相对相位留下”。</p>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>INSIDE ATTENTION</p><h2>RoPE 在 Attention 的哪一步执行？</h2></div></div>
          <p>模型先从 hidden state 投影出 Query、Key、Value，再对 Query 与 Key 的 rotary dimensions 应用位置旋转，最后计算缩放点积注意力：</p>
          <Formula label="RoPE Attention 的计算顺序" tex={String.raw`\begin{aligned}Q&=XW_Q,\qquad K=XW_K,\qquad V=XW_V,\\\widetilde Q&=\operatorname{RoPE}(Q),\qquad \widetilde K=\operatorname{RoPE}(K),\\\operatorname{Attn}(X)&=\operatorname{softmax}\!\left(\frac{\widetilde Q\widetilde K^{\mathsf T}}{\sqrt{d_h}}+M\right)V.\end{aligned}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>不旋转 Value</h3><p>位置信息的核心作用点是 Query–Key 相似度。Value 承载被读取的内容，使用已经包含位置关系的 attention weights 完成加权即可。</p></div></article>
            <article><span>02</span><div><h3>可以只旋转部分维度</h3><p>若 <Formula inline tex={String.raw`d_{\mathrm{rot}}<d_h`} />，只有前一部分 head dimensions 成对旋转，其余维度保持不变；这通常称为 partial rotary。</p></div></article>
            <article><span>03</span><div><h3>与 GQA 兼容</h3><p>GQA 改变 Query heads 与 KV heads 的共享关系；RoPE 改变各位置的 Q/K 表示。共享 Key 在写入 KV Cache 前完成旋转，之后可供同组 Query heads 使用。</p></div></article>
            <article><span>04</span><div><h3>KV Cache 保存旋转后的 Key</h3><p>历史位置的 Key 相位固定，可以旋转一次后缓存；新 token 只需按自己的位置旋转 Query 与新 Key，无需每一步重旋整段历史。</p></div></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>CONTEXT EXTENSION</p><h2>公式能算到任意位置，为什么还需要 YaRN？</h2></div></div>
          <p>从数学形式看，只要给出位置 <Formula inline tex={String.raw`m`} />，就能计算任意大的 <Formula inline tex={String.raw`m\theta_r`} />。但模型只在某个训练长度内学过这些相位组合；超过训练分布后，低频与高频维度会进入模型未充分适应的区域，attention pattern 和数值行为都可能退化。</p>
          <aside className="answer-first"><span>关键区别</span><p><b>“位置函数有定义”不等于“模型学会在该位置工作”。</b> RoPE 提供坐标系统，训练数据决定模型熟悉坐标系统中的哪一段。</p></aside>
          <p>长上下文方法通常不改变“旋转 Q/K”这一框架，而是重新映射位置或频率，使更长的真实位置落入更合适的相位范围。可抽象写成：</p>
          <Formula label="上下文扩展中的位置或频率重标定" tex={String.raw`\phi_{m,r}=f(m,\theta_r;L_{\mathrm{train}},L_{\mathrm{target}})`} />
          <p>Position Interpolation、NTK-aware scaling 与 YaRN 对不同频率采取的缩放策略并不完全相同。YaRN 可以理解为一套面向 RoPE 的上下文扩展方法：它对频率区间进行有区别的插值与外推，并配合 attention scale 等处理；它不是另一种与 RoPE 并列、完全无关的位置编码。</p>
          <aside className="boundary-box"><b>扩窗仍然需要验证</b><p>修改配置中的最大长度或旋转基数，不会自动保证长文检索和生成质量。外推方案通常需要适配训练或长上下文微调，并通过不同位置、不同距离的任务验证。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>BACK TO QWEN</p><h2>RoPE 在 Qwen 演进中扮演什么角色？</h2></div></div>
          <p>初代 Qwen 就把 RoPE 与 RMSNorm、SwiGLU 一起纳入现代 Decoder 基线。后续模型继续沿用旋转位置表示，同时通过长上下文训练与 YaRN 等外推方法扩大可服务长度。理解这条线时应把三个问题分开：</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>位置如何进入 Attention</h3><p>由 RoPE 决定：位置相位被注入 Query 与 Key，点积保留相对位移。</p></div></article>
            <article><span>02</span><div><h3>模型学过多长的序列</h3><p>由预训练和长上下文训练的数据分布决定，不能只从公式或配置上限推断。</p></div></article>
            <article><span>03</span><div><h3>部署能否承载长上下文</h3><p>还取决于 GQA、KV Cache、Attention kernel、显存容量和并发目标。</p></div></article>
          </div>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>回到 Qwen 文档时，可以把 RoPE 看作“位置坐标系”；RMSNorm 控制隐状态尺度，SwiGLU 改造 FFN，GQA 则减少需要缓存的 K/V heads。</p><a href="/#chapter-2">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>09</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>RoPE 为什么只作用于 Query 和 Key，不作用于 Value？</summary><div><p>位置关系需要改变的是“当前位置应该关注谁”，这由 Query–Key score 决定。Softmax 后的权重已经包含位置影响，再用它们聚合 Value 即可。旋转 Value 并不是标准 RoPE 定义所需要的步骤。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>RoPE 没有给输入加位置向量，模型怎么知道绝对位置？</summary><div><p>位置 <Formula inline tex={String.raw`m`} /> 通过旋转角 <Formula inline tex={String.raw`m\theta_r`} /> 进入每对 Q/K 维度，因此单个向量携带绝对位置对应的相位；当 Q 与 K 做内积时，两者绝对相位相减，score 中自然出现相对位置。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>旋转基数与旋转频率分别表示什么？</summary><div><p>基数 <Formula inline tex={String.raw`b`} /> 控制一组频率如何跨维度分布；第 <Formula inline tex={String.raw`r`} /> 对维度的角频率常写为 <Formula inline tex={String.raw`\theta_r=b^{-2r/d_{\mathrm{rot}}}`} />。基数变大通常会使部分维度旋转得更慢，但它对已训练模型的影响不能只凭单个直觉判断。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>RoPE 在任意长度上都有定义，为什么仍会超出上下文窗口？</summary><div><p>公式可计算不代表模型见过对应相位分布。超出训练长度后，模型会面对新的相位组合、距离模式和数值范围，因此可能发生注意力退化。长上下文需要外推策略、适配训练和实际评测共同保证。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>位置 0 的 token 会发生旋转吗？</summary><div><p>不会。因为 <Formula inline tex={String.raw`R(0\cdot\theta_r)=I`} />，位置 0 的所有二维特征保持原样。若实现采用不同 position offset，则“第一个实际 token”的位置编号可能不一定是 0。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>head dimension 是奇数时怎么办？</summary><div><p>旋转需要成对维度，因此 rotary dimension 通常配置为偶数。若整个 head dimension 为奇数，必须只选择偶数个维度参与旋转，并让剩余维度保持不变；常见模型配置会直接避免这种不规则情况。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>KV Cache 中保存的是旋转前还是旋转后的 Key？</summary><div><p>标准增量解码通常缓存已经按各自历史位置旋转过的 Key，以及未旋转的 Value。历史 Key 的位置不会变化，所以不必在每个生成步骤重新旋转。具体张量布局由推理 kernel 决定，但数学语义应等价。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>YaRN 和 RoPE 是同一种位置编码吗？</summary><div><p>不是同一层级。RoPE 是把位置编码进 Q/K 的基本机制；YaRN 是扩展 RoPE 上下文范围的一套缩放与训练方法。可以使用 RoPE 而不使用 YaRN，也可以在 RoPE 模型上引入 YaRN 做长上下文适配。</p></div></details>
            <details id="qa-9">
              <summary><span>Q9</span><span className="qa-question"><Formula inline tex={String.raw`q_m`} />只是第<Formula inline tex={String.raw`m`} />个位置，为什么可以乘旋转矩阵？</span></summary>
              <div>
                <p>因为 <Formula inline tex={String.raw`m`} /> 与 <Formula inline tex={String.raw`q_m`} /> 是两种不同对象。<Formula inline tex={String.raw`m`} /> 是一个整数位置编号；<Formula inline tex={String.raw`q_m`} /> 是第 <Formula inline tex={String.raw`m`} /> 个 token 的 hidden state 经过 Query projection 后得到的 <Formula inline tex={String.raw`d_h`} /> 维特征向量。因此，可以对 <Formula inline tex={String.raw`q_m`} /> 做线性变换。</p>
                <Formula className="compact-latex qa-latex" tex={String.raw`m\in\mathbb{Z},\qquad h_m\in\mathbb{R}^{d_{\mathrm{model}}},\qquad q_m=h_mW_Q\in\mathbb{R}^{d_h}`} />
                <p>RoPE 并不是拿一个 <Formula inline tex={String.raw`2\times2`} /> 矩阵直接乘任意长度的完整向量。它先把参与旋转的维度两两分组，然后让每个二维特征对子乘一个对应频率的旋转矩阵：</p>
                <Formula className="compact-latex qa-latex" tex={String.raw`q_m^{(r)}=\begin{bmatrix}q_{m,2r}\\q_{m,2r+1}\end{bmatrix},\qquad \widetilde q_m^{(r)}=R(m\theta_r)q_m^{(r)}`} />
                <p>若把所有二维旋转同时写成一个完整矩阵，它就是由许多 <Formula inline tex={String.raw`2\times2`} /> 旋转块组成的分块对角矩阵：</p>
                <Formula className="compact-latex qa-latex" tex={String.raw`\mathcal R_m=\operatorname{diag}\!\left(R(m\theta_0),R(m\theta_1),\ldots,R(m\theta_{d_{\mathrm{rot}}/2-1})\right),\qquad \widetilde q_m=\mathcal R_mq_m`} />
                <p><strong>所以更准确的说法是：位置编号 <Formula inline tex={String.raw`m`} /> 决定旋转矩阵的角度，而旋转矩阵作用在位置 <Formula inline tex={String.raw`m`} /> 上的 Query 特征向量 <Formula inline tex={String.raw`q_m`} /> 上。</strong> 如果采用 partial rotary，未参与旋转的剩余维度对应单位矩阵，保持原值。</p>
              </div>
            </details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2104.09864" target="_blank" rel="noreferrer">RoFormer: Enhanced Transformer with Rotary Position Embedding</a><span>2021</span></li>
            <li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">Attention Is All You Need</a><span>2017</span></li>
            <li><a href="https://arxiv.org/abs/2302.13971" target="_blank" rel="noreferrer">LLaMA: Open and Efficient Foundation Language Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2309.00071" target="_blank" rel="noreferrer">YaRN: Efficient Context Window Extension of Large Language Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从位置表示继续理解 Decoder 主干、GQA 与长上下文 KV Cache。</strong></div>
          <div className="footer-links"><a href="/architecture/decoder-only">Decoder-only ↗</a><a href="/attention/gqa">GQA ↗</a><a href="/">Qwen 演进 ↗</a></div>
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
