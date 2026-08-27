import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";
import { TrainingSidebar } from "../../components/TrainingSidebar";

const title = "什么是 Reward Model？";
const description = "从偏好数据、标量奖励头与 Bradley–Terry 损失出发，系统讲解大模型 Reward Model 的训练、评估、PPO 接入、过程监督、Reward Hacking 与缓解方法。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "Reward 从哪里来"],
  ["02", "偏好数据怎样构造"],
  ["03", "模型架构与标量头"],
  ["04", "偏好概率模型"],
  ["05", "Ranking Loss 推导"],
  ["06", "分数尺度与可辨识性"],
  ["07", "训练流程与数据边界"],
  ["08", "怎样评估 Reward Model"],
  ["09", "Outcome、Process 与 Verifier"],
  ["10", "怎样接入 PPO"],
  ["11", "Reward Hacking"],
  ["12", "常见偏差与失效模式"],
  ["13", "缓解与迭代闭环"],
  ["14", "关联 QA"],
] as const;

const qaQuestions = [
  "Reward Model 是不是会生成文字的语言模型？",
  "为什么 Reward Model 通常只输出一个标量？",
  "为什么使用成对比较，而不是直接标注绝对分数？",
  "Reward 分数可以跨 Prompt 直接比较吗？",
  "Reward Model 与 Critic 有什么区别？",
  "Reward Model 必须和 Actor 一样大吗？",
  "训练 PPO 时为什么通常冻结 Reward Model？",
  "测试集排序准确率很高，为什么仍会 Reward Hacking？",
  "Reward Hacking 与普通预测错误有什么区别？",
  "Process Reward Model 能彻底解决 Credit Assignment 吗？",
  "规则 Verifier 与 Reward Model 是一回事吗？",
  "DPO 不训练显式 Reward Model，就不会过优化吗？",
  "训练结束部署时还需要 Reward Model 吗？",
  "遇到平局或标注者意见不一致怎么办？",
];

