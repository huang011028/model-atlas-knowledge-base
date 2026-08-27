import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 Long-CoT Cold Start？";
const description = "从 Reasoning RL 的初始策略出发，理解 Long-CoT Cold Start 的数据构造、监督目标、训练作用，以及它与普通 SFT、蒸馏和纯 RL 的区别。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "名字到底是什么意思"],
  ["02", "位于训练流程哪里"],
  ["03", "一条样本包含什么"],
  ["04", "如何筛选问题"],
  ["05", "如何生成与过滤轨迹"],
  ["06", "监督训练目标"],
  ["07", "为什么不能直接 RL"],
  ["08", "与相邻概念的边界"],
  ["09", "收益、风险与案例"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "这里的 Cold Start 是从随机参数开始训练吗？",
  "Long-CoT 的 Long 是输入上下文很长吗？",
  "冷启动本质上是不是一次 SFT？",
  "既然纯 RL 也可能涌现推理，为什么还需要冷启动？",
  "冷启动数据必须由人类逐条编写吗？",
  "为什么问题必须可验证，而且不能太简单？",
  "训练数据越多、训练步数越长不是越好吗？",
  "冷启动与知识蒸馏有什么区别？",
  "冷启动后模型已经具备最终推理能力了吗？",
  "Long-CoT Cold Start 会不会只是让模型模仿推理格式？",
];

