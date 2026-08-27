import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 Dual Chunk Attention？";
const description = "从训练长度、服务上限和有效理解长度出发，用完整例子理解 Dual Chunk Attention 如何把超长上下文中的 RoPE 相对距离映射回训练范围。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "先回答适用情形"],
  ["02", "四种长度不要混淆"],
  ["03", "为什么不直接训练 1M"],
  ["04", "真正的问题在哪里"],
  ["05", "先看一个完整例子"],
  ["06", "块内位置怎么保留"],
  ["07", "远端信息怎么读取"],
  ["08", "相邻块为何特殊处理"],
  ["09", "三条路径如何合并"],
  ["10", "DCA 的能力边界"],
  ["11", "Qwen 中的真实用法"],
  ["12", "关联 QA"],
];

const qaQuestions = [
  "原生 128K 想扩展到 1M，属于 DCA 的适用情形吗？",
  "在原生 128K 内找不到开头信息，应该使用 DCA 吗？",
  "为什么不直接训练 1M 上下文模型？",
  "配置里的 maxlen 就是模型真正学过的长度吗？",
  "DCA 是否把很早的 token 丢掉了？",
  "为什么 Key 的位置可以在每个 Chunk 中重复？",
  "明明有三条路径，为什么名字叫 Dual Chunk？",
  "三条 Attention 结果是简单相加或平均吗？",
  "DCA 会把 Attention 的复杂度从二次降到线性吗？",
  "DCA 和 Chunked Prefill、Sliding Window Attention 有什么区别？",
  "DCA 和 YaRN 有什么区别？可以一起使用吗？",
];

