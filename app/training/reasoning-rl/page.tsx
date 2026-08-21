import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "什么是 Reasoning RL？";
const description = "聚焦大模型推理强化学习：从 prompt、rollout、Verifier、group-relative advantage 到 token-level policy update，理解 RL 如何改变长推理轨迹的概率分布。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "LLM 中的 RL 对象"],
  ["02", "训练数据不再是标准 CoT"],
  ["03", "一次 Rollout Loop"],
  ["04", "Verifier 与 Reward"],
  ["05", "Group-Relative Advantage"],
  ["06", "怎样更新每个 Token"],
  ["07", "On-policy 与 Off-policy"],
  ["08", "探索、熵与长度"],
  ["09", "能力边界与 Qwen3"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "Reasoning RL 学的是答案，还是推理过程？",
  "只有最终答案 Reward，怎么知道哪一个推理 Token 是对的？",
  "为什么同一道题要生成多条 Rollouts？",
  "一组 Rollouts 全对或全错时还能学习吗？",
  "Verifier 与 Reward Model 是一回事吗？",
  "为什么可以不训练 Value Model？",
  "模型把答案猜对但推理过程错误，会发生什么？",
  "为什么训练中常观察到回答越来越长？",
  "推理强化与普通偏好对齐有什么区别？",
  "RL 是给模型写入新知识，还是激活已有能力？",
];