export default function LongCoTColdStartPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页"><span className="brand-mark">模</span><span>模见 <small>Model Atlas</small></span></a>
        <nav className="topnav" aria-label="主导航"><a className="active" href="/">知识库</a><a href="#chapter-1">训练导读</a><a href="#qa">QA 索引</a></nav>
        <div className="top-actions"><a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a><span className="edition">2026.08</span></div>
      </header>

      <aside className="left-rail" aria-label="知识库目录">
        <p className="rail-kicker">知识库</p>
        <a className="rail-home" href="/"><span>◇</span> 大模型时代</a>
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a><span className="rail-subhead">概率、采样与估计</span><a href="/foundations/importance-sampling">Importance Sampling</a></div>
        <div className="rail-group"><p>01 · 模型与架构</p><a href="/">Qwen 系列演进</a><a href="/architecture/decoder-only">Decoder-only Transformer</a><a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a><a className="locked" href="#">Llama 系列演进 <em>待更新</em></a></div>
        <div className="rail-group"><p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span><a className="selected" href="/training/long-cot-cold-start">Long-CoT Cold Start</a><a href="/training/reasoning-rl">Reasoning RL</a><span className="rail-subhead">RL 与偏好优化</span><a href="/training/rlhf">RLHF</a><a href="/training/ppo">PPO</a><a href="/training/dpo">DPO</a><a href="/training/kto">KTO</a><a href="/training/grpo">GRPO</a><span>Pre-training · 待更新</span></div>
        <div className="rail-group"><p>03 · Agent 与应用</p><a href="/agents/agent">Agent 基础</a><a href="/agents/memory">Memory</a><a href="/agents/tools">Tools</a></div>
        <div className="rail-group"><p>04 · 标准化与归一化</p><a href="/normalization/rmsnorm">RMSNorm</a></div>
        <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a href="/ffn/moe">MoE</a></div>
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article cold-start-article">
        <section className="hero rms-hero cold-start-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 训练与对齐 <span>/</span> Long-CoT Cold Start</div>
          <div className="question-label"><span>TRAINING CONCEPT · 001</span></div>
          <p className="original-question">“<a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 不是可以靠奖励自己探索推理方法吗？为什么还要先用长推理轨迹做冷启动？这个 Cold Start 和普通 SFT、蒸馏有什么区别？”</p>
          <div className="eyebrow"><span></span> REASONING POST-TRAINING · 01</div>
          <h1>什么是 Long-CoT Cold Start？</h1>
          <p className="dek">Long-CoT Cold Start 是 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 之前的一小段监督微调：用少量、可验证、经过严格过滤的长链式推理样本，把预训练模型初始化成一个会遵循推理格式、能产生部分正确轨迹且输出较可读的 RL actor。</p>
          <div className="hero-meta"><span>建立于 2026.08.20</span><i></i><span>31 分钟阅读</span><i></i><span>训练流程 + 公式导读</span></div>
          <aside className="answer-first"><span>一句话答案</span><p>它不是为了在第一阶段把推理能力“教完”，而是把初始策略从 <Formula inline tex={String.raw`\pi_{\mathrm{base}}`} /> 推到一个更适合探索的起点 <Formula inline tex={String.raw`\pi_{\mathrm{cold}}`} />：能读懂任务、输出结构化长推理、偶尔得到可验证的正确答案，然后再由 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 扩大正确轨迹的概率。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>DECODE THE NAME</p><h2>Long、CoT、Cold Start 分别指什么？</h2></div></div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Long：输出推理轨迹较长</h3><p>模型在给出最终答案前，可以展开多步推导、检查、反思和修正。这里主要描述 response 里的 reasoning trajectory，不等于训练百万 token 的输入上下文。</p></div></article>
            <article><span>02</span><div><h3>CoT：显式的 Chain of Thought</h3><p>训练目标不仅包含最终答案 <Formula inline tex={String.raw`a`} />，还包含连接问题与答案的推理序列 <Formula inline tex={String.raw`r=(r_1,\ldots,r_L)`} />。</p></div></article>
            <article><span>03</span><div><h3>Cold Start：为 RL 准备初始策略</h3><p>“冷”指 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 尚未开始，不是模型参数随机初始化。起点通常已经是充分预训练的 Base 模型。</p></div></article>
          </div>
          <Formula label="一条 Long-CoT 监督目标" tex={String.raw`x\;\longrightarrow\;y=(r_1,r_2,\ldots,r_L,a)`} />
          <aside className="boundary-box"><b>最容易误解的一点</b><p>Long-CoT Cold Start 不是长上下文技术。它训练的是“如何生成较长的推理过程”；RoPE、DCA 或 YaRN 解决的才是“模型怎样表示和处理很长的输入位置”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>THE FOUR-STAGE PIPELINE</p><h2>冷启动位于 Qwen3 后训练的哪一步？</h2></div></div>
          <p>Qwen3 的旗舰模型采用四阶段后训练。冷启动是第一阶段，输入是预训练 Base 模型，输出是 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 的初始 actor：</p>
          <div className="formula-sequence">
            <div><span>STAGE 1</span><Formula className="sequence-latex" tex={String.raw`\pi_{\mathrm{base}}\xrightarrow{\;\mathcal D_{\mathrm{cold}}\;}\pi_{\mathrm{cold}}`} /></div>
            <div><span><a className="term-link" href="/training/reasoning-rl">STAGE 2 · REASONING RL</a></span><Formula className="sequence-latex" tex={String.raw`\pi_{\mathrm{cold}}\xrightarrow{\;\mathrm{RL}_{\mathrm{reason}}\;}\pi_{\mathrm{reason}}`} /></div>
            <div><span>STAGE 3</span><Formula className="sequence-latex" tex={String.raw`\pi_{\mathrm{reason}}\xrightarrow{\;\text{Thinking Fusion}\;}\pi_{\mathrm{hybrid}}`} /></div>
            <div><span>STAGE 4</span><Formula className="sequence-latex" tex={String.raw`\pi_{\mathrm{hybrid}}\xrightarrow{\;\text{General RL}\;}\pi_{\mathrm{final}}`} /></div>
          </div>
          <p>第一阶段只负责建立基础推理模式；第二阶段在数学、代码等可验证任务上继续探索与强化；后两个阶段再把 thinking/non-thinking 合并，并改善通用指令、偏好和交互质量。</p>
          <aside className="qwen-connection"><span>BACKLINK · QWEN</span><p>这说明 Qwen3 的 Thinking 行为主要来自后训练流程，而不是在 Decoder 内新增一套“推理网络”。</p><a href="/#chapter-3">回到《Qwen 系列模型的演进》 ↗</a></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>ANATOMY OF A SAMPLE</p><h2>一条高质量冷启动样本包含什么？</h2></div></div>
          <p>可以把一条候选样本抽象为：</p>
          <Formula label="冷启动数据记录" tex={String.raw`z=(x,r,a,v,d,q)`} />
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>符号</th><th>内容</th><th>质量要求</th></tr></thead>
              <tbody>
                <tr><td><Formula inline tex={String.raw`x`} /></td><td>问题或指令</td><td>复杂、清晰、尽量可验证</td></tr>
                <tr><td><Formula inline tex={String.raw`r`} /></td><td>长推理轨迹</td><td>连贯、无大段重复、非猜测</td></tr>
                <tr><td><Formula inline tex={String.raw`a`} /></td><td>最终答案</td><td>与轨迹一致且通过验证</td></tr>
                <tr><td><Formula inline tex={String.raw`v`} /></td><td>Verifier</td><td>参考答案、规则或代码测试</td></tr>
                <tr><td><Formula inline tex={String.raw`d`} /></td><td>领域标签</td><td>支持数学、代码、逻辑、STEM 配比</td></tr>
                <tr><td><Formula inline tex={String.raw`q`} /></td><td>质量标记</td><td>正确性、语言、风格、重复等审核</td></tr>
              </tbody>
            </table>
          </div>
          <p>真正进入训练的数据通常只保留 <Formula inline tex={String.raw`(x,r,a)`} />；Verifier 和标签主要服务于构造、筛选、配比与审计。它们不一定作为文本直接喂给模型。</p>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>QUERY FILTERING</p><h2>为什么不能随便找一批问题生成长答案？</h2></div></div>
          <p>冷启动的第一道关不是生成 response，而是筛 Query。Qwen3 报告中的问题覆盖数学、代码、逻辑推理和通用 STEM，并配有参考答案或代码测试。筛选目标可写为：</p>
          <Formula label="进入候选集的基本条件" tex={String.raw`\operatorname{keep}(x)=\operatorname{verifiable}(x)\land\operatorname{requires\_reasoning}(x)\land\operatorname{well\_posed}(x)`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>排除难以验证的问题</h3><p>开放写作、主观偏好或多个子问题混合在一起，会让“答案是否正确”难以稳定判断。</p></div></article>
            <article><span>02</span><div><h3>排除不推理也能答对的问题</h3><p>过于简单的样本只会教模型把答案写长，不会建立真正需要多步求解的训练压力。</p></div></article>
            <article><span>03</span><div><h3>控制领域分布</h3><p>若数据被某一类数学题主导，模型学到的推理格式和后续 RL 探索也可能变得狭窄。</p></div></article>
          </div>
          <aside className="text-note"><b>可验证不等于只有 exact match</b><p>数学题可以使用标准答案或等价性检查，代码题可以运行 test cases，逻辑题可以用规则验证。关键是构造相对可靠的 <Formula inline tex={String.raw`v(x,a)\in\{0,1\}`} />，而不是所有任务都用字符串完全相等。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>RESPONSE GENERATION AND FILTERING</p><h2>Long-CoT 轨迹怎样从候选变成训练数据？</h2></div></div>
          <p>Qwen3 对每个问题使用强推理模型生成 <Formula inline tex={String.raw`N`} /> 个候选 response。至少一个候选通过 verifier 的概率称为 Pass@<Formula inline tex={String.raw`N`} />：</p>
          <Formula label="独立同分布近似下的 Pass@N" tex={String.raw`\operatorname{Pass@}N=1-(1-p_x)^N`} />
          <p>这里 <Formula inline tex={String.raw`p_x`} /> 是单次生成正确答案的概率。增加候选数可以提高找到正确轨迹的机会，但“最终答案正确”仍不等于“推理过程适合监督”。因此还要进行 response filtering：</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>正确性</h3><p>最终答案或代码必须通过参考答案、测试用例或人工核验。</p></div></article>
            <article><span>02</span><div><h3>轨迹质量</h3><p>移除大段重复、明显猜测、前后自相矛盾，以及 reasoning 与 summary 不一致的样本。</p></div></article>
            <article><span>03</span><div><h3>语言与风格</h3><p>排除不恰当的语言混用和突兀风格切换，保证输出可读且与用户语言一致。</p></div></article>
            <article><span>04</span><div><h3>污染风险</h3><p>排查与验证集样本过度相似的候选，避免把评测答案直接带入训练。</p></div></article>
          </div>
          <aside className="boundary-box"><b>Final Answer 正确仍可能被删除</b><p>模型可能先得出错误过程，再碰巧猜中答案；也可能在长轨迹中循环数千 token。冷启动会把这些“reward 看似为 1、示范却很差”的样本挡在 SFT 之外。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>SUPERVISED OBJECTIVE</p><h2>冷启动训练时，模型到底在优化什么？</h2></div></div>
          <p>它通常使用标准 teacher-forcing 的 token-level negative log-likelihood。设目标 response 为 <Formula inline tex={String.raw`y=(r,a)`} />：</p>
          <Formula label="Long-CoT Cold Start 的监督损失" tex={String.raw`\mathcal L_{\mathrm{cold}}(\theta)=-\frac{1}{\sum_t m_t}\sum_{t=1}^{|x|+|y|}m_t\log p_\theta(y_t\mid x,y_{<t})`} />
          <p><Formula inline tex={String.raw`m_t`} /> 是 loss mask：prompt token 通常取 <Formula inline tex={String.raw`0`} />，assistant 的 reasoning 与 final answer token 取 <Formula inline tex={String.raw`1`} />。于是模型同时学习推理步骤、格式、语言风格和答案生成。</p>
          <Formula label="冷启动后的初始策略" tex={String.raw`\theta_{\mathrm{cold}}=\arg\min_\theta\;\mathbb E_{(x,y)\sim\mathcal D_{\mathrm{cold}}}\!\left[\mathcal L_{\mathrm{cold}}(\theta)\right]`} />
          <p>这一步是在模仿经过筛选的完整轨迹；它不会像 RL 一样从多个在线 rollouts 的相对 reward 中更新策略。因此冷启动与 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 的梯度来源不同。</p>
          <aside className="text-note"><b>长序列带来的训练代价</b><p>计算量近似随有效训练 token 数增长，而 Attention 还受序列长度影响。构造 Long-CoT 数据时不能只数“样本条数”，还要统计总 token、长度分布、截断率和有效 loss token。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>WHY BEFORE RL</p><h2>既然纯 RL 可能涌现推理，为什么还需要冷启动？</h2></div></div>
          <p>DeepSeek-R1-Zero 表明，不先做 SFT 也可能通过大规模 RL 涌现反思、验证和长推理。但报告同时观察到可读性差、语言混用等问题。对实际训练而言，初始策略还决定能否采样到足够多的正奖励轨迹。</p>
          <Formula label="初始成功率决定一个 batch 是否看见正样本" tex={String.raw`P(\text{至少一个正确 rollout})=1-(1-p_0)^G`} />
          <p><Formula inline tex={String.raw`p_0`} /> 是冷启动前单次成功率，<Formula inline tex={String.raw`G`} /> 是每个问题采样的 rollout 数。若 <Formula inline tex={String.raw`p_0`} /> 极低，增加采样也可能长期只得到全错组，reward 差异不足；冷启动通过抬高部分任务的 <Formula inline tex={String.raw`p_0`} />，让后续 RL 更容易获得可学习信号。</p>
          <div className="compare-columns">
            <article><span>PURE RL</span><h3>探索自由度高，但起步风险更大</h3><ul><li>可能发现超出人工示范的策略</li><li>需要更强 verifier 与更多 rollouts</li><li>输出格式、语言和可读性难控制</li><li>低成功率任务可能长期没有正样本</li></ul></article>
            <article className="accent-card"><span>COLD START → RL</span><h3>先建立最低可用策略，再继续探索</h3><ul><li>提高初始正确 rollout 概率</li><li>预先教会输出协议与结束条件</li><li>改善语言一致性和可读性</li><li>降低第一阶段探索的无效消耗</li></ul></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>CONCEPT BOUNDARIES</p><h2>它与普通 SFT、蒸馏、预训练和 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 有什么区别？</h2></div></div>
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>阶段</th><th>主要数据</th><th>直接目标</th></tr></thead>
              <tbody>
                <tr><td>Pre-training</td><td>海量通用 next-token 文本</td><td>建立语言、知识与基础能力</td></tr>
                <tr><td>通用 SFT</td><td>多任务指令—回答</td><td>学习指令遵循与交互格式</td></tr>
                <tr><td>Long-CoT Cold Start</td><td>少量严格筛选的长推理轨迹</td><td>初始化 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> actor</td></tr>
                <tr><td><a className="term-link" href="/training/reasoning-rl">Reasoning RL</a></td><td>问题、在线 rollouts、verifier reward</td><td>提高正确推理策略的概率</td></tr>
                <tr><td>Distillation</td><td>教师 logits、轨迹或生成数据</td><td>把强模型能力迁移给学生模型</td></tr>
              </tbody>
            </table>
          </div>
          <p>Cold Start 在优化形式上通常就是 SFT，但“Cold Start”描述它在训练流水线中的<b>角色</b>：小规模、位于 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 之前、目标是初始化而非完成全部对齐。若轨迹来自强教师，它也具有蒸馏色彩；但“是否使用教师”与“是否作为 RL 冷启动”是两个维度。</p>
          <aside className="boundary-box"><b>同一批数据可以有多个标签</b><p>例如强模型生成、verifier 筛选的 Long-CoT 数据，从学习机制看是监督微调，从知识来源看是轨迹蒸馏，从训练位置看则是冷启动。理解概念时要先问：这个名字在描述 objective、data source，还是 pipeline role？</p></aside>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>TRADE-OFFS AND CASES</p><h2>为什么冷启动数据不能越多越好？</h2></div></div>
          <p>Qwen3 报告明确强调：冷启动阶段的目标是灌输基础 reasoning patterns，而不是立即追求最高推理性能；因此更倾向于减少训练样本和训练步数，为后续 RL 留出提升空间。</p>
          <Formula label="冷启动的目标不是单独最大化 SFT 指标" tex={String.raw`\text{Cold-start quality}\neq\max\;\text{imitation strength};\qquad\text{goal}=\text{usable initialization}+\text{remaining exploration room}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Teacher imitation bias</h3><p>过量 SFT 会让策略过度集中在教师常用路径，后续 RL 更难探索替代解法。</p></div></article>
            <article><span>02</span><div><h3>格式过拟合</h3><p>模型可能学会把回答拉长、重复“检查一下”，但真实正确率没有同步提升。</p></div></article>
            <article><span>03</span><div><h3>错误轨迹固化</h3><p>若 verifier 只看 final answer，隐藏的逻辑错误会被 teacher forcing 当作正确 token 逐个强化。</p></div></article>
            <article><span>04</span><div><h3>领域与语言偏置</h3><p>数学、代码或某一种语言占比过高，可能使后续推理风格和泛化范围变窄。</p></div></article>
          </div>
          <p>DeepSeek-R1 的案例强调产品可读性和语言一致性；Qwen3 则详细描述了可验证 Query、多个候选 response、严格过滤和“小规模初始化”。二者共同说明，冷启动不是简单收集“越长越好”的 CoT，而是设计 RL 初始策略的工程。</p>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>这里的 Cold Start 是从随机参数开始训练吗？</summary><div><p>不是。模型通常已经完成大规模预训练，拥有语言、知识和一定推理基础。“Cold Start”指 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 的 actor 尚未经过该轮强化学习，需要先用少量 Long-CoT 数据初始化。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>Long-CoT 的 Long 是输入上下文很长吗？</summary><div><p>主要不是。这里的 Long 描述输出中的推理轨迹较长，可能包含多步推导、反思与验证。它会占用训练 sequence length，但不等价于扩大模型最大输入窗口的长上下文训练。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>冷启动本质上是不是一次 SFT？</summary><div><p>从优化 objective 看通常是 SFT：用 teacher forcing 最小化目标 response 的 token-level NLL。但 Cold Start 强调它的 pipeline role——位于 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 前、规模较小、只负责建立初始推理模式。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>既然纯 RL 也可能涌现推理，为什么还需要冷启动？</summary><div><p>纯 RL 是可行路线，DeepSeek-R1-Zero 就展示了这种可能性。但冷启动可以提高初始正确 rollout 的概率，并预先改善输出格式、可读性和语言一致性，从而降低 RL 起步阶段的探索成本与产品风险。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>冷启动数据必须由人类逐条编写吗？</summary><div><p>不必。可以由强模型为每个问题采样多个候选，再用参考答案、代码 tests、规则和人工复核筛选；也可由人工改写少量示例，再让模型扩增。关键是最终轨迹经过可靠验证和质量过滤。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>为什么问题必须可验证，而且不能太简单？</summary><div><p>可验证才能可靠筛除错误 final answer；足够复杂才能迫使模型学习真正的多步求解。如果简单问题也生成很长 response，模型更可能学到冗长格式而不是推理能力。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>训练数据越多、训练步数越长不是越好吗？</summary><div><p>不一定。冷启动只需把策略推到“可以开始有效 RL”的区域。过量模仿可能压缩策略熵、固化教师路径、放大数据偏置，让后续 RL 的探索空间反而变小。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>冷启动与知识蒸馏有什么区别？</summary><div><p>冷启动描述训练阶段的用途，蒸馏描述知识从教师向学生转移。如果 Long-CoT 由强教师生成，它可以同时是“轨迹蒸馏数据”和“RL 冷启动数据”；若样本完全由人类编写，则仍是冷启动，但不一定称为模型蒸馏。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>冷启动后模型已经具备最终推理能力了吗？</summary><div><p>没有。它只建立基础 reasoning patterns 和可用的初始成功率。Qwen3 随后还用 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 提升数学、代码等任务，再通过 Thinking Mode Fusion 与 General RL 完成双模式和通用对齐。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span>Long-CoT Cold Start 会不会只是让模型模仿推理格式？</summary><div><p>存在这种风险，所以必须使用需要真实推理且可验证的问题，并过滤“过程错误但碰巧答对”、重复和猜测轨迹。即使如此，SFT 的直接目标仍是模仿 token；更广泛的策略改进通常需要后续 RL 和严格评测来确认。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>技术报告与训练方法</h2></div>
          <ol>
            <li><a href="https://arxiv.org/html/2505.09388#S4.SS1" target="_blank" rel="noreferrer">Qwen3 Technical Report · Long-CoT Cold Start</a><span>2025</span></li>
            <li><a href="https://arxiv.org/html/2501.12948" target="_blank" rel="noreferrer">DeepSeek-R1 Technical Report</a><span>2025</span></li>
            <li><a href="https://arxiv.org/abs/2203.02155" target="_blank" rel="noreferrer">Training Language Models to Follow Instructions with Human Feedback</a><span>Preference alignment</span></li>
            <li><a href="https://arxiv.org/abs/2307.09288" target="_blank" rel="noreferrer">Llama 2: Open Foundation and Fine-Tuned Chat Models</a><span>Post-training</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>回到 Qwen3 四阶段后训练，下一步可以继续拆解 <a className="term-link" href="/training/reasoning-rl">Reasoning RL</a>、Thinking Mode Fusion 与 General RL。</strong></div>
          <div className="footer-links"><a href="/">Qwen 演进 ↗</a><a href="/training/reasoning-rl">Reasoning RL ↗</a></div>
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