export default function DualChunkAttentionPage() {
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
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a className="selected" href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article dca-article">
        <section className="hero rms-hero dca-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 位置编码与上下文 <span>/</span> Dual Chunk Attention</div>
          <div className="question-label"><span>FOUNDATION CONCEPT · 007</span></div>
          <p className="original-question">“模型原本支持 128K，现在想处理 1M，和模型在 128K 内容易忘记开头，是同一个问题吗？既然目标是 1M，为什么不直接训练 1M？”</p>
          <div className="eyebrow"><span></span> CONTEXT EXTRAPOLATION · 01</div>
          <h1>什么是 Dual Chunk Attention？</h1>
          <p className="dek">Dual Chunk Attention，简称 DCA，是一种长上下文长度外推方法。它主要解决模型面对超过训练长度的序列时，RoPE 中 Query 与 Key 的相对位置距离落入未见范围的问题。</p>
          <div className="hero-meta"><span>更新于 2026.08.19</span><i></i><span>35 分钟阅读</span><i></i><span>背景 → 问题 → 例子 → 公式</span></div>
          <aside className="answer-first"><span>先给结论</span><p>如果模型真正学过的长度是 <Formula inline tex={String.raw`128\mathrm K`} />，现在希望它免训练或少训练地处理 <Formula inline tex={String.raw`1\mathrm M`} />，这属于 DCA 针对的情形。若输入没有超过模型真正学过且验证过的 <Formula inline tex={String.raw`128\mathrm K`} />，只是模型检索不到开头信息，DCA 通常不是直接对症的方案。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>START WITH THE SCENARIO</p><h2>你的两个理解中，哪一个更接近 DCA？</h2></div></div>
          <div className="reason-list compact-reasons dca-relation-list">
            <article><span>YES</span><div><h3>原本学到 128K，希望处理 1M</h3><p>这是典型的<b>长度外推</b>：目标输入长度超过模型训练时见过的位置和相对距离。DCA 通过重新映射过大的 RoPE 相对位置，尝试让模型在不继续更新权重的情况下工作到更长长度。</p></div></article>
            <article><span>NO</span><div><h3>输入仍在原生 128K 内，但容易忘记开头</h3><p>这更像<b>有效长上下文能力不足</b>。原因可能是训练数据没有教会模型检索远端信息、Attention 被无关 token 稀释、提问方式不清晰或模型规模不足。DCA 不会自动让重要内容获得更高权重。</p></div></article>
            <article><span>CHECK</span><div><h3>服务配置只允许 128K，希望直接改成 1M</h3><p>先判断 128K 是训练边界、模型配置边界，还是显存与服务调度边界。DCA 只处理位置外推；它不会凭空提供容纳 1M KV Cache 所需的显存和计算。</p></div></article>
          </div>
          <aside className="boundary-box"><b>更准确的一句话</b><p>DCA 解决的是 <strong className="keep-together">“距离坐标超出训练分布”，</strong>不是泛化地解决“模型记忆力不好”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>FOUR DIFFERENT LENGTHS</p><h2>谈 maxlen 之前，先把四种长度分开</h2></div></div>
          <p>日常说“模型 maxlen 是 128K”时，可能混合了四件不同的事。判断是否需要 DCA，最重要的是先找到模型<b>真正在哪个长度上训练过</b>。</p>
          <div className="reason-list compact-reasons dca-relation-list">
            <article><span>TRAIN</span><div><h3>训练长度 <Formula inline tex={String.raw`L_{\mathrm{train}}`} /></h3><p>模型在预训练或长上下文微调中实际见过的序列长度。它决定模型熟悉哪些 RoPE 相位与相对距离，是 DCA 最关心的边界。</p></div></article>
            <article><span>CONFIG</span><div><h3>配置长度 <Formula inline tex={String.raw`L_{\mathrm{config}}`} /></h3><p>例如 <code>max_position_embeddings</code>。它说明实现允许生成多大的位置编号，但把配置数字改大并不代表模型已经学会这些位置。</p></div></article>
            <article><span>SERVICE</span><div><h3>服务长度 <Formula inline tex={String.raw`L_{\mathrm{serve}}`} /></h3><p>推理服务出于 KV Cache、显存、吞吐和并发限制而设置的接收上限。即使位置外推成立，服务也可能仍装不下目标长度。</p></div></article>
            <article><span>EFFECTIVE</span><div><h3>有效长度 <Formula inline tex={String.raw`L_{\mathrm{effective}}`} /></h3><p>通过长文检索、跨段推理等测试确认，模型在多远距离上仍能可靠使用信息。它往往小于接口宣称的最大窗口。</p></div></article>
          </div>
          <Formula label="DCA 的基本适用条件" tex={String.raw`L_{\mathrm{target}}>L_{\mathrm{train}},\qquad \text{且主要障碍来自 RoPE 的长度外推}`} />
          <p>所以，“128K 想到 1M”不能只看两个数字。若 <Formula inline tex={String.raw`128\mathrm K=L_{\mathrm{train}}`} />，DCA 可能适用；若 128K 只是服务为了显存设置的上限，DCA 本身并不能解决资源限制。</p>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>WHY NOT TRAIN AT ONE MILLION</p><h2>既然目标是 1M，为什么不直接训练 1M？</h2></div></div>
          <p><b>可以直接训练，而且原生长序列训练通常更可靠；困难主要是成本。</b> Transformer 的标准全注意力要让每个 Query 与序列中的 Keys 计算关系。序列长度从 <Formula inline tex={String.raw`128\mathrm K`} /> 增加到 <Formula inline tex={String.raw`1\mathrm M`} />，长度约变为 8 倍，Attention score 的潜在交互规模近似变为：</p>
          <Formula label="全注意力交互规模随长度平方增长" tex={String.raw`\frac{(1\mathrm M)^2}{(128\mathrm K)^2}\approx\left(\frac{1000}{128}\right)^2\approx61`} />
          <p>这不是说整次训练一定精确变慢 61 倍，因为 kernel、并行和稀疏化会改变实际比例；但它说明长序列训练的 Attention、激活显存、通信与吞吐压力会急剧增加。除此之外，还需要足够多且真正依赖长距离信息的高质量 1M 训练样本，否则模型可能只是“能装下长文本”，没有学会使用远端信息。</p>
          <div className="reason-list compact-reasons dca-relation-list">
            <article><span>COMPUTE</span><div><h3>一次长样本极其昂贵</h3><p>全注意力计算近似按 <Formula inline tex={String.raw`L^2`} /> 增长；MLP 激活、KV、梯度与优化器状态也带来额外显存压力。</p></div></article>
            <article><span>DATA</span><div><h3>1M 高质量训练数据稀缺</h3><p>简单把许多无关文档拼接到 1M，不一定能教会跨几十万 token 的检索和推理，还可能浪费大量算力。</p></div></article>
            <article><span>TRADE-OFF</span><div><h3>短文本仍占绝大多数使用场景</h3><p>若训练预算过多投入 1M 序列，单位时间见到的 token 数和样本多样性会下降，还要防止短任务能力退化。</p></div></article>
          </div>
          <p>因此常见路线不是“完全不做长训练”，而是<b>分阶段折中</b>：</p>
          <Formula label="现实中的渐进路线" tex={String.raw`\text{大量短序列训练}\ \longrightarrow\ \text{较少的长序列适配}\ \longrightarrow\ \text{DCA 外推到目标长度}`} />
          <aside className="answer-first"><span>关键取舍</span><p>训练负责让模型真正学会长距离任务；DCA 负责把已经学到的能力以较低成本外推到更长坐标。预算充足时，更多原生长序列训练通常更稳；DCA 的价值是减少“必须在最终目标长度上训练”的成本。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>WHAT ACTUALLY BREAKS</p><h2>超过训练长度后，RoPE 的哪一部分出了问题？</h2></div></div>
          <p>标准 RoPE 按位置旋转 Query 和 Key。设 Query 位于绝对位置 <Formula inline tex={String.raw`i`} />，Key 位于位置 <Formula inline tex={String.raw`j`} />，旋转后的内积为：</p>
          <Formula label="RoPE 让 Attention score 依赖相对距离" tex={String.raw`\widetilde q_i^{\mathsf T}\widetilde k_j=q_i^{\mathsf T}R((j-i)\theta)k_j`} />
          <p>模型训练长度若为 <Formula inline tex={String.raw`c`} />，它主要学习过 <Formula inline tex={String.raw`|i-j|<c`} /> 的相对距离。现在让位于第 <Formula inline tex={String.raw`900\mathrm K`} /> 个位置的 Query 读取第 <Formula inline tex={String.raw`10\mathrm K`} /> 个位置的 Key，真实距离约为：</p>
          <Formula label="1M 上下文中可能出现的训练外距离" tex={String.raw`|i-j|=|900\mathrm K-10\mathrm K|=890\mathrm K\gg128\mathrm K`} />
          <p>公式可以算出这个旋转角，但模型从未在训练中学过如此大的相对距离。就像一个人只学会了读 <Formula inline tex={String.raw`0`} /> 到 <Formula inline tex={String.raw`128\mathrm K`} /> 的刻度，现在直接给他一把延伸到 <Formula inline tex={String.raw`1\mathrm M`} /> 的尺子：刻度在数学上存在，但他没有学过如何利用这些新刻度。</p>
          <aside className="answer-first"><span>DCA 的策略</span><p>不要让 RoPE 直接看到 <Formula inline tex={String.raw`890\mathrm K`} /> 这样的训练外距离；把长序列分块，再将块内、相邻块和远端块的距离分别映射回 <Formula inline tex={String.raw`[0,c-1]`} /> 内。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>A COMPLETE TOY EXAMPLE</p><h2>先用 18 个 token 看完整流程</h2></div></div>
          <p>为了能把每个位置写出来，先缩小数字。假设模型只在长度 <Formula inline tex={String.raw`c=10`} /> 内训练过，现在要处理 <Formula inline tex={String.raw`L=18`} /> 个 token。选择 Chunk Size <Formula inline tex={String.raw`s=6<c`} />，序列被切成三块：</p>
          <Formula label="三个 Chunks 的绝对位置" tex={String.raw`C_0=[0,1,2,3,4,5],\quad C_1=[6,7,8,9,10,11],\quad C_2=[12,13,14,15,16,17]`} />
          <p>DCA 给所有 Key 使用循环的块内坐标：</p>
          <Formula label="每个 Chunk 都重复使用 0 到 5" tex={String.raw`P_k=[0,1,2,3,4,5\mid0,1,2,3,4,5\mid0,1,2,3,4,5]`} />
          <p>现在观察绝对位置 <Formula inline tex={String.raw`i=14`} /> 的 Query。它位于 <Formula inline tex={String.raw`C_2`} />，块内位置为 <Formula inline tex={String.raw`p_i=14\bmod6=2`} />。这个 Query 读取不同区域的 Keys 时，不使用同一套 Query 位置：</p>
          <div className="reason-list compact-reasons dca-relation-list">
            <article><span>INTRA</span><div><h3>读取当前块 <Formula inline tex={String.raw`C_2`} /></h3><p>Query 使用块内位置 <Formula inline tex={String.raw`2`} />。对位置 12、13、14 的 Keys，有效距离分别是 <Formula inline tex={String.raw`2,1,0`} />，局部顺序完整保留。</p></div></article>
            <article><span>SUCCESSIVE</span><div><h3>读取相邻前一块 <Formula inline tex={String.raw`C_1`} /></h3><p>Query 使用一套平移后的坐标，使位置 11、10 等相邻历史 token 仍保持距离 <Formula inline tex={String.raw`3,4,\ldots`} />，避免跨过 Chunk 边界后突然变成远距离。</p></div></article>
            <article><span>INTER</span><div><h3>读取更早的块 <Formula inline tex={String.raw`C_0`} /></h3><p>Query 使用训练窗口末端坐标 <Formula inline tex={String.raw`c-1=9`} />。对 <Formula inline tex={String.raw`C_0`} /> 的 Keys，有效距离被压缩到 <Formula inline tex={String.raw`4`} /> 至 <Formula inline tex={String.raw`9`} />，不再使用真实的超长距离。</p></div></article>
          </div>
          <aside className="boundary-box"><b>最关键的理解</b><p>不是把 Query 复制成三个 token，也不是把文本切开后分别生成答案。同一个 Query 内容向量 <Formula inline tex={String.raw`q_{14}`} />，只是面对三类 Keys 时使用三套不同的 RoPE 位置坐标。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>STEP ONE · INTRA</p><h2>第一步：当前 Chunk 内保留精确相对位置</h2></div></div>
          <p>设绝对位置 <Formula inline tex={String.raw`i`} /> 和 <Formula inline tex={String.raw`j`} /> 位于同一个 Chunk。DCA 对 Query 与 Key 都使用块内坐标：</p>
          <Formula label="块内坐标" tex={String.raw`P_q^{\mathrm{Intra}}[i]=P_k[i]=i\bmod s`} />
          <Formula label="块内有效距离等于真实局部距离" tex={String.raw`\Delta_{ij}^{\mathrm{Intra}}=(i\bmod s)-(j\bmod s)=i-j`} />
          <p>最后一个等号只在两者位于同一个 Chunk 时成立。由于 <Formula inline tex={String.raw`|i-j|<s<c`} />，模型看到的仍是训练中熟悉的局部距离。语法搭配、相邻词关系、当前段落中的指代因而能够保留较高的位置精度。</p>
          <aside className="text-note"><b>如果只有 Intra 会怎样？</b><p>模型只能读取当前 Chunk，更早的内容会被截断。这能避免位置越界，却会彻底失去长距离信息，所以还需要 Inter-Chunk Attention。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>STEP TWO · INTER</p><h2>第二步：更早 Chunks 仍可访问，但距离被压缩</h2></div></div>
          <p>Key 的位置继续使用 <Formula inline tex={String.raw`P_k[j]=j\bmod s`} />，这样历史 Key 写入 KV Cache 后无需为不同 Query 重新编码。对相隔超过一个 Chunk 的远端 Keys，Query 使用常数位置：</p>
          <Formula label="远端 Query 固定在训练窗口末端" tex={String.raw`P_q^{\mathrm{Inter}}[i]=c-1`} />
          <Formula label="远端有效距离始终位于训练范围" tex={String.raw`\Delta_{ij}^{\mathrm{Inter}}=(c-1)-(j\bmod s)\in[c-s,c-1]`} />
          <p>无论真实 Key 距离当前 Query 是 <Formula inline tex={String.raw`20\mathrm K`} />、<Formula inline tex={String.raw`200\mathrm K`} /> 还是 <Formula inline tex={String.raw`800\mathrm K`} />，RoPE 看到的距离都被映射进训练窗口远端。Key 的<b>内容没有消失</b>，但模型不再精确知道它相隔了多少个完整 Chunks。</p>
          <aside className="boundary-box"><b>获得什么，牺牲什么？</b><p>获得的是对任意早期内容的访问，以及不越过训练边界的位置距离；牺牲的是远端 Chunks 之间的精确距离。不同远端块中具有相同块内位置的 Keys，可能获得相同的位置编码关系，模型主要依靠内容来区分它们。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>STEP THREE · SUCCESSIVE</p><h2>第三步：为什么相邻前一块不能直接当作远端块？</h2></div></div>
          <p>假设 Query 是第二个 Chunk 的第一个 token，前一个 Key 恰好是第一个 Chunk 的最后一个 token。真实文本中二者相邻，距离应为 <Formula inline tex={String.raw`1`} />。若直接套用 Inter 映射，它们可能被表示成较远距离，Chunk 边界会人为切断局部连续性。</p>
          <p>DCA 因此保留一个相邻窗口 <Formula inline tex={String.raw`w`} />。论文中可取 <Formula inline tex={String.raw`w=c-s`} />，并让当前块前 <Formula inline tex={String.raw`w`} /> 个 Query 使用平移后的坐标：</p>
          <Formula label="相邻块 Query 的位置映射" tex={String.raw`P_q^{\mathrm{Succ}}[p]=\begin{cases}s+p,&0\le p<w,\\c-1,&w\le p<s,\end{cases}\qquad p=i\bmod s`} />
          <p>回到 <Formula inline tex={String.raw`c=10,s=6,w=4`} /> 的例子，当前块的 Query 位置依次使用：</p>
          <Formula label="Successive Query 位置示例" tex={String.raw`P_q^{\mathrm{Succ}}=[6,7,8,9,9,9]`} />
          <p>当前块第一个 Query 使用位置 <Formula inline tex={String.raw`6`} />，前一块最后一个 Key 使用位置 <Formula inline tex={String.raw`5`} />，二者有效距离正好是 <Formula inline tex={String.raw`1`} />。这条路径专门修复相邻 Chunk 边界附近的局部关系。</p>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>ONE ATTENTION, THREE RULES</p><h2>三条路径最终如何组成一次 Attention？</h2></div></div>
          <p>对 Query <Formula inline tex={String.raw`q_i`} /> 与历史 Key <Formula inline tex={String.raw`k_j`} />，先计算它们分别位于第几个 Chunk：</p>
          <Formula label="位置 t 所属的 Chunk 编号" tex={String.raw`b_t=\left\lfloor\frac{t}{s}\right\rfloor`} />
          <p>然后根据 <Formula inline tex={String.raw`b_i-b_j`} /> 的值，在下面三条规则中选择一条。拆开以后可以看到，三行的 Key 旋转完全相同，真正变化的是 Query 使用哪套位置坐标：</p>
          <div className="formula-sequence dca-score-rules">
            <div><span>INTRA · 同一块</span><Formula className="bare-latex dca-rule-latex" tex={String.raw`S_{ij}=\left\langle R(P_q^{\mathrm{Intra}}[i]\theta)q_i,\ R(P_k[j]\theta)k_j\right\rangle,\qquad b_i-b_j=0`} /></div>
            <div><span>SUCCESSIVE · 前一块</span><Formula className="bare-latex dca-rule-latex" tex={String.raw`S_{ij}=\left\langle R(P_q^{\mathrm{Succ}}[i]\theta)q_i,\ R(P_k[j]\theta)k_j\right\rangle,\qquad b_i-b_j=1`} /></div>
            <div><span>INTER · 更早块</span><Formula className="bare-latex dca-rule-latex" tex={String.raw`S_{ij}=\left\langle R(P_q^{\mathrm{Inter}}[i]\theta)q_i,\ R(P_k[j]\theta)k_j\right\rangle,\qquad b_i-b_j>1`} /></div>
          </div>
          <p>得到所有允许的 scores 后，数学上仍执行一次统一的 Causal Softmax：</p>
          <Formula label="所有历史 Keys 共同竞争注意力权重" tex={String.raw`p_{ij}=\frac{\exp(S_{ij}/\sqrt{d_h})}{\sum_{r=0}^{i}\exp(S_{ir}/\sqrt{d_h})},\qquad o_i=\sum_{j=0}^{i}p_{ij}v_j`} />
          <p>为了使用 FlashAttention，工程实现可以分别计算 Intra、Successive 和 Inter 三块，再用 LogSumExp 对各分区的归一化常数进行合并。它不是把三路结果简单平均，而是保持与全局 Softmax 一致的权重竞争。</p>
          <Formula label="分区结果的等价合并" tex={String.raw`o_i=\sum_a\frac{Z_i^{(a)}}{\sum_b Z_i^{(b)}}o_i^{(a)},\qquad Z_i^{(a)}=\sum_{j\in\mathcal J_a}\exp(S_{ij})`} />
        </section>

        <section className="prose-section" id="chapter-10">
          <div className="prose-heading"><span>10</span><div><p>SCOPE AND LIMITS</p><h2>DCA 能做什么，不能做什么？</h2></div></div>
          <div className="compare-columns">
            <article className="accent-card"><span>CAN DO</span><h3>处理训练长度外的位置距离</h3><ul><li>把过大的 RoPE 相对位置映射回训练范围</li><li>保留精细的块内与相邻块局部关系</li><li>让 Query 继续访问更早 Chunks 的内容</li><li>不更新模型权重也可以部署和评测</li></ul></article>
            <article><span>CANNOT GUARANTEE</span><h3>不能自动获得完美的长文理解</h3><ul><li>不能保证模型在原生窗口内不忽略开头</li><li>不能恢复远端 Chunks 的精确距离尺度</li><li>不能消除 1M KV Cache 的显存需求</li><li>不能自动把完整 Attention 变成线性复杂度</li></ul></article>
          </div>
          <p>如果三类路径合起来仍访问全部历史 Keys，Prefill 的主要 Query–Key 交互数仍为：</p>
          <Formula label="完整历史访问仍具有二次规模" tex={String.raw`\sum_{i=0}^{L-1}(i+1)=\frac{L(L+1)}{2}=\mathcal O(L^2)`} />
          <aside className="boundary-box"><b>因此 1M 部署通常还需要其他技术</b><p>DCA 负责“位置能否外推”；稀疏 Attention 负责“是否减少点积”；Chunked Prefill 负责“如何分批执行 Prefill”；GQA、KV Cache 量化与分布式推理负责“历史状态如何装进设备”。这些技术可以同时出现，但职责不同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-11">
          <div className="prose-heading"><span>11</span><div><p>REAL QWEN EXAMPLES</p><h2>Qwen 中的真实例子正好对应哪种情形？</h2></div></div>
          <div className="reason-list compact-reasons dca-relation-list">
            <article><span>QWEN2</span><div><h3><Formula inline tex={String.raw`32\mathrm K`} /> 训练，外推到更长窗口</h3><p>Qwen2 官方说明：Instruct 模型在 32K 上下文上训练，再通过 YaRN 或 DCA 外推。7B 与 72B Instruct 型号公布的上下文长度达到 128K。这是“训练长度小于目标长度”的标准场景。</p></div></article>
            <article><span>QWEN2.5-1M</span><div><h3><Formula inline tex={String.raw`256\mathrm K`} /> 训练，DCA 外推到 <Formula inline tex={String.raw`1\mathrm M`} /></h3><p>Qwen2.5-1M 先通过逐步训练把上下文扩展到 256K，再用 DCA 将过大的相对位置重新映射，从 256K 外推到 1M。它同时使用稀疏 Attention 与 Chunked Prefill 处理推理效率问题。</p></div></article>
          </div>
          <p>因此，你提出的“原生 128K 想处理 1M”在问题类型上是正确理解。不过不能由此推断任意 128K 模型只要打开 DCA 就一定可靠支持 1M：模型规模、原始 RoPE 配置、Chunk Size、推理 kernel、显存资源和目标任务都需要实际验证。</p>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>在 Qwen 的长上下文系统中，DCA 解决位置外推；长序列训练塑造真实能力；稀疏 Attention、Chunked Prefill 和 KV Cache 工程共同解决 1M 推理成本。</p><a href="/#chapter-2">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>12</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>原生 128K 想扩展到 1M，属于 DCA 的适用情形吗？</summary><div><p>如果这里的 128K 是模型真正训练并适配过的长度，而目标 1M 超出了训练长度，那么属于 DCA 所针对的长度外推问题。但还要修改推理实现与服务上限，并解决 1M KV Cache、Prefill 计算量和显存问题；DCA 只负责其中的位置外推部分。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>在原生 128K 内找不到开头信息，应该使用 DCA 吗？</summary><div><p>通常不应把 DCA 当作首选修复。此时相对距离仍位于模型训练或适配范围内，失败更可能来自长文本训练不足、信息稀释、检索与推理能力、Prompt 结构或模型容量。应该先用 Needle、Passkey、跨段推理等测试定位，再考虑长上下文训练、RAG、内容结构化或专门的 Attention 方法。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>为什么不直接训练 1M 上下文模型？</summary><div><p>可以直接训练，而且通常更可靠；代价是全注意力交互近似按 <Formula inline tex={String.raw`L^2`} /> 增长，激活显存、设备通信和训练吞吐压力很大，还缺少大量真正依赖超长距离的高质量数据。工程上常先用短序列学习通用能力，再逐步训练到一个可承受的长窗口，最后用 DCA 外推剩余长度。预算充足时，DCA 不是原生长训练的完全替代品。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>配置里的 maxlen 就是模型真正学过的长度吗？</summary><div><p>不是。配置上限只说明实现允许的最大位置或服务接收长度。模型真正学过的长度要看预训练、持续预训练和 SFT 的数据长度；真正可靠的长度还要看长文评测。改大 <code>max_position_embeddings</code> 不等于完成长上下文训练。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>DCA 是否把很早的 token 丢掉了？</summary><div><p>完整 DCA 不会只保留当前 Chunk。较早 token 仍通过 Inter-Chunk 路径参与 Attention，Value 内容也仍可进入输出。被压缩的是远端 token 的精确位置距离，而不是 token 内容本身。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>为什么 Key 的位置可以在每个 Chunk 中重复？</summary><div><p>DCA 希望历史 Key 写入 KV Cache 后保持一套固定表示，因此让每个 Chunk 的 Key 均使用 <Formula inline tex={String.raw`0,1,\ldots,s-1`} />。针对不同关系的变化放在 Query 位置上：当前块使用 Intra 坐标，相邻块使用 Successive 坐标，远端块使用 Inter 坐标。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>明明有三条路径，为什么名字叫 Dual Chunk？</summary><div><p>名称强调最核心的双重关系：同一 Chunk 内与不同 Chunks 之间。Successive-Chunk 是 Inter-Chunk 的特殊情况，用于修复相邻块边界的局部连续性，因此完整实现最终包含三条计算路径。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>三条 Attention 结果是简单相加或平均吗？</summary><div><p>不是。数学上先为所有历史 Keys 按所属区域选用对应 score 规则，再统一做一次 Softmax。工程上若分成三次 FlashAttention，则必须用各分区的 LogSumExp 归一化常数重新加权，才能与全局 Softmax 等价。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>DCA 会把 Attention 的复杂度从二次降到线性吗？</summary><div><p>通常不会。若 Intra、Successive 与 Inter 合起来仍覆盖全部历史 Keys，Prefill 仍有 <Formula inline tex={String.raw`\mathcal O(L^2)`} /> 次 Query–Key 交互。FlashAttention 改善显存 I/O；若要减少点积数量，还需要稀疏 Attention 等额外机制。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span>DCA 和 Chunked Prefill、Sliding Window Attention 有什么区别？</summary><div><p>DCA 改变的是 RoPE 位置映射；Chunked Prefill 是把长 Prompt 分批调度，通常不改变数学结果；Sliding Window Attention 则限制每个 Query 只看附近 Keys，会直接舍弃窗口外连接。三者分别处理位置外推、执行调度和连接稀疏化。</p></div></details>
            <details id="qa-11"><summary><span>Q11</span>DCA 和 YaRN 有什么区别？可以一起使用吗？</summary><div><p>YaRN 对 RoPE 频率与尺度做全局重标定；DCA 按 Key 所属区域切换 Query 的位置坐标。原始 DCA 项目说明它可与 YaRN、Position Interpolation、NTK-aware RoPE 等外推方法组合，但实际联合配置仍需长文评测确认。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>原始论文、实现与 Qwen 官方说明</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/2402.17463" target="_blank" rel="noreferrer">Training-Free Long-Context Scaling of Large Language Models</a><span>ICML 2024</span></li>
            <li><a href="https://github.com/HKUNLP/ChunkLlama" target="_blank" rel="noreferrer">HKUNLP / ChunkLlama · Official DCA Implementation</a><span>GitHub</span></li>
            <li><a href="https://qwenlm.github.io/zh/blog/qwen2/" target="_blank" rel="noreferrer">Qwen2 官方博客 · 32K 训练与长上下文外推</a><span>2024</span></li>
            <li><a href="https://qwenlm.github.io/zh/blog/qwen2.5-1m/" target="_blank" rel="noreferrer">Qwen2.5-1M 官方博客 · 256K 到 1M</a><span>2025</span></li>
            <li><a href="https://arxiv.org/abs/2104.09864" target="_blank" rel="noreferrer">RoFormer: Enhanced Transformer with Rotary Position Embedding</a><span>2021</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从 DCA 继续理解 RoPE 坐标系、长上下文训练与 1M 推理系统。</strong></div>
          <div className="footer-links"><a href="/position-encoding/rope">RoPE ↗</a><a href="/attention/gqa">GQA ↗</a><a href="/">Qwen 演进 ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "12" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>12 章</span><div><i></i></div><small>公式密度 · 中等</small></div>
      </aside>
    </div>
  );
}
