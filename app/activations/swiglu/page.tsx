import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";
import { SiLUPlotPopover } from "../../components/SiLUPlotPopover";

const title = "什么是 SwiGLU？";
const description = "从 Swish、GLU 到 SwiGLU，理解现代大语言模型前馈网络中的门控计算、参数量与工程取舍。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "它不只是激活函数"],
  ["02", "从 Swish 与 GLU 出发"],
  ["03", "完整计算过程"],
  ["04", "门控究竟做了什么"],
  ["05", "参数量为什么是 8d/3"],
  ["06", "为什么现代 LLM 常用"],
  ["07", "与其他激活方式比较"],
  ["08", "关联 QA"],
];

const qaQuestions = [
  "SwiGLU 和 SiLU 是同一个东西吗？",
  "为什么不直接把普通 FFN 的 GELU 换成 SiLU？",
  "SwiGLU 一定比 GELU 更好吗？",
  "它会让 FFN 变成稀疏网络吗？",
  "可以直接把训练好的 GELU FFN 换成 SwiGLU 吗？",
  "在 Qwen 里它位于哪里？",
];

export default function SwiGLUPage() {
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
          <a className="selected" href="/activations/swiglu">SwiGLU</a>
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

      <main className="article rms-article swiglu-article">
        <section className="hero rms-hero swiglu-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 激活函数与前馈网络 <span>/</span> SwiGLU</div>
          <div className="question-label"><span>USER QUESTION · 002</span></div>
          <p className="original-question">“什么是 SwiGLU？它和 Swish、SiLU、GLU、GELU 分别是什么关系？为什么现代 Decoder LLM 普遍在 FFN 中使用它？”</p>
          <div className="eyebrow"><span></span> ACTIVATION &amp; FFN · 01</div>
          <h1>什么是 SwiGLU？</h1>
          <p className="dek">它不是把 ReLU 换成另一个曲线那么简单，而是让两条线性分支相乘：一条生成内容，另一条用 Swish / SiLU 学习一扇连续的门。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>18 分钟阅读</span><i></i><span>文字 + 公式导读</span></div>
          <aside className="answer-first">
            <span>一句话答案</span>
            <p>SwiGLU 是一种<b>门控前馈网络</b>：对同一个 token 做两次不同的升维投影，一条经过 SiLU 后作为门，与另一条逐元素相乘，最后再投影回模型维度。</p>
          </aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>MORE THAN AN ACTIVATION</p><h2>SwiGLU 不只是一个激活函数</h2></div></div>
          <p>先看普通 Transformer FFN。对某个 token 的隐状态<Formula inline tex={String.raw`\boldsymbol{x}\in\mathbb{R}^{d}`} />，它通常先升维、经过非线性函数，再降回模型维度：</p>
          <Formula label="普通 FFN" tex={String.raw`\operatorname{FFN}(\boldsymbol{x})=\phi(\boldsymbol{x}W_1+\boldsymbol{b}_1)W_2+\boldsymbol{b}_2`} />
          <p>这里真正的“激活函数”只是<Formula inline tex={String.raw`\phi`} />。如果<Formula inline tex={String.raw`\phi`} />取 ReLU 或 GELU，仍然只有一条升维分支。SwiGLU 则把这条分支改成两条，并在中间做逐元素乘法，因此它描述的是一整个 FFN 子结构。</p>
          <Formula label="SwiGLU FFN · 常见无偏置写法" tex={String.raw`\operatorname{FFN}_{\mathrm{SwiGLU}}(\boldsymbol{x})=\left[\operatorname{SiLU}(\boldsymbol{x}W_g)\odot(\boldsymbol{x}W_u)\right]W_d`} />
          <aside className="text-note"><b>名称容易造成误解</b><p>工程代码可能把整个模块叫作 MLP、FFN、FeedForward 或 SwiGLU。只有 SiLU / Swish 是逐元素激活曲线；SwiGLU 还包含 gate、up、down 三个可学习投影。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>SWISH + GLU</p><h2>名字从哪里来：先理解 Swish 与 GLU</h2></div></div>
          <p>第一块积木是 Sigmoid。它把任意实数压到<Formula inline tex={String.raw`(0,1)`} />之间：</p>
          <Formula label="Sigmoid" tex={String.raw`\sigma(z)=\frac{1}{1+e^{-z}}`} />
          <p>Swish 用输入自身乘上一个 Sigmoid 门。原始形式带有参数<Formula inline tex={String.raw`\beta`} />；现代深度学习框架里常见的 SiLU 对应<Formula inline tex={String.raw`\beta=1`} />：</p>
          <div className="formula-sequence swiglu-sequence">
            <div><span>Swish</span><Formula className="sequence-latex" tex={String.raw`\operatorname{Swish}_{\beta}(z)=z\,\sigma(\beta z)`} /></div>
            <div><span>SiLU</span><Formula className="sequence-latex" tex={String.raw`\operatorname{SiLU}(z)=z\,\sigma(z)`} /></div>
            <div><span>GLU</span><Formula className="sequence-latex" tex={String.raw`\operatorname{GLU}(\boldsymbol{a},\boldsymbol{b})=\boldsymbol{a}\odot\sigma(\boldsymbol{b})`} /></div>
            <div><span>SwiGLU</span><Formula className="sequence-latex" tex={String.raw`\operatorname{SwiGLU}(\boldsymbol{a},\boldsymbol{b})=\operatorname{Swish}_{\beta}(\boldsymbol{a})\odot\boldsymbol{b}`} /></div>
          </div>
          <p>所以“SwiGLU”可以拆成<Formula inline tex={String.raw`\text{Swish}+\text{GLU}`} />：它保留 GLU 的两分支相乘，但把 Sigmoid 门的形式换成 Swish。不同论文和代码会交换两条分支的字母或矩阵名，乘法结构本身不变。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>FORWARD PASS</p><h2>一个 token 究竟经过了哪些计算？</h2></div></div>
          <p>设输入维度为<Formula inline tex={String.raw`d`} />，SwiGLU 的中间维度为<Formula inline tex={String.raw`m`} />。同一个输入先被复制到 gate 与 up 两条投影路径。</p>
          <div className="transformer-formulas swiglu-forward">
            <div><span>01 · 两条升维分支</span><Formula className="dark-latex bare-latex" tex={String.raw`\boldsymbol{g}=\boldsymbol{x}W_g,\qquad \boldsymbol{u}=\boldsymbol{x}W_u,\qquad \boldsymbol{g},\boldsymbol{u}\in\mathbb{R}^{m}`} /></div>
            <div><span>02 · 激活并逐元素相乘</span><Formula className="dark-latex bare-latex" tex={String.raw`\boldsymbol{m}=\operatorname{SiLU}(\boldsymbol{g})\odot\boldsymbol{u}`} /></div>
            <div><span>03 · 降回模型维度</span><Formula className="dark-latex bare-latex" tex={String.raw`\boldsymbol{y}=\boldsymbol{m}W_d,\qquad \boldsymbol{y}\in\mathbb{R}^{d}`} /></div>
          </div>
          <p>符号<Formula inline tex={String.raw`\odot`} />表示逐元素乘法，不是矩阵乘法。也就是说，第<Formula inline tex={String.raw`j`} />个中间通道的输出只由两条分支各自的第<Formula inline tex={String.raw`j`} />个值共同决定：</p>
          <Formula label="单个中间通道" tex={String.raw`m_j=\operatorname{SiLU}(g_j)\,u_j`} />
          <aside className="text-note"><b>矩阵方向可能不同</b><p>有的资料把向量写成列向量，于是公式会变成<Formula inline tex={String.raw`W_g\boldsymbol{x}`} />。这只是记号约定，不改变 gate、up、down 三次投影的含义。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>WHAT THE GATE LEARNS</p><h2>门控到底在“控制”什么？</h2></div></div>
          <p>可以把 up 分支理解为候选内容，把 gate 分支理解为一组由当前 token 动态生成的通道权重。但这个“门”不是只能开或关的二进制开关。</p>
          <div className="compare-columns swiglu-branches">
            <article><p className="mini-label">CONTENT BRANCH</p><h3>Up：提供候选内容</h3><Formula className="card-latex" tex={String.raw`\boldsymbol{u}=\boldsymbol{x}W_u`} /><ul><li>把输入映射到中间特征空间</li><li>每个 token 得到不同的内容向量</li><li>自身不经过激活函数</li></ul></article>
            <article className="accent-card"><p className="mini-label">GATE BRANCH</p><h3>Gate：调制每个通道</h3><Formula className="card-latex accent-latex" tex={String.raw`\boldsymbol{s}=\operatorname{SiLU}(\boldsymbol{x}W_g)`} /><ul><li>权重可以接近零、为正或为负</li><li>按 token 动态改变内容分支</li><li>与 up 分支逐通道相乘</li></ul></article>
          </div>
          <p>这种乘法让 FFN 不再只是“线性变换 → 固定曲线 → 线性变换”。两条独立投影可以学习输入相关的乘性交互，从而用一条分支调制另一条分支。</p>
          <aside className="boundary-box"><b>“门控”不等于“稀疏路由”</b><p>SwiGLU 的 gate 通常是连续且稠密的；它不会像 <a className="term-link" href="/ffn/moe">MoE</a> router 那样把 token 分配给少数专家，也不保证大量通道严格变成零。两者都使用“gate”这个词，但计算目标不同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>PARAMETER MATCHING</p><h2>为什么中间维度经常接近<Formula inline tex={String.raw`8d/3`} />？</h2></div></div>
          <p>如果普通 FFN 使用经典的<Formula inline tex={String.raw`d_{\mathrm{ff}}=4d`} />，忽略 bias 后，两块矩阵大约有：</p>
          <Formula label="普通 FFN 参数量" tex={String.raw`d\cdot4d+4d\cdot d=8d^2`} />
          <p>SwiGLU 有 gate、up 两块升维矩阵和一块 down 矩阵。若其中间宽度是<Formula inline tex={String.raw`m`} />，参数量大约为：</p>
          <Formula label="SwiGLU 参数量" tex={String.raw`d\cdot m+d\cdot m+m\cdot d=3dm`} />
          <div className="derivation-box swiglu-derivation">
            <p className="mini-label">保持参数量大致相当 · PARAMETER MATCHING</p>
            <Formula className="dark-latex bare-latex" tex={String.raw`3dm\approx8d^2`} />
            <Formula className="dark-latex bare-latex therefore" tex={String.raw`m\approx\frac{8}{3}d`} />
          </div>
          <p>因此，若想与宽度为<Formula inline tex={String.raw`4d`} />的普通 FFN 保持近似参数量，SwiGLU 的中间维度可取约<Formula inline tex={String.raw`8d/3`} />。实际模型还会把它取整到适合硬件并行的倍数，所以配置值不一定精确等于这个分数。</p>
          <aside className="text-note"><b>不要只比较 intermediate size</b><p>同一个<Formula inline tex={String.raw`m`} />下，SwiGLU 比单分支 FFN 多一块输入投影。比较模型规模或计算量时，应同时看矩阵数量、实际中间维度、bias 与张量并行切分方式。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>WHY MODERN LLMS USE IT</p><h2>为什么它成为现代 Decoder LLM 的常见选择？</h2></div></div>
          <p>最可靠的答案是“经验效果与工程成熟度共同推动”，而不是某一个数学性质单独保证了更强模型。提出 Transformer GLU 变体的工作报告了相对 ReLU / GELU 的质量改进，之后 PaLM、LLaMA、Qwen 等路线进一步验证了这类结构的大规模可用性。</p>
          <div className="reason-list">
            <article><span>01</span><div><h3>门控带来输入相关的乘性交互</h3><p>两条投影不是共享参数的重复计算。gate 分支可以根据 token 表示，对 up 分支的每个中间通道进行不同的放大、抑制或符号调制。</p></div></article>
            <article><span>02</span><div><h3 className="reason-title-with-action"><span>SiLU 是平滑的自门控非线性</span><SiLUPlotPopover /></h3><p><Formula inline tex={String.raw`z\,\sigma(z)`} />在零点附近连续平滑，并保留一部分负值信息。它不像 ReLU 那样在负半轴全部硬截断，但“平滑”本身并不自动等于更高质量。</p></div></article>
            <article><span>03</span><div><h3>参数预算可以公平匹配</h3><p>把中间维度从经典的<Formula inline tex={String.raw`4d`} />缩到约<Formula inline tex={String.raw`8d/3`} />，可以让三矩阵 SwiGLU 与两矩阵 FFN 的参数量保持在相近量级。</p></div></article>
            <article><span>04</span><div><h3>主流训练与推理栈已经成熟</h3><p>连续内存布局、融合算子和张量并行实现已经普遍支持 gated MLP。它因此从论文中的变体，变成现代 Decoder 架构的常规组件。</p></div></article>
          </div>
          <aside className="boundary-box"><b>SwiGLU 不一定天然更快</b><p>它需要两次输入投影与一次输出投影，并包含逐元素乘法。相对速度取决于匹配后的中间维度、融合 kernel、硬件和并行策略；质量、参数量与延迟需要分别测量。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>ACTIVATION FAMILY</p><h2>与 ReLU、GELU、SiLU、GLU 有什么区别？</h2></div></div>
          <div className="norm-table-wrap">
            <table className="norm-table activation-table">
              <thead><tr><th>方法</th><th>核心形式</th><th>双投影门控</th><th>负值处理</th><th>在 FFN 中的角色</th></tr></thead>
              <tbody>
                <tr><td>ReLU</td><td><Formula inline tex={String.raw`\max(0,z)`} /></td><td>否</td><td>全部截为 0</td><td>单分支激活</td></tr>
                <tr><td>GELU</td><td><Formula inline tex={String.raw`z\Phi(z)`} /></td><td>否</td><td>平滑保留一部分</td><td>单分支激活</td></tr>
                <tr><td>Swish / SiLU</td><td><Formula inline tex={String.raw`z\sigma(z)`} /></td><td>否</td><td>平滑保留一部分</td><td>单个激活函数</td></tr>
                <tr><td>GLU</td><td><Formula inline tex={String.raw`\boldsymbol{a}\odot\sigma(\boldsymbol{b})`} /></td><td><b>是</b></td><td>取决于两分支</td><td>门控子结构</td></tr>
                <tr className="highlight-row"><td>SwiGLU</td><td><Formula inline tex={String.raw`\operatorname{Swish}(\boldsymbol{a})\odot\boldsymbol{b}`} /></td><td><b>是</b></td><td>平滑、可为负</td><td>门控 FFN</td></tr>
              </tbody>
            </table>
          </div>
          <p>一句话区分：SiLU / Swish 是一条曲线；GLU 是“两分支相乘”的模板；SwiGLU 是把 Swish 放进这个门控模板形成的 FFN 结构。</p>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>08</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>SwiGLU 和 SiLU 是同一个东西吗？</summary><div><p>不是。SiLU 是标量激活函数<Formula inline tex={String.raw`z\sigma(z)`} />；SwiGLU 是使用 SiLU 的双分支门控 FFN。一个是曲线，一个是包含多块投影矩阵的网络结构。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>为什么不直接把普通 FFN 的 GELU 换成 SiLU？</summary><div><p>直接替换只能得到单分支 SiLU FFN，缺少 gate 与 up 两条独立投影之间的逐元素乘法。SwiGLU 的关键变化既包括激活曲线，也包括门控结构。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>SwiGLU 一定比 GELU 更好吗？</summary><div><p>不能脱离模型与训练配方下结论。原始 Transformer 实验和多个成功 LLM 提供了有利经验，但最终效果还取决于参数预算、中间维度、初始化、数据、优化器和训练规模。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>它会让 FFN 变成稀疏网络吗？</summary><div><p>通常不会。SiLU 输出是连续值，绝大多数通道未必严格为零。SwiGLU 的“gate”表示连续调制，不等同于 ReLU 激活稀疏，也不等同于 <a className="term-link" href="/ffn/moe">MoE</a> 的专家稀疏。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>可以直接把训练好的 GELU FFN 换成 SwiGLU 吗？</summary><div><p>不可以直接等价替换。矩阵数量、参数形状和模型函数都发生了变化，通常需要从训练阶段采用对应架构，或进行专门的结构迁移与再训练。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>在 Qwen 里它位于哪里？</summary><div><p>它位于每个 Decoder block 的 FFN / MLP 子层，与 Attention 子层交替工作。RMSNorm 负责进入子层前的尺度控制，SwiGLU 则负责 token 内部的非线性通道变换。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文与架构资料</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2002.05202" target="_blank" rel="noreferrer">GLU Variants Improve Transformer</a><span>2020</span></li>
            <li><a href="https://arxiv.org/abs/1612.08083" target="_blank" rel="noreferrer">Language Modeling with Gated Convolutional Networks</a><span>2016</span></li>
            <li><a href="https://arxiv.org/abs/1710.05941" target="_blank" rel="noreferrer">Searching for Activation Functions</a><span>2017</span></li>
            <li><a href="https://arxiv.org/abs/2302.13971" target="_blank" rel="noreferrer">LLaMA: Open and Efficient Foundation Language Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2309.16609" target="_blank" rel="noreferrer">Qwen Technical Report</a><span>2023</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>回到 Qwen 的现代 Decoder 基线，或继续理解 FFN 之前的 RMSNorm。</strong></div>
          <div className="footer-links"><a href="/">Qwen 演进 ↗</a><a href="/normalization/rmsnorm">RMSNorm ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "08" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>8 章</span><div><i></i></div><small>公式密度 · 中等</small></div>
      </aside>
    </div>
  );
}
