import type { Metadata } from "next";
import { Formula } from "../../components/Formula";
import { RightQaIndex } from "../../components/RightQaIndex";

const title = "向量、矩阵与 Token 轴记号规范";
const description = "统一规定单个向量、序列矩阵、批量张量、线性投影与 Attention 公式中的行列方向和维度写法。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "全库统一约定"],
  ["02", "单个向量默认方向"],
  ["03", "序列矩阵如何存 token"],
  ["04", "两套写法为何等价"],
  ["05", "线性投影与权重形状"],
  ["06", "Attention 的维度推导"],
  ["07", "Bias、Norm 与 RoPE"],
  ["08", "Batch 与 Head 轴"],
  ["09", "读其他论文与代码"],
  ["10", "关联 QA"],
];

const qaQuestions = [
  "既然单个向量默认是列向量，为什么 X 的一行却表示一个 token？",
  "Q=XW_Q 与 q_t=W_Q^T x_t 为什么是同一件事？",
  "写成 q_t=x_tW_Q 是否错误？",
  "为什么 Attention 使用 QK^T，而单个 score 使用 q_i^T k_j？",
  "PyTorch 中 shape 为 (d,) 的向量是行向量还是列向量？",
  "nn.Linear 的 weight 形状为什么和文档里的 W 相反？",
  "加入 Batch 和 Heads 后，各个轴如何排列？",
  "遇到采用 token-as-columns 的论文应该怎样转换？",
];