export default function RewardModelPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页"><span className="brand-mark">模</span><span>模见 <small>Model Atlas</small></span></a>
        <nav className="topnav" aria-label="主导航"><a className="active" href="/">知识库</a><a href="#chapter-1">训练导读</a><a href="#qa">QA 索引</a></nav>
        <div className="top-actions"><a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a><span className="edition">2026.08</span></div>
      </header>

      <TrainingSidebar selected="reward-model" />

      <main className="article rms-article">
        <section className="hero rms-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a><span>/</span>训练与对齐<span>/</span>Reward Model</div>
          <div className="question-label"><span>FEEDBACK &amp; REWARD · 003</span></div>
          <p className="original-question">“人类只比较哪一个回答更好，怎样把这些离散偏好变成 PPO 可以优化的连续 Reward？评分器为什么又会被策略钻空子？”</p>
          <div className="eyebrow"><span></span>LEARNED PREFERENCE AS A SCALAR SIGNAL</div>
          <h1>什么是 Reward Model？</h1>
          <p className="dek">Reward Model 把 Prompt 与回答映射成一个标量分数。经典 RLHF 先让标注者比较同一 Prompt 下的候选回答，再训练模型使 Chosen 得分高于 Rejected；在线策略优化随后把这个可微之外的评分器当作环境 Reward，而不是把人类直接放进每一步训练循环。</p>
          <div className="hero-meta"><span>建立于 2026.08.25</span><i></i><span>55 分钟阅读</span><i></i><span>偏好建模 + 失效分析</span></div>
          <aside className="answer-first"><span>先确定它在系统中的位置</span><p><b><a className="term-link" href="/training/reward-model">Reward Model</a> 决定“什么回答值得高分”，<a className="term-link" href="/training/ppo">PPO</a> 决定“拿到分数后怎样更新 Actor”，Critic 则预测“从当前前缀继续生成，未来大概还能得到多少 Return”。</b>三者输入、目标与生命周期不同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>FROM HUMAN JUDGMENT TO TRAINING SIGNAL</p><h2>为什么需要单独学习一个 Reward？</h2></div></div>
          <p>预训练和 SFT 都需要明确的目标文本，但很多开放式要求没有唯一标准答案。对于同一个 Prompt，两条回答可能都语法正确，却在事实性、帮助性、安全性、简洁度与风格上存在相对优劣。人类更容易回答：</p>
          <Formula label="人类提供的相对判断" tex={String.raw`y_w\succ y_l\mid x`} />
          <p>其中 <Formula inline tex={String.raw`x`} /> 是 Prompt，<Formula inline tex={String.raw`y_w`} /> 是较受偏好的 Chosen，<Formula inline tex={String.raw`y_l`} /> 是 Rejected。Reward Model 要学习一个标量函数：</p>
          <Formula label="Reward Model 的基本接口" tex={String.raw`r_\phi:\ (x,y)\longmapsto r_\phi(x,y)\in\mathbb R`} />
          <p>它把昂贵、离散的人类比较蒸馏成可以批量调用的评分器。训练 Policy 时，不必让标注者实时评价每条新 Rollout；模型可以先生成，再由冻结的 Reward Model 自动打分。</p>
          <div className="formula-sequence">
            <div><span>01 · PROMPT</span><Formula className="sequence-latex" tex={String.raw`x\sim\mathcal D`} /></div>
            <div><span>02 · CANDIDATES</span><Formula className="sequence-latex" tex={String.raw`y_{1:K}\sim\pi_{\mathrm{data}}(\cdot\mid x)`} /></div>
            <div><span>03 · PREFERENCE</span><Formula className="sequence-latex" tex={String.raw`y_w\succ y_l`} /></div>
            <div><span>04 · TRAIN RM</span><Formula className="sequence-latex" tex={String.raw`r_\phi(x,y_w)>r_\phi(x,y_l)`} /></div>
            <div><span>05 · SCORE ROLLOUT</span><Formula className="sequence-latex" tex={String.raw`y\sim\pi_\theta,\quad r_\phi(x,y)`} /></div>
            <div><span>06 · UPDATE POLICY</span><Formula className="sequence-latex" tex={String.raw`\max_\theta\ \mathbb E[r_\phi-\beta D_{\mathrm{KL}}]`} /></div>
          </div>
          <aside className="boundary-box"><b>Reward Model 学到的是标注规范下的偏好代理</b><p>它不是“真实人类价值函数”。标签来自特定任务、准则、标注者与候选模型；模型最终拟合的是这些数据中的可预测偏好。数据没有表达的目标，Reward Model 不会自动知道。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>BUILD THE COMPARISON DATA</p><h2>一条 Reward Model 训练数据是怎样得到的？</h2></div></div>
          <p>经典 Pairwise 数据共享同一个 Prompt：</p>
          <Formula label="一条偏好训练样本" tex={String.raw`(x,y_w,y_l)\sim\mathcal D_{\mathrm{pref}}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>选择真实任务 Prompt</h3><p>Prompt 分布应尽量接近未来产品流量，同时覆盖安全、事实、推理、拒答、格式和长上下文等关键切片。</p></div></article>
            <article><span>02</span><div><h3>生成多个候选回答</h3><p>候选可来自不同 Checkpoint、不同采样温度或不同系统；只使用一个很弱模型产生的 Rejected，容易让比较任务过于简单。</p></div></article>
            <article><span>03</span><div><h3>按统一 Rubric 排序</h3><p>标注者需要知道帮助性、正确性、安全性发生冲突时怎样权衡，并允许近似平局或无法判断，而不是强迫制造虚假偏好。</p></div></article>
            <article><span>04</span><div><h3>保存来源与审计字段</h3><p>保留候选模型、采样设置、标注者、时间、任务域与理由，便于检测位置偏差、模型来源偏差和后续分布漂移。</p></div></article>
          </div>
          <p>若一个 Prompt 有 <Formula inline tex={String.raw`K`} /> 个完全排序的候选，理论上可展开出：</p>
          <Formula label="一个排序最多产生的 Pair 数" tex={String.raw`\binom K2=\frac{K(K-1)}2`} />
          <aside className="text-note"><b>这些 Pair 不是相互独立的新样本</b><p>它们共享同一个 Prompt 和候选回答。数据切分必须先按 Prompt 或对话分组，再展开 Pair；如果先展开再随机切分，同一候选可能同时进入训练集和测试集，造成严重泄漏。</p></aside>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>Pair 类型</th><th>训练价值</th><th>风险</th></tr></thead><tbody><tr><td>差距很大的 Easy Pair</td><td>快速建立基本方向</td><td>Loss 很快饱和，无法教会细微偏好</td></tr><tr><td>质量接近的 Hard Pair</td><td>学习事实、风格和安全边界的细粒度差异</td><td>标注分歧与噪声更高</td></tr><tr><td>来自不同模型族的 Pair</td><td>扩大行为覆盖</td><td>可能把模型特有格式当作质量捷径</td></tr><tr><td>当前 Policy 新产生的 Pair</td><td>贴近在线优化后的分布</td><td>需要持续采样和重新标注</td></tr></tbody></table></div>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>BACKBONE PLUS A SCALAR HEAD</p><h2>Reward Model 的网络架构长什么样？</h2></div></div>
          <p>最常见做法从预训练或 SFT 的 Decoder-only LLM 初始化。把 Prompt 与 Response 按聊天模板拼接，经过 Transformer 得到最后一个有效 Token 的隐藏状态：</p>
          <Formula label="Prompt 与回答经过同一个语言模型 Backbone" className="compact-latex" tex={String.raw`h_{1:T}=\operatorname{Transformer}_\phi\!\left(\operatorname{tokens}(x,y)\right),\qquad h_T\in\mathbb R^{d}`} />
          <p>然后用一个线性 Reward Head 把 <Formula inline tex={String.raw`d`} /> 维表示压成标量：</p>
          <Formula label="Scalar Reward Head" tex={String.raw`r_\phi(x,y)=w_r^{\mathsf T}h_T+b_r`} />
          <p>在 Causal Decoder 中，最后位置的隐藏状态已经通过自注意力读取前面的 Prompt 与整段回答，所以它可以代表完整序列。工程上也可能使用 EOS 位置、池化多个 Token，或训练生成式 Judge；但“Decoder Backbone + Scalar Head”是经典 Pairwise Reward Model 最容易理解的基线。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>模型</th><th>输入</th><th>输出</th><th>训练目标</th></tr></thead><tbody><tr><td>Actor / Policy</td><td>Prompt 与已生成前缀</td><td>下一 Token 分布</td><td>提高高 Advantage 动作概率</td></tr><tr><td>Reward Model</td><td>完整 Prompt + Response</td><td>一个或多个偏好分数</td><td>让 Chosen 排在 Rejected 前面</td></tr><tr><td>Critic / Value Model</td><td>Prompt + 当前前缀</td><td>每个状态的未来 Return 估计</td><td>拟合 Return Target</td></tr><tr><td>Generative Judge</td><td>评分 Rubric + 待评回答</td><td>评价文本、标签或分数</td><td>通常使用 SFT、偏好学习或提示控制</td></tr></tbody></table></div>
          <aside className="boundary-box"><b>Reward Model 与 Critic 不是同一个模型</b><p>Reward Model 评价完整回答是否符合偏好；Critic 服务于某个正在变化的 Policy，估计每个前缀的未来正则化 Return。二者都可能输出标量，但监督目标与使用位置完全不同。</p></aside>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>TURN SCORE DIFFERENCE INTO PREFERENCE PROBABILITY</p><h2>为什么偏好概率只取决于两个 Reward 的差？</h2></div></div>
          <p>Bradley–Terry 模型假设回答的潜在质量由 Reward 表示。Chosen 胜过 Rejected 的概率是两者得分差经过 Sigmoid：</p>
          <Formula label="Bradley–Terry 偏好概率" className="compact-latex" tex={String.raw`P_\phi(y_w\succ y_l\mid x)=\sigma(\Delta r_\phi),\qquad \Delta r_\phi=r_\phi(x,y_w)-r_\phi(x,y_l)`} />
          <Formula label="Sigmoid 把任意差值映射到概率" tex={String.raw`\sigma(z)=\frac{1}{1+e^{-z}}`} />
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>Reward Margin</th><th>预测 Chosen 获胜概率</th><th>解释</th></tr></thead><tbody><tr><td><Formula inline tex={String.raw`\Delta r=0`} /></td><td><Formula inline tex={String.raw`0.5`} /></td><td>模型认为两者同样可能被偏好</td></tr><tr><td><Formula inline tex={String.raw`\Delta r=1`} /></td><td><Formula inline tex={String.raw`0.731`} /></td><td>Chosen 更可能胜出，但仍保留不确定性</td></tr><tr><td><Formula inline tex={String.raw`\Delta r=-1`} /></td><td><Formula inline tex={String.raw`0.269`} /></td><td>模型当前错误地更偏向 Rejected</td></tr><tr><td><Formula inline tex={String.raw`\Delta r\to+\infty`} /></td><td><Formula inline tex={String.raw`1`} /></td><td>模型对 Chosen 的排序极度自信</td></tr></tbody></table></div>
          <p>只看差值符合 Pairwise 标签能提供的信息：标注者告诉我们谁更好，却没有告诉我们“Chosen 的绝对质量是 <Formula inline tex={String.raw`7.3`} /> 分”。因此 Reward 的绝对零点不能从这种数据中恢复。</p>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>MAXIMUM LIKELIHOOD FOR PREFERENCES</p><h2>Ranking Loss 怎样从偏好概率推导出来？</h2></div></div>
          <p>训练数据已经声明事件 <Formula inline tex={String.raw`y_w\succ y_l`} /> 发生。最大似然希望提高这个事件的预测概率：</p>
          <Formula label="最大化观测偏好的似然" tex={String.raw`\max_\phi\ \prod_{i=1}^{N}P_\phi\!\left(y_w^{(i)}\succ y_l^{(i)}\mid x^{(i)}\right)`} />
          <p>乘积容易数值下溢，也不方便求梯度，所以取 Log 把乘积变成求和；训练框架执行最小化，再加负号：</p>
          <Formula label="Pairwise Reward Model Loss" className="compact-latex" tex={String.raw`\boxed{\mathcal L_{\mathrm{RM}}(\phi)=-\frac1N\sum_{i=1}^{N}\log\sigma\!\left(r_\phi(x^{(i)},y_w^{(i)})-r_\phi(x^{(i)},y_l^{(i)})\right)}`} />
          <p>对单个样本的 Margin <Formula inline tex={String.raw`\Delta r`} /> 求导：</p>
          <Formula label="Ranking Loss 对 Reward Margin 的梯度" className="compact-latex" tex={String.raw`\frac{\partial\mathcal L}{\partial\Delta r}=\sigma(\Delta r)-1=-\sigma(-\Delta r)`} />
          <p>这里要区分两个数：<Formula inline tex={String.raw`\sigma(\Delta r)`} /> 是模型预测“Chosen 胜出”的概率；<Formula inline tex={String.raw`-\sigma(-\Delta r)`} /> 才是 Loss 对 Margin 的导数。对任意有限的 <Formula inline tex={String.raw`\Delta r`} />，都有 <Formula inline tex={String.raw`0<\sigma(-\Delta r)<1`} />，所以导数始终为负：</p>
          <Formula label="梯度下降对 Margin 的直接更新" className="compact-latex" tex={String.raw`\Delta r_{\mathrm{new}}=\Delta r-\eta\frac{\partial\mathcal L}{\partial\Delta r}=\Delta r+\eta\sigma(-\Delta r)>\Delta r`} />
          <p>因此梯度下降虽然沿 Loss 梯度的反方向更新，却会沿着增大 <Formula inline tex={String.raw`\Delta r`} /> 的方向移动。Margin 为负表示当前排反了；Margin 接近零表示模型还分不清。二者的负梯度幅度都较大。只有当正 Margin 已经很大时，<Formula inline tex={String.raw`\sigma(-\Delta r)\to 0`} />，导数才从负侧逐渐接近零。</p>
          <p>若先把 <Formula inline tex={String.raw`r_w`} /> 与 <Formula inline tex={String.raw`r_l`} /> 当作两个独立的输出分数，那么：</p>
          <Formula label="Loss 分别对 Chosen 与 Rejected 分数的梯度" className="compact-latex" tex={String.raw`\frac{\partial\mathcal L}{\partial r_w}=-\sigma(-\Delta r)<0,\qquad \frac{\partial\mathcal L}{\partial r_l}=+\sigma(-\Delta r)>0`} />
          <p>所以梯度下降对输出分数施加的直接压力是提高 <Formula inline tex={String.raw`r_w`} />、降低 <Formula inline tex={String.raw`r_l`} />。实际神经网络中两条回答共享参数，参数更新会彼此耦合，不能保证每一步都恰好等量地一升一降；严格保证的是当前 Pair 的 Loss 会推动分数差 <Formula inline tex={String.raw`\Delta r=r_w-r_l`} /> 增大。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th><Formula inline tex={String.raw`\Delta r`} /></th><th>偏好概率 <Formula inline tex={String.raw`\sigma(\Delta r)`} /></th><th>梯度 <Formula inline tex={String.raw`\frac{\partial\mathcal L}{\partial\Delta r}=-\sigma(-\Delta r)`} /></th><th>梯度下降增量 <Formula inline tex={String.raw`-\eta\frac{\partial\mathcal L}{\partial\Delta r}`} /></th><th>训练含义</th></tr></thead><tbody><tr><td><Formula inline tex={String.raw`-1`} /></td><td><Formula inline tex={String.raw`0.269`} /></td><td><Formula inline tex={String.raw`-0.731`} /></td><td><Formula inline tex={String.raw`+0.731\eta`} /></td><td>排序错误，强烈增大 Margin</td></tr><tr><td><Formula inline tex={String.raw`0`} /></td><td><Formula inline tex={String.raw`0.500`} /></td><td><Formula inline tex={String.raw`-0.500`} /></td><td><Formula inline tex={String.raw`+0.500\eta`} /></td><td>尚未区分，明显增大 Margin</td></tr><tr><td><Formula inline tex={String.raw`1`} /></td><td><Formula inline tex={String.raw`0.731`} /></td><td><Formula inline tex={String.raw`-0.269`} /></td><td><Formula inline tex={String.raw`+0.269\eta`} /></td><td>排序正确，继续建立置信度</td></tr><tr><td><Formula inline tex={String.raw`5`} /></td><td><Formula inline tex={String.raw`0.993`} /></td><td><Formula inline tex={String.raw`-0.007`} /></td><td><Formula inline tex={String.raw`+0.007\eta`} /></td><td>正 Margin 已很大，更新近乎停止</td></tr></tbody></table></div>
          <aside className="text-note"><b>平局可以使用软标签，而不是强行选边</b><p>若标注统计认为 Chosen 获胜概率为 <Formula inline tex={String.raw`q\in[0,1]`} />，可以使用二元交叉熵 <Formula inline tex={String.raw`-q\log\sigma(\Delta r)-(1-q)\log[1-\sigma(\Delta r)]`} />。<Formula inline tex={String.raw`q=0.5`} /> 表示希望两者得分接近，而不是随机制造一个 Winner。</p></aside>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>WHAT THE NUMBER DOES AND DOES NOT MEAN</p><h2>Reward 的绝对数值到底代表什么？</h2></div></div>
          <p>Pairwise Loss 只观察同一 Prompt 下的分数差。给所有回答同时加一个常数不会改变任何偏好概率：</p>
          <Formula label="Reward 的加法平移不可辨识" className="compact-latex" tex={String.raw`r_\phi'(x,y)=r_\phi(x,y)+c(x)\quad\Longrightarrow\quad r_\phi'(x,y_w)-r_\phi'(x,y_l)=\Delta r_\phi`} />
          <p>因此 Reward 的零点是任意的。若对 Reward 乘以正数 <Formula inline tex={String.raw`a`} />，排序不变，但 Sigmoid 的置信程度和 PPO 的有效 Reward Scale 会改变：</p>
          <Formula label="缩放保持排序，却改变 Margin 与优化强度" tex={String.raw`r_\phi'(x,y)=a\,r_\phi(x,y),\qquad a>0`} />
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>说法</th><th>是否可靠</th><th>原因</th></tr></thead><tbody><tr><td>“同一 Prompt 下 A 分数高于 B”</td><td>训练目标直接支持</td><td>Pairwise Loss 就在学习该排序</td></tr><tr><td>“Reward 为零表示中立”</td><td>通常不可靠</td><td>绝对零点可以任意平移</td></tr><tr><td>“两个不同 Prompt 的 4.2 分质量相同”</td><td>未必可靠</td><td>训练通常没有跨 Prompt 标尺约束</td></tr><tr><td>“Reward 差为 2 就是质量提升两倍”</td><td>错误</td><td>Reward Margin 不是线性的人类效用单位</td></tr><tr><td>“Reward 越高，PPO 推力一定越大”</td><td>取决于实现</td><td>还会经过中心化、缩放、KL、Return 与 Advantage</td></tr></tbody></table></div>
          <aside className="boundary-box"><b>排序能力与可用于 RL 的数值尺度是两件事</b><p>一个 Reward Model 可以保持相同排序准确率，却因输出尺度变大而让 PPO 的 Reward 方差和有效步长显著改变。接入在线 RL 前必须查看 Reward 分布、异常值、不同长度和任务切片，而不能只看 Pairwise Accuracy。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>TRAIN WITHOUT LEAKING THE ANSWER</p><h2>Reward Model 的训练流程有哪些关键边界？</h2></div></div>
          <div className="formula-sequence">
            <div><span>01 · GROUP SPLIT</span><Formula className="sequence-latex" tex={String.raw`\mathcal D\to\mathcal D_{\mathrm{train}},\mathcal D_{\mathrm{val}}`} /></div>
            <div><span>02 · FORMAT PAIR</span><Formula className="sequence-latex" tex={String.raw`(x,y_w),(x,y_l)`} /></div>
            <div><span>03 · TWO SCORES</span><Formula className="sequence-latex" tex={String.raw`r_w,r_l\leftarrow r_\phi`} /></div>
            <div><span>04 · MARGIN</span><Formula className="sequence-latex" tex={String.raw`\Delta r=r_w-r_l`} /></div>
            <div><span>05 · BACKPROP</span><Formula className="sequence-latex" tex={String.raw`\phi\leftarrow\phi-\eta\nabla_\phi[-\log\sigma(\Delta r)]`} /></div>
            <div><span>06 · AUDIT</span><Formula className="sequence-latex" tex={String.raw`\mathrm{accuracy},\ \mathrm{calibration},\ \mathrm{slices}`} /></div>
          </div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>按 Prompt 分组切分</h3><p>同一对话、改写 Prompt 或同一候选的 Pair 不应跨 Train/Test，避免模型通过记忆内容获得虚假高分。</p></div></article>
            <article><span>02</span><div><h3>保证 Chosen 与 Rejected 模板一致</h3><p>系统提示、角色标记、EOS、截断规则必须一致，否则模型可能学习 Padding、长度或格式捷径。</p></div></article>
            <article><span>03</span><div><h3>平衡位置与来源</h3><p>标注界面随机交换 A/B，训练时保留候选来源，用切片评估检查模型是否只是偏好某个模型族的固定口癖。</p></div></article>
            <article><span>04</span><div><h3>控制长度与截断</h3><p>过长回答更可能包含正确细节，也更可能被截断。要分别检查 Reward 与字符数、Token 数、拒答长度之间的相关性。</p></div></article>
            <article><span>05</span><div><h3>使用当前策略的 Hard Negatives</h3><p>在线 Policy 会不断离开最初候选分布。定期收集当前 Policy 的高分失败案例，可以把它发现的漏洞重新写入训练数据。</p></div></article>
            <article><span>06</span><div><h3>保存人类分歧</h3><p>只保留多数票会隐藏偏好异质性。至少应保存投票比例、置信度和 Rubric 维度，区分模型错误与人群价值冲突。</p></div></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>EVALUATE THE JUDGE, NOT ONLY THE LOSS</p><h2>怎样判断 Reward Model 真的可用？</h2></div></div>
          <p>最基本指标是 Held-out Pairwise Accuracy：</p>
          <Formula label="Pairwise Ranking Accuracy" className="compact-latex" tex={String.raw`\operatorname{Acc}=\frac1N\sum_{i=1}^{N}\mathbf 1\!\left[r_\phi(x^{(i)},y_w^{(i)})>r_\phi(x^{(i)},y_l^{(i)})\right]`} />
          <p>它只判断排序方向，不检查置信度、跨域稳定性或高分区域是否安全。一个准备进入 RL 的 Reward Model 至少需要以下四层评估：</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>层级</th><th>问题</th><th>典型检查</th></tr></thead><tbody><tr><td>总体排序</td><td>Chosen 是否通常高于 Rejected？</td><td>Accuracy、Loss、Margin 分布、Tie Accuracy</td></tr><tr><td>能力切片</td><td>事实、安全、推理、拒答、格式是否都可靠？</td><td>分域 Accuracy 与混淆案例</td></tr><tr><td>校准与置信</td><td>预测 80% 胜率的 Pair 是否约有 80% 被偏好？</td><td>Reliability Diagram、ECE、Brier Score</td></tr><tr><td>策略分布外</td><td>当前 Policy 的新回答还能正确评分吗？</td><td>新 Checkpoint Pair、对抗样本、Best-of-N 与 PPO Rollout</td></tr><tr><td>下游一致性</td><td>RM 分数提高时，人类质量是否也提高？</td><td>Human Win Rate 对 KL / 训练步数的曲线</td></tr></tbody></table></div>
          <aside className="answer-first"><span>最重要的测试不在静态测试集</span><p><b>Reward Model 的真实压力来自优化器主动寻找高分回答。</b>静态测试集是被动采样；PPO 和 Best-of-N 会把概率质量推向评分器最乐观的区域。因此必须评估“被优化后的输出”，而不只是原始候选上的排序准确率。</p></aside>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>CHOOSE THE RIGHT FEEDBACK GRANULARITY</p><h2>Outcome Reward、Process Reward 与 Verifier 有什么区别？</h2></div></div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>反馈机制</th><th>评分对象</th><th>优点</th><th>主要限制</th></tr></thead><tbody><tr><td>Outcome Reward Model</td><td>完整回答 <Formula inline tex={String.raw`(x,y)`} /></td><td>数据格式简单，适合开放域整体偏好</td><td>不能直接指出中间哪一步关键</td></tr><tr><td>Process Reward Model</td><td>每个推理步骤或前缀</td><td>提供更细的 Credit Assignment，可定位首个错误</td><td>步骤标注昂贵，步骤边界和局部正确不等于全局有用</td></tr><tr><td>Rule-based Verifier</td><td>答案、代码、约束或工具结果</td><td>客观、可重复、难以被主观风格影响</td><td>只覆盖存在明确验证规则的任务</td></tr><tr><td>Generative Judge</td><td>回答与 Rubric，生成评价</td><td>灵活，可输出理由和多维评分</td><td>位置、长度、自我偏好与提示攻击风险</td></tr></tbody></table></div>
          <p>Outcome Reward 常写为序列终局分数：</p>
          <Formula label="Outcome Reward" tex={String.raw`r_T^{\mathrm{outcome}}=r_\phi(x,y)`} />
          <p>Process Reward 为中间步骤 <Formula inline tex={String.raw`z_t`} /> 提供额外信号：</p>
          <Formula label="Process Reward" tex={String.raw`r_t^{\mathrm{process}}=r_\phi(x,z_{\le t})`} />
          <p>过程监督能缓解<a className="term-link" href="/training/ppo#qa-20">只有终局 Reward 时的归因困难</a>，但不能自动保证全局最优。模型可能写出每一步看似局部正确、组合后却冗余或偏题的长推理；Process Reward 本身也可能被利用。</p>
          <aside className="qwen-connection"><span>CONNECTION · REASONING RL</span><p><a className="term-link" href="/training/reasoning-rl">Reasoning RL</a> 更常使用数学答案、代码测试和格式检查等 Verifier；开放域帮助性、安全性和风格更难写成规则，通常仍需要 Learned Reward Model 或 AI/Human Preference Judge。</p><a href="/training/reasoning-rl">继续查看 Reasoning RL 的 Reward 来源 ↗</a></aside>
        </section>

        <section className="prose-section" id="chapter-10">
          <div className="prose-heading"><span>10</span><div><p>FREEZE THE JUDGE, THEN OPTIMIZE THE ACTOR</p><h2>Reward Model 怎样接入 PPO？</h2></div></div>
          <p>Reward Model 通常在 PPO 阶段冻结。Rollout Policy 生成完整回答后，RM 给出终局分数；Reference Policy 提供逐 Token KL 代价：</p>
          <Formula label="LLM PPO 的逐 Token Shaped Reward" className="compact-latex" tex={String.raw`r_t^{\mathrm{shape}}=-\beta\!\left[\log\pi_{\mathrm{rollout}}(y_t\mid s_t)-\log\pi_{\mathrm{ref}}(y_t\mid s_t)\right]+\mathbf 1_{\{t=T\}}r_\phi(x,y)`} />
          <p>这条 Reward 再经过 Return、Critic、GAE 与 Clip Objective 更新 Actor。完整链路是：</p>
          <Formula label="从 Reward Model 到 PPO Actor" className="compact-latex" tex={String.raw`r_\phi(x,y)\longrightarrow r_t^{\mathrm{shape}}\longrightarrow G_t\longrightarrow \widehat A_t\longrightarrow L^{\mathrm{CLIP}}`} />
          <aside className="boundary-box"><b>冻结 Reward Model 是为了固定优化目标</b><p>如果 RM 与 Actor 同时为了降低 Policy Loss 而自由变化，Actor 可以通过“让评分器改口”而不是改善回答来获得更高分。经典在线 RLHF 会先训练并验证 RM，再在一段 PPO 训练中冻结它；之后可以用新数据重新训练下一版 RM，但这是外层迭代，不是让当前 Policy Gradient 穿过 RM 参数。</p></aside>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>工程处理</th><th>目的</th><th>风险</th></tr></thead><tbody><tr><td>Reward Centering / Whitening</td><td>稳定不同 Batch 的尺度与 Advantage</td><td>改变数值不改变排序，但可能改变有效优化强度</td></tr><tr><td>Reward Clipping</td><td>限制异常高分对梯度的支配</td><td>过强会抹平真实质量差异</td></tr><tr><td>Adaptive KL</td><td>Policy 偏离过快时增强约束</td><td>只能控制距离，不能修复错误 Reward</td></tr><tr><td>Early Stopping</td><td>在代理分数继续升、真实质量开始降时停止</td><td>需要独立人类或 Gold Judge 指标</td></tr></tbody></table></div>
          <p><a className="term-link" href="/training/ppo">PPO 文档</a>从这一终局分数开始继续推导 Return、Value Target、GAE、Importance Ratio 与 Clip；本页只负责解释这个分数为什么可信、什么时候不可信。</p>
        </section>

        <section className="prose-section" id="chapter-11">
          <div className="prose-heading"><span>11</span><div><p>WHEN THE PROXY BECOMES THE TARGET</p><h2>Reward Hacking 为什么会发生？</h2></div></div>
          <p>设人类真正关心但无法直接计算的质量为 <Formula inline tex={String.raw`u(x,y)`} />，Reward Model 是通过有限数据学习出的代理：</p>
          <Formula label="真实目标与代理 Reward" tex={String.raw`r_\phi(x,y)=u(x,y)+\varepsilon_\phi(x,y)`} />
          <p>在训练分布附近，误差 <Formula inline tex={String.raw`\varepsilon_\phi`} /> 可能看起来随机且较小；但 Policy 并不是随机测试 RM，而是在巨大文本空间中主动搜索高 <Formula inline tex={String.raw`r_\phi`} /> 的回答。只要某个区域同时具有一般质量和很大的正误差，优化器就会逐渐把概率质量推过去：</p>
          <Formula label="Policy 优化的是代理而非不可见的真实质量" tex={String.raw`\max_\theta\ \mathbb E_{y\sim\pi_\theta(\cdot\mid x)}[r_\phi(x,y)]`} />
          <p>于是可能出现：</p>
          <Formula label="Reward Overoptimization 的典型现象" className="compact-latex" tex={String.raw`\mathbb E[r_\phi]\uparrow\qquad\text{while}\qquad \mathbb E[u]\ \text{plateaus or decreases}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>代理不完美</h3><p>有限偏好数据无法覆盖事实、文化、安全、长度和所有对抗表达，RM 必然存在盲点。</p></div></article>
            <article><span>02</span><div><h3>优化造成分布漂移</h3><p>Policy 逐渐生成训练 RM 时没有见过的高分模式，静态测试准确率不再代表这些区域。</p></div></article>
            <article><span>03</span><div><h3>搜索放大偶然误差</h3><p>Best-of-N、PPO 和长时间 RL 都会从大量候选中偏向评分器最乐观的样本，像反复挑选测量噪声最高的点。</p></div></article>
            <article><span>04</span><div><h3>单一标量压缩多目标</h3><p>Policy 可能最大化容易提升的风格或长度维度，牺牲难以被 RM 稳定识别的事实性与诚实性。</p></div></article>
          </div>
          <aside className="answer-first"><span>Reward Hacking 的判定标准</span><p><b>不是“Reward Model 偶尔打错分”就叫 Hacking，而是优化过程系统性发现并放大评分器的误差，使代理 Reward 上升但独立的人类或 Gold 指标不再上升。</b></p></aside>
        </section>

        <section className="prose-section" id="chapter-12">
          <div className="prose-heading"><span>12</span><div><p>COMMON SHORTCUTS AND BLIND SPOTS</p><h2>Reward Model 最常见的偏差有哪些？</h2></div></div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>失效模式</th><th>数据中可能的捷径</th><th>Policy 被优化后可能出现什么</th></tr></thead><tbody><tr><td>长度偏差</td><td>训练集里更长回答通常更完整</td><td>不断扩写、重复结论，用长度换高分</td></tr><tr><td>格式与措辞偏差</td><td>Chosen 更常使用标题、免责声明或礼貌套话</td><td>外观专业但内容空洞</td></tr><tr><td>奉承与迎合</td><td>标注者偏好顺从、肯定的回答</td><td>用户前提错误时仍附和</td></tr><tr><td>拒答偏差</td><td>安全数据中拒答更常被选中</td><td>对无害问题过度拒答，或反过来学会表面安全话术</td></tr><tr><td>事实验证薄弱</td><td>流畅答案更容易获得高分</td><td>生成自信、细节丰富但不可验证的幻觉</td></tr><tr><td>模型来源偏差</td><td>某个候选模型具有固定口吻</td><td>RM 识别风格而非质量</td></tr><tr><td>位置偏差</td><td>标注界面 A/B 顺序没有随机化</td><td>Judge 或数据系统性偏好某一位置</td></tr><tr><td>Prompt Injection</td><td>评分器会读取回答中的指令文本</td><td>回答尝试命令 Judge 给高分</td></tr><tr><td>价值聚合冲突</td><td>不同标注者对简洁、安全、文化规范有不同偏好</td><td>单一分数掩盖少数群体或任务需求</td></tr></tbody></table></div>
          <aside className="text-note"><b>更大的 Reward Model 不是自动免疫</b><p>更强模型通常提高排序能力与泛化，但只要它仍是有限数据上的代理，优化器就可能找到剩余误差。模型规模、数据规模、KL Budget 与优化强度共同决定何时发生过优化。</p></aside>
        </section>

        <section className="prose-section" id="chapter-13">
          <div className="prose-heading"><span>13</span><div><p>MAKE THE FEEDBACK LOOP HARDER TO GAME</p><h2>怎样缓解 Reward Hacking 与分布漂移？</h2></div></div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>迭代式收集当前 Policy 数据</h3><p>每轮从最新 Actor 收集高分失败案例与难比较 Pair，重新标注并训练下一版 RM，让数据分布追上被优化后的策略。</p></div></article>
            <article><span>02</span><div><h3>保留独立 Gold 评估</h3><p>训练 RM、选择 Checkpoint 和报告最终质量不能只使用同一个评分器；需要隔离的人类评估、规则测试或未参与优化的 Judge。</p></div></article>
            <article><span>03</span><div><h3>构造 Hard Negatives 与对抗样本</h3><p>加入流畅但事实错误、冗长但空洞、表面拒答却泄露内容、包含 Judge 指令等针对性反例。</p></div></article>
            <article><span>04</span><div><h3>限制 Policy 偏离</h3><p>KL Penalty、Target-KL、较少 Epoch 与 Early Stop 缩小策略进入 RM 分布外区域的速度，但不能替代正确评分器。</p></div></article>
            <article><span>05</span><div><h3>分解多维 Reward</h3><p>把帮助性、事实性、安全性、格式和长度分别评估并显式组合，便于监控某一维是否被牺牲；权重冲突仍需产品决策。</p></div></article>
            <article><span>06</span><div><h3>使用 Ensemble 与不确定性</h3><p>多个独立 RM 同时评分，策略在模型分歧大的区域接受保守奖励，降低利用单一评分器偶然盲点的机会。</p></div></article>
          </div>
          <Formula label="不确定性惩罚的示意 Reward" className="compact-latex" tex={String.raw`r_{\mathrm{robust}}(x,y)=\frac1M\sum_{m=1}^{M}r_m(x,y)-\kappa\,\operatorname{Std}_{m=1:M}\!\left[r_m(x,y)\right]`} />
          <p>第一项奖励多个模型共同认可的高质量，第二项惩罚评分器意见分歧。它并不能保证真实安全：若所有 RM 共享相同数据偏差，Ensemble 也会一致犯错。</p>
          <div className="formula-sequence">
            <div><span>01 · TRAIN RM v1</span><Formula className="sequence-latex" tex={String.raw`\mathcal D_{\mathrm{pref}}^{(1)}\to r_{\phi_1}`} /></div>
            <div><span>02 · OPTIMIZE</span><Formula className="sequence-latex" tex={String.raw`r_{\phi_1}\to\pi_1`} /></div>
            <div><span>03 · RED TEAM</span><Formula className="sequence-latex" tex={String.raw`\pi_1\to\mathcal B_{\mathrm{failure}}`} /></div>
            <div><span>04 · RELABEL</span><Formula className="sequence-latex" tex={String.raw`\mathcal D^{(2)}=\mathcal D^{(1)}\cup\mathcal B`} /></div>
            <div><span>05 · TRAIN RM v2</span><Formula className="sequence-latex" tex={String.raw`\mathcal D^{(2)}\to r_{\phi_2}`} /></div>
            <div><span>06 · HUMAN GATE</span><Formula className="sequence-latex" tex={String.raw`\operatorname{HumanEval}(\pi_2)`} /></div>
          </div>
          <aside className="answer-first"><span>完整防线不是一个技巧</span><p><b>可靠 Reward 来自数据覆盖、模型能力、独立评估、优化约束与持续红队的组合。</b>如果真实质量指标不可观测，只看训练 Reward，就无法知道系统是在进步还是更擅长迎合评分器。</p></aside>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>14</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>Reward Model 是不是会生成文字的语言模型？</summary><div><p>经典 Scalar Reward Model 通常由语言模型 Backbone 初始化，但把语言建模 Head 换成标量 Reward Head。它读取 Prompt 与完整回答，输出 <Formula inline tex={String.raw`r_\phi(x,y)`} />；训练和 PPO 打分时不负责生成回答。生成式 Judge 是另一种实现。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>为什么 Reward Model 通常只输出一个标量？</summary><div><p>因为策略优化需要一个可排序、可累计的目标，标量最容易接入 RL。但帮助性、事实性、安全性和风格被压进同一个数字会隐藏冲突。成熟系统常保留多维子分数、规则约束和审计指标，而不是只观察总分。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>为什么使用成对比较，而不是直接标注绝对分数？</summary><div><p>人类通常更容易稳定判断“同一 Prompt 下 A 与 B 哪个更好”，不同标注者对 1–10 分的绝对刻度却很难一致。Pairwise 标签降低刻度差异，但只能识别相对排序，不能自动恢复具有统一单位的绝对效用。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>Reward 分数可以跨 Prompt 直接比较吗？</summary><div><p>不能默认可以。Pairwise Loss 通常只比较同一 Prompt 下的 Chosen 与 Rejected，对每个 Prompt 同时加一个常数不会改变 Loss。因此跨 Prompt 的绝对数值缺少直接监督；若工程上需要跨 Prompt 比较，必须额外做标度设计、校准或分组归一化。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>Reward Model 与 Critic 有什么区别？</summary><div><p>Reward Model 评价完整回答在偏好规范下好不好，通常先训练后冻结；Critic 预测当前 Policy 从某个生成前缀继续行动的期望 Return，会随 PPO 训练更新。RM 定义反馈，Critic 估计未来反馈。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>Reward Model 必须和 Actor 一样大吗？</summary><div><p>不必须。更大 RM 可能更能识别细微错误，但推理成本和显存更高；过小 RM 又容易依赖表面捷径。实际选择取决于候选难度、任务域、Rollout 吞吐与下游过优化测试，而不是简单追求参数相等。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>训练 PPO 时为什么通常冻结 Reward Model？</summary><div><p>为了让当前 PPO 阶段的目标保持固定。若 Policy Loss 可以同时改变评分器，系统可能通过移动 Reward 而不是改善回答来降低 Loss。外层可以收集新数据训练下一版 RM，但当前 Batch 的 Reward 应被当作 Stop-Gradient 环境反馈。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>测试集排序准确率很高，为什么仍会 Reward Hacking？</summary><div><p>静态测试集衡量普通样本，优化器却会主动搜索极端高分区域。即使总体错误率很低，只要某类错误能给出异常高分，PPO 或 Best-of-N 就会反复放大它。必须评估被优化后的 Policy 输出与独立人类质量，而不只看原测试集。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>Reward Hacking 与普通预测错误有什么区别？</summary><div><p>普通错误可能随机出现；Reward Hacking 指优化过程系统性利用并放大代理模型的错误，使训练 Reward 持续上升而真实质量停滞或下降。重点在“错误被优化器选择并稳定复现”。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span>Process Reward Model 能彻底解决 Credit Assignment 吗？</summary><div><p>不能。它能为步骤提供更密集反馈，但步骤边界、局部正确性和全局策略价值仍可能不一致，PRM 自己也会有分布外错误与 Hacking。它是更细的代理监督，不是因果归因的完美答案。</p></div></details>
            <details id="qa-11"><summary><span>Q11</span>规则 Verifier 与 Reward Model 是一回事吗？</summary><div><p>Verifier 泛指判断输出是否满足目标的机制，可以是 Exact Match、符号等价、编译器或 Unit Tests；Reward Model 通常指由偏好数据训练的神经评分器。规则 Verifier 更客观但覆盖有限，RM 更通用但偏差和被利用风险更高。</p></div></details>
            <details id="qa-12"><summary><span>Q12</span><a className="term-link" href="/training/dpo">DPO</a> 不训练显式 Reward Model，就不会过优化吗？</summary><div><p>不能这样推断。DPO 消除了可单独调用的 RM 与在线 RL Loop，但仍在优化有限偏好数据定义的代理目标；训练过久、数据偏差或较大 Policy 偏移仍可能让真实质量下降。没有显式 RM 不等于没有代理目标与 Goodhart 风险。</p></div></details>
            <details id="qa-13"><summary><span>Q13</span>训练结束部署时还需要 Reward Model 吗？</summary><div><p>普通单次生成部署只需要最终 Policy，不需要 RM 或 Critic。RM 仍可用于 Best-of-N 重排、监控、数据筛选和下一轮对齐；若在线持续使用，就要把额外延迟、分布漂移和评分器攻击纳入产品设计。</p></div></details>
            <details id="qa-14"><summary><span>Q14</span>遇到平局或标注者意见不一致怎么办？</summary><div><p>不要一律随机指定 Winner。可以保留 Tie、使用软偏好概率、按标注者或维度建模，或把无法判断样本送回仲裁。分歧有时是噪声，有时是真实价值差异；把两者都压成一个硬标签会制造虚假确定性。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">PRIMARY SOURCES</p><h2>偏好建模、过程监督与过优化</h2></div>
          <ol>
            <li><a href="https://arxiv.org/abs/1706.03741" target="_blank" rel="noreferrer">Deep Reinforcement Learning from Human Preferences</a><span>2017</span></li>
            <li><a href="https://arxiv.org/abs/2009.01325" target="_blank" rel="noreferrer">Learning to Summarize from Human Feedback</a><span>2020</span></li>
            <li><a href="https://arxiv.org/abs/2203.02155" target="_blank" rel="noreferrer">Training Language Models to Follow Instructions with Human Feedback</a><span>2022</span></li>
            <li><a href="https://arxiv.org/abs/2210.10760" target="_blank" rel="noreferrer">Scaling Laws for Reward Model Overoptimization</a><span>2022</span></li>
            <li><a href="https://arxiv.org/abs/2305.20050" target="_blank" rel="noreferrer">Let&apos;s Verify Step by Step</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2307.09288" target="_blank" rel="noreferrer">Llama 2: Open Foundation and Fine-Tuned Chat Models</a><span>2023</span></li>
            <li><a href="https://arxiv.org/abs/2403.13787" target="_blank" rel="noreferrer">RewardBench: Evaluating Reward Models for Language Modeling</a><span>2024</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>继续连接知识</span><strong>Reward Model 定义代理目标，PPO 消费这个目标，Reasoning RL 则进一步比较 Learned Reward 与可验证反馈。</strong></div>
          <div className="footer-links"><a href="/training/rlhf">RLHF ↗</a><a href="/training/ppo">PPO ↗</a><a href="/training/reasoning-rl">Reasoning RL ↗</a></div>
        </footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "14" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>14 章</span><div><i></i></div><small>公式密度 · 中高</small></div>
      </aside>
    </div>
  );
}