export default function ReasoningRLPage() {
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
        <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a></div>
        <div className="rail-group"><p>01 · 模型与架构</p><a href="/">Qwen 系列演进</a><a href="/architecture/decoder-only">Decoder-only Transformer</a><a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a><a className="locked" href="#">Llama 系列演进 <em>待更新</em></a></div>
        <div className="rail-group"><p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span><a href="/training/long-cot-cold-start">Long-CoT Cold Start</a><a className="selected" href="/training/reasoning-rl">Reasoning RL</a><span className="rail-subhead">RL 与偏好优化</span><a href="/training/rlhf">RLHF</a><a href="/training/ppo">PPO</a><a href="/training/dpo">DPO</a><a href="/training/kto">KTO</a><a href="/training/grpo">GRPO</a><span>Pre-training · 待更新</span></div>
        <div className="rail-group muted"><p>03 · Agent 与应用</p><span>Memory</span><span>Tool Use</span></div>
        <div className="rail-group"><p>04 · 标准化与归一化</p><a href="/normalization/rmsnorm">RMSNorm</a></div>
        <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a href="/ffn/moe">MoE</a></div>
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article reasoning-rl-article">
        <section className="hero rms-hero reasoning-rl-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 训练与对齐 <span>/</span> Reasoning RL</div>
          <div className="question-label"><span>TRAINING CONCEPT · 002</span></div>
          <p className="original-question">“基础强化学习里的 state、action、reward 我理解，但放到大模型上究竟对应什么？只有最终答案对错时，RL 是怎样让整段推理变好的？”</p>
          <div className="eyebrow"><span></span> REASONING POST-TRAINING · 02</div>
          <h1>大模型的 Reasoning RL 在做什么？</h1>
          <p className="dek">它把语言模型视为一条 token policy：给定问题后采样多条完整推理轨迹，用答案 Verifier 对每条轨迹打分，再提高高分轨迹中各 token 的生成概率、压低低分轨迹的概率，从而重塑模型对“如何展开推理”的概率分布。</p>
          <div className="hero-meta"><span>建立于 2026.08.20</span><i></i><span>34 分钟阅读</span><i></i><span>LLM-specific RL + 公式</span></div>
          <aside className="answer-first"><span>一句话答案</span><p>Reasoning RL 不一定告诉模型标准推理步骤；它反复执行 <Formula inline tex={String.raw`\text{prompt}\rightarrow\text{rollouts}\rightarrow\text{verifier rewards}\rightarrow\text{policy update}`} />，把能得到正确结果的整条生成路径变得更可能。真正困难的地方在于：reward 往往只出现在序列末尾，却要更新前面成百上千个 token。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>MAP RL TO AN LLM</p><h2>State、Action、Episode 在语言模型里是什么？</h2></div></div>
          <p>设输入问题为 <Formula inline tex={String.raw`x`} />，模型已经生成前缀 <Formula inline tex={String.raw`o_{<t}=(o_1,\ldots,o_{t-1})`} />。自回归语言模型就是一个离散动作策略：</p>
          <Formula label="LLM Policy" tex={String.raw`\pi_\theta(o_t\mid s_t),\qquad s_t=(x,o_{<t}),\qquad o_t\in\mathcal V`} />
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>RL 概念</th><th>大模型中的对象</th><th>特点</th></tr></thead>
              <tbody>
                <tr><td>State</td><td>Prompt 与已生成 token 前缀</td><td>状态空间随序列增长</td></tr>
                <tr><td>Action</td><td>下一枚 token</td><td>动作空间是整个 vocabulary</td></tr>
                <tr><td>Trajectory</td><td>完整 reasoning + final answer</td><td>可达数千或更多 token</td></tr>
                <tr><td>Termination</td><td>EOS、结束标签或 max length</td><td>过早/过晚结束都会影响 reward</td></tr>
                <tr><td>Reward</td><td>Verifier 对整段输出的评分</td><td>常为稀疏 terminal reward</td></tr>
              </tbody>
            </table>
          </div>
          <Formula label="一条完整 Rollout" tex={String.raw`o=(o_1,o_2,\ldots,o_T)\sim\pi_\theta(\cdot\mid x),\qquad r=R(x,o)`} />
          <aside className="boundary-box"><b>环境通常不是开放世界</b><p>数学、代码等训练中，环境往往只在生成完成后解析答案、运行测试或调用规则 Verifier。Agent RL 才更常包含工具调用、外部状态变化和多轮环境交互。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>QUERY–VERIFIER, NOT GOLD COT</p><h2>Reasoning RL 的训练集为什么常是“问题 + Verifier”？</h2></div></div>
          <p>SFT 数据通常提供一个目标 response；Reasoning RL 数据可以只提供问题 <Formula inline tex={String.raw`x`} /> 和验证器 <Formula inline tex={String.raw`v`} />：</p>
          <Formula label="两种训练数据的根本差异" className="compact-latex" tex={String.raw`\mathcal D_{\mathrm{SFT}}=\{(x,y^*)\},\qquad \mathcal D_{\mathrm{RL}}=\{(x,v)\}`} />
          <p>模型不必逐 token 模仿唯一的 <Formula inline tex={String.raw`y^*`} />，而是自己采样候选轨迹 <Formula inline tex={String.raw`o_i`} />。只要不同路径最终通过 verifier，都可以获得正向训练信号：</p>
          <Formula label="多条不同推理路径可以共享正确 Reward" tex={String.raw`o_i\neq o_j,\qquad v(x,o_i)=v(x,o_j)=1`} />
          <p>Qwen3 公开的 Reasoning RL 数据就是 query–verifier pairs，并要求它们未用于 cold start、对冷启动模型可学习、尽可能有挑战性且覆盖广泛子领域。公开报告给出的规模是 3,995 对，而不是数百万条固定 CoT。</p>
          <aside className="text-note"><b>Verifier 是数据的一部分</b><p>同一句 Query 若没有可靠验证方法，就难以用于 outcome-based RL。数据工程不只是收集题目，还包括答案抽取、等价判断、代码沙箱、测试用例和异常处理。</p></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>THE ROLLOUT LOOP</p><h2>一次 LLM Reasoning RL 迭代具体发生什么？</h2></div></div>
          <div className="formula-sequence">
            <div><span>01 · SAMPLE QUERIES</span><Formula className="sequence-latex" tex={String.raw`x_b\sim\mathcal D_{\mathrm{RL}},\quad b=1,\ldots,B`} /></div>
            <div><span>02 · GENERATE GROUPS</span><Formula className="sequence-latex" tex={String.raw`o_{b,1},\ldots,o_{b,G}\sim\pi_{\mathrm{old}}(\cdot\mid x_b)`} /></div>
            <div><span>03 · VERIFY</span><Formula className="sequence-latex" tex={String.raw`r_{b,i}=R(x_b,o_{b,i})`} /></div>
            <div><span>04 · RELATIVE ADVANTAGE</span><Formula className="sequence-latex" tex={String.raw`A_{b,i}=\operatorname{NormalizeGroup}(r_{b,1:G})`} /></div>
            <div><span>05 · UPDATE POLICY</span><Formula className="sequence-latex" tex={String.raw`\theta\leftarrow\theta+\eta\,\widehat\nabla_\theta J(\theta)`} /></div>
          </div>
          <p><Formula inline tex={String.raw`B`} /> 是一批问题数，<Formula inline tex={String.raw`G`} /> 是每题 rollouts 数。生成通常占据大量计算：训练系统要让推理引擎批量采样长输出，再把 token、旧 log-prob、reward 和 masks 送给训练进程。</p>
          <aside className="answer-first"><span>与离线 SFT 最直观的差别</span><p>SFT 的 response 在数据集里已经固定；RL 的 response 会随当前策略变化。模型变强后，采样分布、成功率、答案长度与难例集合都会变化，因此训练数据本身是动态产生的。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>VERIFIABLE REWARDS</p><h2>Verifier 如何把一整段文本变成 Reward？</h2></div></div>
          <p>系统先从生成文本中抽取最终答案，再根据任务类型验证。一个典型组合可写为：</p>
          <Formula label="Reasoning Reward 的常见分解" tex={String.raw`R=\lambda_{\mathrm{acc}}R_{\mathrm{acc}}+\lambda_{\mathrm{fmt}}R_{\mathrm{fmt}}+\lambda_{\mathrm{lang}}R_{\mathrm{lang}}-\lambda_{\mathrm{invalid}}R_{\mathrm{invalid}}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Accuracy Reward</h3><p>数学答案做数值或符号等价判断；代码放进沙箱执行 hidden tests；选择题匹配正确选项。</p></div></article>
            <article><span>02</span><div><h3>Format Reward</h3><p>检查 reasoning/final answer 标签、答案抽取格式和是否正常结束，使 Verifier 能稳定读取结果。</p></div></article>
            <article><span>03</span><div><h3>Language / Style Reward</h3><p>可用于缓解语言混用或不可读输出，但权重过强也可能压制有效探索。</p></div></article>
            <article><span>04</span><div><h3>Invalid Penalty</h3><p>处理空回答、无法解析、超长截断、代码超时和违反执行约束等异常。</p></div></article>
          </div>
          <p>DeepSeek-R1-Zero 公开方案主要采用规则化 accuracy 与 format rewards，并指出神经 Reward Model 在大规模 reasoning RL 中可能被 reward hacking。具体模型的 reward 配方并不统一，不能把某一篇报告的权重直接当作行业标准。</p>
          <aside className="boundary-box"><b>Reward 只定义“什么会被优化”</b><p>如果 Verifier 只检查 final answer，RL 就没有直接要求中间推理真实、简洁或忠实。模型会寻找任何能提高通过率的文本策略，包括利用解析器漏洞或测试覆盖不足。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>GROUP RELATIVE POLICY OPTIMIZATION</p><h2><a className="term-link" href="/training/grpo">GRPO</a> 为什么要比较同一道题的多条回答？</h2></div></div>
          <p>对同一个问题采样 <Formula inline tex={String.raw`G`} /> 条输出，得到 rewards <Formula inline tex={String.raw`r_1,\ldots,r_G`} />。<a className="term-link" href="/training/grpo">GRPO</a> 用组内均值和标准差构造相对优势：</p>
          <Formula label="Group-Relative Advantage" tex={String.raw`\bar r=\frac{1}{G}\sum_{i=1}^{G}r_i,\qquad \sigma_r=\sqrt{\frac{1}{G}\sum_{i=1}^{G}(r_i-\bar r)^2}`} />
          <Formula tex={String.raw`A_i=\frac{r_i-\bar r}{\sigma_r+\varepsilon}`} />
          <p>这相当于让“同一道题里的更好回答”获得正 advantage，“更差回答”获得负 advantage。题目自身难度被组内 baseline 部分抵消：简单题的高 reward 不会直接压过难题，关键是每道题内部有没有可区分的样本。</p>
          <div className="compare-columns">
            <article><span><a className="term-link" href="/training/ppo">PPO</a></span><h3>通常额外训练 Value Model</h3><p>估计每个前缀的未来 return，但长 CoT 中前面错误可能被后面修正，从半条序列预测最终 reward 很困难且成本高。</p></article>
            <article className="accent-card"><span><a className="term-link" href="/training/grpo">GRPO</a></span><h3>用同组 Rewards 构造 Baseline</h3><p>不必维护与 policy 规模相近的 critic，节省显存与训练计算，更适合超大语言模型。</p></article>
          </div>
          <aside className="text-note"><b>全对或全错组的问题</b><p>若 <Formula inline tex={String.raw`r_1=\cdots=r_G`} />，则组内没有相对差异，归一化 advantage 接近 0，这道题本轮几乎不给学习信号。多 rollouts、合适题目难度和可分级 reward 都是在改善有效组比例。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>SEQUENCE REWARD, TOKEN UPDATE</p><h2>只有最终 Reward，模型怎样更新前面的每一个 Token？</h2></div></div>
          <p>对 rollout <Formula inline tex={String.raw`o_i`} /> 中第 <Formula inline tex={String.raw`t`} /> 个 token，先计算当前策略与采样策略的概率比：</p>
          <Formula label="Per-token Importance Ratio" tex={String.raw`\rho_{i,t}(\theta)=\frac{\pi_\theta(o_{i,t}\mid x,o_{i,<t})}{\pi_{\mathrm{old}}(o_{i,t}\mid x,o_{i,<t})}`} />
          <p>一个简化的 clipped surrogate objective 是：</p>
          <Formula label={<><a className="term-link" href="/training/grpo">GRPO</a> 的 Token-level Policy Objective</>} className="compact-latex" tex={String.raw`J(\theta)=\frac{1}{G}\sum_{i=1}^{G}\frac{1}{|o_i|}\sum_{t=1}^{|o_i|}\min\!\left(\rho_{i,t}A_i,\operatorname{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)A_i\right)-\beta D_{\mathrm{KL}}(\pi_\theta\Vert\pi_{\mathrm{ref}})`} />
          <p>同一个 sequence-level <Formula inline tex={String.raw`A_i`} /> 会广播给这条轨迹的所有生成 token：高分轨迹中的 token 整体被提高概率，低分轨迹中的 token 整体被压低。<Formula inline tex={String.raw`1/|o_i|`} /> 表示一种常见的长度归一化；实际实现可能采用不同 token/sequence aggregation。</p>
          <aside className="boundary-box"><b>这不是精确的步骤级 Credit Assignment</b><p>终局 reward 无法指出究竟是哪一步导致正确。错误步骤后碰巧答对时，整条轨迹也可能被强化；正确思路因最后算术错误失败时，整条轨迹也可能受罚。Process Reward、step verifier 或更细 reward shaping 才试图提供步骤级信号。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>POLICY FRESHNESS AND SYSTEMS</p><h2>On-policy、Off-policy 在 LLM Rollouts 中意味着什么？</h2></div></div>
          <p>若生成 rollouts 的行为策略就是当前正在更新的 policy，数据接近 on-policy；若训练继续复用旧策略或独立推理服务生成的样本，就出现 policy lag：</p>
          <Formula label="Behavior Policy 与 Training Policy" tex={String.raw`o\sim\mu(\cdot\mid x),\qquad \rho_t=\frac{\pi_\theta(o_t\mid x,o_{<t})}{\mu(o_t\mid x,o_{<t})}`} />
          <p>复用样本可以提高昂贵长 rollouts 的利用率，但 <Formula inline tex={String.raw`\mu`} /> 与 <Formula inline tex={String.raw`\pi_\theta`} /> 相差太大时，importance ratios 方差增大、clip 比例上升，更新会变得偏或不稳定。</p>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>Rollout Workers</h3><p>负责批量推理和随机采样，追求高吞吐、长输出与多个候选。</p></div></article>
            <article><span>02</span><div><h3>Verifier Workers</h3><p>解析答案、执行代码或规则校验，必须隔离不可信程序并记录失败类型。</p></div></article>
            <article><span>03</span><div><h3>Trainer Workers</h3><p>重算 log-probs、构造 advantages、执行反向传播并发布新权重。</p></div></article>
            <article><span>04</span><div><h3>Version Tracking</h3><p>记录每条 rollout 来自哪个 policy checkpoint，才能监控 staleness 与做正确 ratio。</p></div></article>
          </div>
          <p>Qwen3 报告称，大 batch、每个 Query 的高 rollout 数以及 off-policy training 对样本效率有益。这是其具体训练观察，不代表 off-policy 越旧越好；稳定性仍依赖策略差距、clip、更新次数和权重同步。</p>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>EXPLORATION, ENTROPY AND LENGTH</p><h2>为什么 Reasoning RL 要持续监控熵和回答长度？</h2></div></div>
          <p>Token policy 的条件熵描述在当前前缀下仍保留多少生成选择：</p>
          <Formula label="Token Policy Entropy" tex={String.raw`\mathcal H_t=-\sum_{w\in\mathcal V}\pi_\theta(w\mid s_t)\log\pi_\theta(w\mid s_t)`} />
          <div className="compare-columns">
            <article><span>ENTROPY TOO LOW</span><h3>过早 Policy Collapse</h3><p>同一道题的多条 rollouts 变得近乎相同，组内 reward 方差消失，模型难以发现替代路径。</p></article>
            <article><span>ENTROPY TOO HIGH</span><h3>无效随机探索</h3><p>输出不稳定、格式失败率上升，长序列的大部分计算花在明显错误轨迹上。</p></article>
          </div>
          <p>Qwen3 报告提到通过控制 entropy 稳定或逐步上升来平衡 exploration 与 exploitation。与此同时，训练中常看到 response length 增长，因为更多检查、回溯或替代尝试可能提高正确率；但长度本身不是能力。</p>
          <Formula label="必须区分长度与收益" tex={String.raw`\Delta\operatorname{Accuracy}>0\;\not\Leftarrow\;\Delta\operatorname{Length}>0`} />
          <aside className="boundary-box"><b>Length Hacking</b><p>如果长回答更容易碰到正确答案、获得格式分或利用 Verifier 漏洞，policy 可能学会无意义地延长输出。训练应同时监控 reward–length 相关性、截断率、重复率和固定 thinking budget 下的准确率。</p></aside>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>WHAT CHANGES AND WHAT DOES NOT</p><h2>Reasoning RL 最终改变了模型什么？</h2></div></div>
          <p>从参数层面看，它仍是在更新同一个 Decoder 的权重；没有新增运行时“搜索网络”。从行为层面看，它把概率质量重新分配给更容易获得 reward 的 trajectories：</p>
          <Formula label="策略分布的目标变化" tex={String.raw`\mathbb E_{o\sim\pi_{\theta_{\mathrm{after}}}}[R(x,o)]>\mathbb E_{o\sim\pi_{\theta_{\mathrm{before}}}}[R(x,o)]`} />
          <div className="norm-table-wrap">
            <table className="norm-table"><thead><tr><th>概念</th><th>处于哪一层</th><th>和推理强化的关系</th></tr></thead><tbody>
              <tr><td><a className="term-link" href="/training/rlhf">RLHF</a></td><td>人类偏好对齐范式</td><td>提供 rollout、reward、KL 等上层框架；reward 常来自人类比较</td></tr>
              <tr><td><a className="term-link" href="/training/ppo">PPO</a></td><td>在线 Actor–Critic 优化器</td><td>可以优化 Verifier reward，但需要额外 Value Model</td></tr>
              <tr><td><a className="term-link" href="/training/dpo">DPO</a></td><td>离线直接偏好优化</td><td>适合固定的成功/失败 pairs，不能完整替代在线探索</td></tr>
              <tr className="highlight-row"><td><a className="term-link" href="/training/grpo">GRPO</a></td><td>无 Critic 的在线策略优化器</td><td>同题多 rollouts 构造 group advantage，常用于可验证推理</td></tr>
            </tbody></table>
          </div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>更常生成有效的分解与验证</h3><p>如果反思、重试、检查等 token patterns 经常出现在高 reward 轨迹中，它们的条件概率会增加。</p></div></article>
            <article><span>02</span><div><h3>更会利用 inference-time tokens</h3><p>训练让“多想一会儿”更可能转化为更高准确率，为 thinking budget 提供行为基础。</p></div></article>
            <article><span>03</span><div><h3>不保证过程忠实或知识凭空增加</h3><p>它可能重组、调用或稳定已有知识，也可能从训练 Queries 获得有限新模式，但不能把 reward improvement 自动解释成真实因果推理。</p></div></article>
          </div>
          <p>Qwen3 的公开流程使用 3,995 个 query–verifier pairs 和 <a className="term-link" href="/training/grpo">GRPO</a>，并报告旗舰模型 AIME’24 在 170 个 RL steps 中由 70.1 提升到 85.1。这个结果说明小而可验证的数据可产生明显策略优化，但它是完整 cold start、rollout 系统、reward 和超参数共同作用的结果。</p>
          <aside className="qwen-connection"><span>BOUNDARY · GENERAL RL</span><p>Reasoning RL 主要优化数学、代码等可验证正确性；General RL 还要处理 helpfulness、harmlessness、指令遵循和开放域偏好，往往需要 learned reward models 或人类/AI 偏好信号。</p><a href="/training/long-cot-cold-start">回看它的初始策略从哪里来 ↗</a></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>Reasoning RL 学的是答案，还是推理过程？</summary><div><p>若 reward 只检查 final answer，它直接优化的是“生成整条 response 后答对的概率”，没有显式标注某一步推理。高 reward 轨迹中的推理 token 会一起被强化，因此过程模式会间接改变，但不保证每一步都正确或忠实。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>只有最终答案 Reward，怎么知道哪一个推理 Token 是对的？</summary><div><p>标准 outcome-based <a className="term-link" href="/training/grpo">GRPO</a> 并不知道。同一条 rollout 的 sequence advantage 通常分配给全部生成 token，这是粗粒度 credit assignment。若需要定位步骤，应加入 process reward、step verifier 或能对中间状态评分的机制。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>为什么同一道题要生成多条 Rollouts？</summary><div><p>一方面用于探索多种路径，增加至少一个正确答案出现的概率；另一方面 <a className="term-link" href="/training/grpo">GRPO</a> 需要同题组内 rewards 构造 baseline，从而判断哪些回答相对更好，并部分消除题目难度差异。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>一组 Rollouts 全对或全错时还能学习吗？</summary><div><p>纯 group-normalized binary reward 下，组内标准差为 0，advantages 接近 0，几乎没有相对学习信号。可以通过调整题目难度、增加 rollout 数、使用更细粒度 rewards 或跨样本 baseline 缓解，但必须评估由此引入的偏差。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>Verifier 与 Reward Model 是一回事吗？</summary><div><p>不一定。Verifier 是任何判断输出是否满足目标的机制，可以是 exact match、符号等价、编译器或 unit tests；Reward Model 通常指学习得到的神经评分器。规则 Verifier 更客观但覆盖任务有限，Reward Model 更通用却更容易被利用偏差。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span><a className="term-link" href="/training/grpo">GRPO</a> 为什么可以不训练 Value Model？</summary><div><p>它用同一个 Query 的一组 rollout rewards 计算相对 baseline 和 advantage，不需要 critic 预测每个 token 前缀的未来 return。代价是必须生成多条候选，而且同组 reward 没有差异时信号会消失。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>模型把答案猜对但推理过程错误，会发生什么？</summary><div><p>如果 Verifier 只看 final answer，这条轨迹仍可能得到正 reward，错误过程也会随整条序列一起被强化。这正是 outcome reward 的边界，也是必须做轨迹审计、污染检查和更细 verifier 研究的原因。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>为什么训练中常观察到回答越来越长？</summary><div><p>更长轨迹提供检查、重试和探索替代方案的机会，所以成功路径可能自然变长；但 reward 或聚合方式也可能产生 length bias。只有在固定预算、去除重复并控制题目难度后准确率仍提高，才能把长度增长视为有效 inference-time scaling。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>Reasoning RL 与普通 <a className="term-link" href="/training/rlhf">RLHF</a>、General RL 有什么区别？</summary><div><p>Reasoning RL 常集中于数学、代码等可自动验证任务，reward 更接近客观正确性；通用 <a className="term-link" href="/training/rlhf">RLHF</a> 处理开放式帮助性、安全性和风格偏好，通常依赖人类偏好或 learned reward models。算法可能相似，核心差异在 prompt distribution 与 reward definition。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span>RL 是给模型写入新知识，还是激活已有能力？</summary><div><p>两种现象都可能发生，但主要可观测作用是重排策略概率：让模型更频繁调用、组合并延续已有的有效模式。训练 Queries 也会向参数注入有限信息，但不能仅凭 benchmark 上升判断模型获得了可泛化的新知识；需要数据去重和独立评测。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>训练流程、算法与案例</h2></div>
          <ol>
            <li><a href="https://arxiv.org/html/2505.09388#S4.SS2" target="_blank" rel="noreferrer">Qwen3 Technical Report · Reasoning RL</a><span>2025</span></li>
            <li><a href="https://arxiv.org/html/2501.12948#S2.SS1" target="_blank" rel="noreferrer">DeepSeek-R1 · Policy Optimization and Reward Design</a><span>2025</span></li>
            <li><a href="https://arxiv.org/abs/2402.03300" target="_blank" rel="noreferrer">DeepSeekMath · Group-Relative Optimization</a><span>2024</span></li>
            <li><a href="https://arxiv.org/abs/2203.02155" target="_blank" rel="noreferrer">Training Language Models to Follow Instructions with Human Feedback</a><span>Preference alignment</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>从冷启动到在线 Rollouts，再继续理解 Thinking Mode Fusion、General RL 与 inference-time thinking budget。</strong></div>
          <div className="footer-links"><a href="/training/rlhf">RLHF ↗</a><a href="/training/ppo">PPO ↗</a><a href="/training/dpo">DPO ↗</a><a href="/training/grpo">GRPO ↗</a></div>
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