export default function TensorNotationPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页"><span className="brand-mark">模</span><span>模见 <small>Model Atlas</small></span></a>
        <nav className="topnav" aria-label="主导航"><a className="active" href="/">知识库</a><a href="#chapter-1">规范正文</a><a href="#qa">QA 索引</a></nav>
        <div className="top-actions"><a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a><span className="edition">2026.08</span></div>
      </header>

      <aside className="left-rail" aria-label="知识库目录">
        <p className="rail-kicker">知识库</p>
        <a className="rail-home" href="/"><span>◇</span> 大模型时代</a>
        <div className="rail-group"><p>00 · 数学与记号规范</p><a className="selected" href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a></div>
        <div className="rail-group"><p>01 · 模型与架构</p><a href="/">Qwen 系列演进</a><a href="/architecture/decoder-only">Decoder-only Transformer</a><a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a><a className="locked" href="#">Llama 系列演进 <em>待更新</em></a></div>
        <div className="rail-group"><p>02 · 训练与对齐</p><span className="rail-subhead">推理后训练</span><a href="/training/long-cot-cold-start">Long-CoT Cold Start</a><a href="/training/reasoning-rl">Reasoning RL</a><span className="rail-subhead">RL 与偏好优化</span><a href="/training/rlhf">RLHF</a><a href="/training/ppo">PPO</a><a href="/training/dpo">DPO</a><a href="/training/kto">KTO</a><a href="/training/grpo">GRPO</a><span>Pre-training · 待更新</span></div>
        <div className="rail-group muted"><p>03 · Agent 与应用</p><span>Memory</span><span>Tool Use</span></div>
        <div className="rail-group"><p>04 · 标准化与归一化</p><a href="/normalization/rmsnorm">RMSNorm</a></div>
        <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a href="/ffn/moe">MoE</a></div>
        <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
        <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
      </aside>

      <main className="article rms-article notation-article">
        <section className="hero rms-hero notation-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a> <span>/</span> 数学与记号规范 <span>/</span> 向量、矩阵与 Token 轴</div>
          <div className="question-label"><span>FOUNDATION STANDARD · 001</span></div>
          <p className="original-question">“输入矩阵 X 的一个 token 究竟是一行还是一列？一个没有写转置符号的向量默认是列向量还是行向量？为什么有时写 Q=XW，有时又写 q=Wᵀx？”</p>
          <div className="eyebrow"><span></span> MATHEMATICAL NOTATION · 00</div>
          <h1>向量、矩阵与 Token 轴记号规范</h1>
          <p className="dek">本页规定整个知识库的默认数学语言。核心做法是区分“抽象的单 token 向量”和“为了批量计算而存储的序列矩阵”：单个向量默认按列理解，序列矩阵则把 token 放在行上。</p>
          <div className="hero-meta"><span>建立于 2026.08.20</span><i></i><span>22 分钟阅读</span><i></i><span>全知识库基础规范</span></div>
          <aside className="answer-first"><span>全库默认约定</span><p><Formula inline tex={String.raw`x_t\in\mathbb R^{d\times1}`} /> 是列向量；<Formula inline tex={String.raw`X\in\mathbb R^{T\times d}`} /> 是 token-as-rows 的序列矩阵，第 <Formula inline tex={String.raw`t`} /> 行满足 <Formula inline tex={String.raw`X_{t,:}=x_t^{\mathsf T}`} />。因此矩阵级写 <Formula inline tex={String.raw`Q=XW_Q`} />，单 token 的列向量级写 <Formula inline tex={String.raw`q_t=W_Q^{\mathsf T}x_t`} />，两者完全等价。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>THE HOUSE STANDARD</p><h2>本知识库以后统一采用什么约定？</h2></div></div>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>单个特征向量默认是列向量</h3><p>写 <Formula inline tex={String.raw`x_t\in\mathbb R^d`} /> 时，默认其严格形状为 <Formula inline tex={String.raw`d\times1`} />。若需要行向量，明确写成 <Formula inline tex={String.raw`x_t^{\mathsf T}`} />。</p></div></article>
            <article><span>02</span><div><h3>序列矩阵默认一个 token 占一行</h3><p><Formula inline tex={String.raw`X\in\mathbb R^{T\times d}`} /> 中，第一维是 token/sequence 轴，第二维是 feature/hidden 轴，第 <Formula inline tex={String.raw`t`} /> 行是 <Formula inline tex={String.raw`x_t^{\mathsf T}`} />。</p></div></article>
            <article><span>03</span><div><h3>矩阵投影从右侧相乘</h3><p>若 <Formula inline tex={String.raw`W\in\mathbb R^{d\times m}`} />，则整个序列写 <Formula inline tex={String.raw`Y=XW\in\mathbb R^{T\times m}`} />。</p></div></article>
            <article><span>04</span><div><h3>所有省略都必须能通过 shape audit</h3><p>正文为了易读可把 <Formula inline tex={String.raw`\mathbb R^{d\times1}`} /> 简写成 <Formula inline tex={String.raw`\mathbb R^d`} />，但转置方向、乘法维度和 token 轴不能依赖猜测。</p></div></article>
          </div>
          <aside className="boundary-box"><b>为什么采用这套混合约定？</b><p>“向量默认列向量”符合常见线性代数习惯；“token 存在矩阵行上”则与深度学习系统常见的 <code>[batch, sequence, hidden]</code> 布局一致。用显式转置把两者连接起来，可以同时保持数学严谨和工程可读性。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>A SINGLE VECTOR</p><h2>一个单独出现的向量默认是什么方向？</h2></div></div>
          <p>本知识库把没有转置符号的小写向量视为列向量。例如第 <Formula inline tex={String.raw`t`} /> 个 token 的 hidden state：</p>
          <Formula label="单 token 列向量" tex={String.raw`x_t=\begin{bmatrix}x_{t,1}\\x_{t,2}\\\vdots\\x_{t,d}\end{bmatrix}\in\mathbb R^{d\times1}`} />
          <p>对应的行向量必须显式写出转置：</p>
          <Formula label="同一个 token 的行表示" tex={String.raw`x_t^{\mathsf T}=\begin{bmatrix}x_{t,1}&x_{t,2}&\cdots&x_{t,d}\end{bmatrix}\in\mathbb R^{1\times d}`} />
          <p>因此两个 token 向量的标准内积写为：</p>
          <Formula label="两个列向量的内积" tex={String.raw`x_i^{\mathsf T}x_j=\sum_{r=1}^{d}x_{i,r}x_{j,r}\in\mathbb R`} />
          <aside className="text-note"><b><Formula inline tex={String.raw`\mathbb R^d`} /> 隐藏了什么？</b><p><Formula inline tex={String.raw`x\in\mathbb R^d`} /> 只说明有 <Formula inline tex={String.raw`d`} /> 个分量，没有把 <Formula inline tex={String.raw`d\times1`} /> 写出来。本规范仍默认它是列向量；需要行向量时必须写 <Formula inline tex={String.raw`x^{\mathsf T}`} />。</p></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>A SEQUENCE MATRIX</p><h2>输入矩阵 X 中，一个 token 是一行还是一列？</h2></div></div>
          <p>默认一个 token 占一行。将 <Formula inline tex={String.raw`T`} /> 个列向量的转置从上到下堆叠，得到序列矩阵：</p>
          <Formula label="Token-as-Rows 序列矩阵" tex={String.raw`X=\begin{bmatrix}x_1^{\mathsf T}\\x_2^{\mathsf T}\\\vdots\\x_T^{\mathsf T}\end{bmatrix}\in\mathbb R^{T\times d},\qquad X_{t,:}=x_t^{\mathsf T}`} />
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>第 <Formula inline tex={String.raw`t`} /> 行：第 <Formula inline tex={String.raw`t`} /> 个 token</h3><p>沿水平方向的 <Formula inline tex={String.raw`d`} /> 个元素是该 token 的全部 hidden features。</p></div></article>
            <article><span>02</span><div><h3>第 <Formula inline tex={String.raw`r`} /> 列：第 <Formula inline tex={String.raw`r`} /> 个 feature</h3><p>沿竖直方向的 <Formula inline tex={String.raw`T`} /> 个元素是这个 feature 在整段序列上的取值。</p></div></article>
          </div>
          <p>因此“一个 token 是行向量”只是在描述它<b>存入序列矩阵后的行表示</b>。抽象对象仍记作列向量 <Formula inline tex={String.raw`x_t`} />；矩阵中的那一行是 <Formula inline tex={String.raw`x_t^{\mathsf T}`} />。</p>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>TWO EQUIVALENT VIEWS</p><h2>列向量公式与行存储公式为什么不冲突？</h2></div></div>
          <p>设一个投影把 <Formula inline tex={String.raw`d`} /> 维输入变成 <Formula inline tex={String.raw`m`} /> 维输出，并采用适合序列矩阵右乘的权重：</p>
          <Formula label="矩阵级权重与序列投影" tex={String.raw`W\in\mathbb R^{d\times m},\qquad Y=XW\in\mathbb R^{T\times m}`} />
          <p>取第 <Formula inline tex={String.raw`t`} /> 行：</p>
          <Formula label="第 t 行的行向量写法" tex={String.raw`Y_{t,:}=X_{t,:}W=x_t^{\mathsf T}W=y_t^{\mathsf T}`} />
          <p>对等式两边转置，就得到单 token 的列向量写法：</p>
          <Formula label="同一个运算的列向量写法" tex={String.raw`y_t=(x_t^{\mathsf T}W)^{\mathsf T}=W^{\mathsf T}x_t`} />
          <div className="derivation-box">
            <p className="mini-label">同一运算 · 两种观察尺度</p>
            <Formula className="dark-latex bare-latex" tex={String.raw`\boxed{Y=XW}\quad\Longleftrightarrow\quad\boxed{y_t=W^{\mathsf T}x_t}`} />
          </div>
          <aside className="boundary-box"><b>不要混用中间状态</b><p>如果把 <Formula inline tex={String.raw`x_t`} /> 声明为列向量，就不能直接写 <Formula inline tex={String.raw`x_tW`} />；若要从右侧乘 <Formula inline tex={String.raw`W`} />，必须使用矩阵中的行表示 <Formula inline tex={String.raw`x_t^{\mathsf T}W`} />。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>LINEAR PROJECTION</p><h2>以后怎样写权重矩阵和 Bias 的形状？</h2></div></div>
          <p>本知识库的数学公式优先使用“输入维在前、输出维在后”的投影矩阵：</p>
          <Formula label="序列级仿射投影" tex={String.raw`X\in\mathbb R^{T\times d},\quad W\in\mathbb R^{d\times m},\quad b\in\mathbb R^{m\times1}`} />
          <Formula label="Bias 沿 token 轴广播" tex={String.raw`Y=XW+\mathbf1_Tb^{\mathsf T}\in\mathbb R^{T\times m}`} />
          <p>对应的单 token 列向量公式是：</p>
          <Formula label="单 token 仿射投影" tex={String.raw`y_t=W^{\mathsf T}x_t+b\in\mathbb R^{m\times1}`} />
          <div className="norm-table-wrap">
            <table className="norm-table">
              <thead><tr><th>符号</th><th>形状</th><th>含义</th></tr></thead>
              <tbody>
                <tr><td><Formula inline tex={String.raw`x_t`} /></td><td><Formula inline tex={String.raw`d\times1`} /></td><td>第 t 个 token 的输入列向量</td></tr>
                <tr><td><Formula inline tex={String.raw`X`} /></td><td><Formula inline tex={String.raw`T\times d`} /></td><td>按行堆叠的序列矩阵</td></tr>
                <tr><td><Formula inline tex={String.raw`W`} /></td><td><Formula inline tex={String.raw`d\times m`} /></td><td>适合从右侧乘 X 的数学权重</td></tr>
                <tr><td><Formula inline tex={String.raw`b`} /></td><td><Formula inline tex={String.raw`m\times1`} /></td><td>对所有 token 共享的输出 Bias</td></tr>
                <tr><td><Formula inline tex={String.raw`Y`} /></td><td><Formula inline tex={String.raw`T\times m`} /></td><td>按行存储的输出序列</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>ATTENTION SHAPE AUDIT</p><h2>QKᵀ 与 qᵢᵀkⱼ 怎样同时成立？</h2></div></div>
          <p>先把 heads 暂时合并，只看一个 head dimension <Formula inline tex={String.raw`d_h`} />。序列矩阵中的每一行分别是一个 Query 或 Key 列向量的转置：</p>
          <Formula label="Q/K 序列矩阵" tex={String.raw`Q=\begin{bmatrix}q_1^{\mathsf T}\\\vdots\\q_T^{\mathsf T}\end{bmatrix}\in\mathbb R^{T\times d_h},\qquad K=\begin{bmatrix}k_1^{\mathsf T}\\\vdots\\k_T^{\mathsf T}\end{bmatrix}\in\mathbb R^{T\times d_h}`} />
          <p>矩阵级 score 是：</p>
          <Formula label="完整 Attention score matrix" tex={String.raw`S=\frac{QK^{\mathsf T}}{\sqrt{d_h}}\in\mathbb R^{T\times T}`} />
          <p>它的第 <Formula inline tex={String.raw`i`} /> 行、第 <Formula inline tex={String.raw`j`} /> 列恰好是：</p>
          <Formula label="一个 Query–Key 对的 score" tex={String.raw`S_{ij}=\frac{Q_{i,:}(K_{j,:})^{\mathsf T}}{\sqrt{d_h}}=\frac{q_i^{\mathsf T}k_j}{\sqrt{d_h}}`} />
          <p>所以 <Formula inline tex={String.raw`QK^{\mathsf T}`} /> 使用的是“token 存在行上”的矩阵布局；<Formula inline tex={String.raw`q_i^{\mathsf T}k_j`} /> 使用的是“单 token 默认列向量”的数学约定。二者逐元素完全一致。</p>
          <Formula label="加入 Mask 后的 Attention" tex={String.raw`A=\operatorname{softmax}_{\mathrm{row}}\!\left(S+M\right),\qquad O=AV`} />
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>BIAS, NORM AND ROTATION</p><h2>Bias、RMSNorm 和 RoPE 分别作用在哪个对象上？</h2></div></div>
          <p>在单 token 的抽象公式中，它们都作用于列向量：</p>
          <div className="formula-sequence">
            <div><span>Q PROJECTION</span><Formula className="sequence-latex" tex={String.raw`q_t=W_Q^{\mathsf T}x_t+b_Q`} /></div>
            <div><span><a className="term-link" href="/attention/qk-norm">QK-NORM</a></span><Formula className="sequence-latex" tex={String.raw`\bar q_t=\operatorname{RMSNorm}(q_t)`} /></div>
            <div><span>ROPE</span><Formula className="sequence-latex" tex={String.raw`\widetilde q_t=R(t\theta)\bar q_t`} /></div>
          </div>
          <p>把它们批量存回矩阵时，第 <Formula inline tex={String.raw`t`} /> 行分别是 <Formula inline tex={String.raw`q_t^{\mathsf T}`} />、<Formula inline tex={String.raw`\bar q_t^{\mathsf T}`} /> 和 <Formula inline tex={String.raw`\widetilde q_t^{\mathsf T}`} />。例如旋转后的行表示满足：</p>
          <Formula label="列向量旋转与行存储的关系" tex={String.raw`\widetilde q_t=R_t\bar q_t\quad\Longleftrightarrow\quad\widetilde q_t^{\mathsf T}=\bar q_t^{\mathsf T}R_t^{\mathsf T}`} />
          <aside className="text-note"><b>代码通常不显式转置</b><p>框架会在张量最后一维上批量执行 Norm 或成对旋转。数学中的转置用于说明对象方向；工程 kernel 可以通过 reshape、broadcast 和等价逐元素操作得到同一结果。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>BATCH AND HEAD AXES</p><h2>加入 Batch 和 Attention Heads 后，矩阵变成什么？</h2></div></div>
          <p>到目前为止省略了 Batch 与 Head 轴。工程张量最初通常采用：</p>
          <Formula label="Decoder hidden states 的常见布局" tex={String.raw`X\in\mathbb R^{B\times T\times d_{\mathrm{model}}}`} />
          <p>这里 <Formula inline tex={String.raw`B`} /> 是 batch size，<Formula inline tex={String.raw`T`} /> 是 token 数，最后一维是每个 token 的 features。投影并拆分 heads 后，常见逻辑形状是：</p>
          <Formula label="拆分 Attention heads 后的逻辑形状" tex={String.raw`Q\in\mathbb R^{B\times n_q\times T\times d_h},\qquad K,V\in\mathbb R^{B\times n_{kv}\times T\times d_h}`} />
          <p>实际代码也可能使用 <Formula inline tex={String.raw`B\times T\times n_h\times d_h`} />，再在 kernel 前交换轴。轴的物理排列可以变化，但语义必须明确：</p>
          <div className="reason-list compact-reasons">
            <article><span>B</span><div><h3>Batch 轴</h3><p>不同样本互不做 Attention，通常是最外层并行轴。</p></div></article>
            <article><span>H</span><div><h3>Head 轴</h3><p>不同 heads 拥有不同投影子空间；GQA 中 Q heads 与 KV heads 数可以不同。</p></div></article>
            <article><span>T</span><div><h3>Token 轴</h3><p>Attention score 的两个 <Formula inline tex={String.raw`T`} /> 轴分别对应 Query 位置和 Key 位置。</p></div></article>
            <article><span>D</span><div><h3>Feature 轴</h3><p>矩阵乘法在 <Formula inline tex={String.raw`d_h`} /> 上收缩，得到 <Formula inline tex={String.raw`T\times T`} /> scores。</p></div></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>READING OTHER CONVENTIONS</p><h2>其他论文把 token 放在列上时，应该怎样转换？</h2></div></div>
          <p>Token-as-Columns 也是完全合法的约定。若另一篇论文写：</p>
          <Formula label="另一种常见序列布局" tex={String.raw`X_{\mathrm{col}}=\begin{bmatrix}x_1&x_2&\cdots&x_T\end{bmatrix}\in\mathbb R^{d\times T}`} />
          <p>它与本知识库的矩阵只是互为转置：</p>
          <Formula label="两种序列布局的转换" tex={String.raw`X_{\mathrm{col}}=X^{\mathsf T},\qquad X=X_{\mathrm{col}}^{\mathsf T}`} />
          <p>此时线性投影通常从左侧作用：</p>
          <Formula label="Token-as-Columns 下的投影" tex={String.raw`Y_{\mathrm{col}}=W^{\mathsf T}X_{\mathrm{col}}\in\mathbb R^{m\times T}`} />
          <aside className="boundary-box"><b>判断一条公式，不要只看乘法方向</b><p>先寻找作者对 <Formula inline tex={String.raw`X`} /> 和 <Formula inline tex={String.raw`W`} /> 的 shape 定义，再检查相乘的内维是否一致。Token-as-Rows 与 Token-as-Columns 都正确；同一段推导中没有声明就来回切换才是问题。</p></aside>
          <div className="reason-list compact-reasons">
            <article><span>01</span><div><h3>先写每个对象的 shape</h3><p>例如 <Formula inline tex={String.raw`(T\times d)(d\times m)=(T\times m)`} />。</p></div></article>
            <article><span>02</span><div><h3>确认被收缩的是 feature 轴</h3><p>线性投影应在输入 feature dimension 上求和，而不是把不同 token 混在一起。</p></div></article>
            <article><span>03</span><div><h3>确认 score 的两个轴都是 token 轴</h3><p>Self-Attention 的 score matrix 对单个 head 应为 <Formula inline tex={String.raw`T\times T`} />。</p></div></article>
          </div>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>10</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>既然单个向量默认是列向量，为什么 X 的一行却表示一个 token？</summary><div><p>因为 <Formula inline tex={String.raw`x_t`} /> 是抽象的单 token 列向量，而序列矩阵为了批量右乘权重，会把 <Formula inline tex={String.raw`x_t^{\mathsf T}`} /> 作为第 <Formula inline tex={String.raw`t`} /> 行存入 <Formula inline tex={String.raw`X`} />。严格关系是 <Formula inline tex={String.raw`X_{t,:}=x_t^{\mathsf T}`} />，两者不是同一个方向的对象。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>Q=XW_Q 与 q_t=W_Q^T x_t 为什么是同一件事？</summary><div><p><Formula inline tex={String.raw`Q`} /> 的第 <Formula inline tex={String.raw`t`} /> 行是 <Formula inline tex={String.raw`x_t^{\mathsf T}W_Q`} />。把这一行转置为默认的列向量，就得到 <Formula inline tex={String.raw`q_t=(x_t^{\mathsf T}W_Q)^{\mathsf T}=W_Q^{\mathsf T}x_t`} />。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>写成 q_t=x_tW_Q 是否错误？</summary><div><p>在本规范下是错误或至少不严谨，因为 <Formula inline tex={String.raw`x_t`} /> 默认是 <Formula inline tex={String.raw`d\times1`} /> 列向量，不能从右侧乘 <Formula inline tex={String.raw`d\times m`} /> 的 <Formula inline tex={String.raw`W_Q`} />。若作者明确把 <Formula inline tex={String.raw`x_t`} /> 定义为行向量，则可以这样写；本知识库会改写为 <Formula inline tex={String.raw`x_t^{\mathsf T}W_Q`} /> 或列向量形式。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>为什么 Attention 使用 QK^T，而单个 score 使用 q_i^T k_j？</summary><div><p><Formula inline tex={String.raw`Q`} /> 的第 <Formula inline tex={String.raw`i`} /> 行是 <Formula inline tex={String.raw`q_i^{\mathsf T}`} />，<Formula inline tex={String.raw`K^{\mathsf T}`} /> 的第 <Formula inline tex={String.raw`j`} /> 列是 <Formula inline tex={String.raw`k_j`} />。所以矩阵乘积的第 <Formula inline tex={String.raw`(i,j)`} /> 个元素正是 <Formula inline tex={String.raw`q_i^{\mathsf T}k_j`} />。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>PyTorch 中 shape 为 (d,) 的向量是行向量还是列向量？</summary><div><p>严格来说两者都不是，它是一阶张量，只有一个长度为 <Formula inline tex={String.raw`d`} /> 的轴。它在矩阵乘法中表现成哪种方向取决于具体操作。数学文档必须显式规定方向；本知识库把对应的抽象向量默认解释为 <Formula inline tex={String.raw`d\times1`} /> 列向量。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>nn.Linear 的 weight 形状为什么和文档里的 W 相反？</summary><div><p>常见框架将 Linear 权重存为 <code>[out_features, in_features]</code>，并计算 <Formula inline tex={String.raw`y=xW_{\mathrm{code}}^{\mathsf T}+b`} />。本知识库定义适合序列矩阵右乘的 <Formula inline tex={String.raw`W_{\mathrm{math}}=W_{\mathrm{code}}^{\mathsf T}\in\mathbb R^{d\times m}`} />，所以写 <Formula inline tex={String.raw`Y=XW_{\mathrm{math}}`} />。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>加入 Batch 和 Heads 后，各个轴如何排列？</summary><div><p>语义上始终需要 Batch、Head、Query-token、Key-token 和 feature 这些轴；物理排列可因实现而不同。本文默认说明为 <Formula inline tex={String.raw`B\times n_h\times T\times d_h`} />，但代码使用 <Formula inline tex={String.raw`B\times T\times n_h\times d_h`} /> 也等价，只要在矩阵乘法前正确换轴。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>遇到采用 token-as-columns 的论文应该怎样转换？</summary><div><p>把它的序列矩阵整体转置即可：<Formula inline tex={String.raw`X_{\mathrm{row}}=X_{\mathrm{col}}^{\mathsf T}`} />。同时将左乘投影转写为右乘投影，并重新检查每个权重的 shape。不要只机械移动转置符号而忽略权重定义也可能不同。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources">
          <div><p className="mini-label">HOUSE STANDARD</p><h2>本规范的适用范围</h2></div>
          <ol>
            <li><span>单 token</span><span>默认列向量</span></li>
            <li><span>序列矩阵</span><span>Token-as-Rows</span></li>
            <li><span>工程张量</span><span>Batch × Sequence × Hidden</span></li>
            <li><span>矩阵级投影</span><span>从右侧乘数学权重</span></li>
            <li><span>外部资料</span><span>先读 shape，再转换约定</span></li>
          </ol>
        </section>

        <footer className="article-footer">
          <div><span>开始应用规范</span><strong>下一步可用这套记号重新检查 QKV Bias、GQA、RoPE 与 Decoder-only 中的所有矩阵公式。</strong></div>
          <div className="footer-links"><a href="/attention/qkv-bias">QKV Bias ↗</a><a href="/attention/gqa">GQA ↗</a><a href="/position-encoding/rope">RoPE ↗</a></div>
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
