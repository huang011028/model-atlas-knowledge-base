import type { Metadata } from "next";
import { RightQaIndex } from "../../components/RightQaIndex";
import { TrainingSidebar } from "../../components/TrainingSidebar";

const title = "Agent Tools：Tool Calling、Function Calling 与 MCP";
const description = "从工程视角解释 Agent 中 Tools 的职责、Tool Calling 与 Function Calling 的关系、常见工具形式、完整调用循环、跨厂商消息格式、MCP 架构以及生产安全边界。";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "article", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

const chapters = [
  ["01", "Tools 在 Agent 中做什么"],
  ["02", "Tool Calling 与 Function Calling"],
  ["03", "常见工具形式"],
  ["04", "完整 Tool Loop"],
  ["05", "三家 API 消息格式"],
  ["06", "Tool Schema 怎样设计"],
  ["07", "选择、并行与多轮调用"],
  ["08", "Runtime 的执行与安全"],
  ["09", "从订单例子认识 MCP"],
  ["10", "MCP 与 Tool Calling 怎样衔接"],
  ["11", "MCP、REST、OpenAPI 与框架"],
  ["12", "三种接入架构"],
  ["13", "调试、评测与上线清单"],
  ["14", "最小实现"],
  ["15", "关联 QA"],
] as const;

const qaQuestions = [
  "Tool 是代码、API，还是给模型看的 Schema？",
  "Tool Calling 和 Function Calling 是一个东西吗？",
  "Function Call 现在到底有几种形式？",
  "模型会亲自执行函数吗？",
  "Tool Call 为什么必须带 Call ID？",
  "Structured Output 和 Tool Calling 有什么区别？",
  "一次响应可以调用多个 Tools 吗？",
  "tool_choice、strict 和 parallel_tool_calls 分别控制什么？",
  "为什么不能相信模型生成的 Tool 参数？",
  "Tool Result 应该返回多少内容？",
  "MCP 是一种 Tool Calling 格式吗？",
  "有了 MCP 以后还需要 Function Calling 吗？",
  "Tool Calling 一定需要 MCP 吗？",
  "MCP Server 一定运行在远端吗？",
  "MCP 与 REST API、OpenAPI 有什么区别？",
  "MCP 是 LangChain、LangGraph 一类 Agent 框架吗？",
  "Agent-as-Tool 与 MCP Tool 是一回事吗？",
  "怎样判断一次 Tool 执行真的成功？",
  "这里说的数据源到底是什么？",
  "MCP Client 是用户、模型，还是一段程序？",
  "MCP Server 就是数据库或远程服务器吗？",
];

const openAiFunctionExample = `const tools = [{
  type: "function",
  name: "get_order",
  description: "读取当前用户的一笔订单；不修改订单。",
  strict: true,
  parameters: {
    type: "object",
    properties: {
      order_id: { type: "string", description: "订单号" }
    },
    required: ["order_id"],
    additionalProperties: false
  }
}];`;

const runtimeLoop = `response = model(input, tools)

while response contains tool calls:
  results = []
  for call in response.tool_calls:
    args = parse_and_validate(call.arguments)
    identity = authorize(user, call.name, args)
    approval = request_approval_if_needed(call, identity)
    result = execute_with_timeout_retry_idempotency(call, args)
    audit(call.id, identity, args, result)
    results.push(tool_output(call.id, result))

  response = model(previous_items + results, tools)

return verified_final_answer(response)`;

export default function ToolsPage() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="模见首页"><span className="brand-mark">模</span><span>模见 <small>Model Atlas</small></span></a>
        <nav className="topnav"><a className="active" href="/">知识库</a><a href="#chapter-4">调用流程</a><a href="#chapter-9">MCP</a><a href="#qa">QA 索引</a></nav>
        <div className="top-actions"><a className="search-hint" href="#qa">⌘ K&nbsp;&nbsp;QA 速查</a><span className="edition">2026.08</span></div>
      </header>

      <TrainingSidebar selected="tools" />

      <main className="article rms-article">
        <section className="hero rms-hero" id="top">
          <div className="breadcrumbs"><a href="/">知识库</a><span>/</span><a href="/agents/agent">Agent 与应用</a><span>/</span>Tools</div>
          <div className="question-label"><span>AGENT SYSTEMS · 003</span></div>
          <p className="original-question">“Agent 中的 Tool 到底负责什么？Tool Calling、Function Calling 和 MCP 是同一层的概念吗？一条工具调用从模型到真实系统究竟怎样走完？”</p>
          <div className="eyebrow"><span></span>FROM MODEL INTENT TO VERIFIED ACTION</div>
          <h1>Agent Tools</h1>
          <p className="dek">Tools 把模型的语言判断连接到外部数据与真实动作。模型只产生调用意图，Agent Runtime 才负责校验、授权、执行、记录并把结果作为 Observation 送回模型。</p>
          <div className="hero-meta"><span>更新于 2026.08.27</span><i></i><span>60 分钟阅读</span><i></i><span>工程流程 + 协议对照 + MCP</span></div>
          <aside className="answer-first"><span>先记住这一条边界</span><p><b>模型提出“调用什么、参数是什么”；Runtime 决定“能不能做、怎样做、是否成功”。</b>一段合法的 Tool Call 不是执行回执，更不是业务事实。</p></aside>
        </section>

        <section className="prose-section" id="chapter-1">
          <div className="prose-heading"><span>01</span><div><p>CAPABILITY BOUNDARY</p><h2>Tools 在 Agent 中究竟做什么？</h2></div></div>
          <p>LLM 本身擅长理解语言、归纳信息和选择下一步，却不能仅靠“生成文字”读取实时订单、搜索私有数据库、发送邮件或提交退款。Tool 是 Runtime 暴露给模型的一组<b>受约束能力接口</b>：它让模型能够请求外部信息或动作，并让执行结果重新进入 Agent Loop。</p>
          <div className="agent-runtime-flow" role="img" aria-label="Tools 把模型意图连接到外部系统">
            <article><span>MODEL</span><b>理解目标</b><small>判断当前缺什么信息、下一步需要什么动作</small></article>
            <article><span>TOOL CALL</span><b>提出结构化意图</b><small>给出 Tool 名称、参数与唯一 Call ID</small></article>
            <article><span>RUNTIME</span><b>验证并执行</b><small>鉴权、审批、超时、重试、幂等与审计</small></article>
            <article><span>OBSERVATION</span><b>返回真实结果</b><small>成功回执、业务拒绝、错误或可继续使用的数据</small></article>
          </div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>没有 Tool 时</th><th>有 Tool 时</th><th>真正增加的能力</th></tr></thead><tbody>
            <tr><td>根据训练知识回答“订单大概怎样处理”</td><td>调用 <code>get_order</code> 读取 A123</td><td>访问实时、私有、用户特定数据</td></tr>
            <tr><td>生成“已为你退款”的文字</td><td>调用 <code>refund_order</code> 并核对事务回执</td><td>对外部系统产生可验证副作用</td></tr>
            <tr><td>猜测一个 API 参数对象</td><td>按 Schema 生成受约束参数</td><td>把自然语言意图变成机器接口</td></tr>
            <tr><td>遇到错误后只能解释</td><td>读取错误类型并修正参数或改走其他路径</td><td>形成 Action → Observation → Decision 闭环</td></tr>
          </tbody></table></div>
          <aside className="boundary-box"><b>Tool 不是给模型安装了一段代码</b><p>模型通常只看见 Tool 的名称、描述和输入 Schema；实现代码、数据库凭证和真实权限都在 Runtime 或服务端。Schema 是“模型可见接口”，Executor 才是“真实执行体”。</p></aside>
        </section>

        <section className="prose-section" id="chapter-2">
          <div className="prose-heading"><span>02</span><div><p>TERMINOLOGY</p><h2>Tool Calling 和 Function Calling 是一个东西吗？</h2></div></div>
          <p>日常交流中二者经常被当作同义词，因为最早、最常见的 Tool 就是开发者定义的函数。更准确的层级关系是：<b>Tool Calling 是上位概念，Function Calling 是其中一种具体形式。</b></p>
          <div className="engineering-stack">
            <article><span>TOOL CALLING</span><b>模型请求使用外部能力的总称</b><small>Function、Web Search、File Search、Computer、MCP 等</small></article>
            <article><span>FUNCTION CALLING</span><b>模型按函数 Schema 生成名称与参数</b><small>通常由你的应用代码负责真正执行</small></article>
            <article><span>FUNCTION EXECUTION</span><b>Runtime 调用本地函数、SDK、数据库或 HTTP API</b><small>这一步发生在模型之外，必须单独授权与验证</small></article>
          </div>
          <p>因此，“模型返回 Function Call”只表示它生成了一个结构化请求。即便函数名和 JSON 参数都合法，Runtime 仍可以因为权限不足、参数不符合业务规则、需要人工审批或系统故障而拒绝执行。</p>
          <aside className="text-note"><b>术语为什么看起来混乱？</b><p>不同 Provider 和不同时期的 API 命名不同：有的文档仍把整个能力称为 Function Calling，有的统一放进 <code>tools</code> 数组。阅读时先问“这是模型提出调用，还是服务端已经执行”，比死记字段名称更可靠。</p></aside>
        </section>

        <section className="prose-section" id="chapter-3">
          <div className="prose-heading"><span>03</span><div><p>TOOL TAXONOMY</p><h2>“Function Call 现在有几种形式”应该怎样理解？</h2></div></div>
          <p>没有一个跨平台统一的固定数字。最实用的分类轴是<b>输入契约是什么、代码在哪里执行、能力怎样被发现</b>。按当前主流 API，可以先分成下面五类；串行、并行、强制调用只是调度方式，不是新的 Tool 类型。</p>
          <div className="agent-pattern-grid">
            <article className="agent-pattern-card"><span>01 · FUNCTION TOOL</span><h3>JSON Schema 函数工具</h3><div className="pattern-flow"><b>Schema</b><i>→</i><b>name + JSON args</b><i>→</i><b>你的代码执行</b></div><p>最常见形式。适合业务 API、数据库查询和参数结构明确的动作。</p></article>
            <article className="agent-pattern-card"><span>02 · CUSTOM / FREE-FORM TOOL</span><h3>自由文本或受 Grammar 约束的工具</h3><div className="pattern-flow"><b>Instructions</b><i>→</i><b>text payload</b><i>→</i><b>你的代码执行</b></div><p>适合代码、DSL、SQL 等不值得硬套 JSON 的输入；并非所有 Provider 都提供这一独立类型。</p></article>
            <article className="agent-pattern-card"><span>03 · HOSTED TOOL</span><h3>平台托管工具</h3><div className="pattern-flow"><b>enable tool</b><i>→</i><b>provider executes</b><i>→</i><b>result item</b></div><p>例如 Web Search、File Search、Code Interpreter。调用循环的一部分由模型平台托管。</p></article>
            <article className="agent-pattern-card"><span>04 · MCP TOOL</span><h3>通过 MCP Server 暴露的工具</h3><div className="pattern-flow"><b>discover</b><i>→</i><b>call tool</b><i>→</i><b>MCP result</b></div><p>能力由 MCP Server 发布，Host/Client 负责发现、连接、授权和路由。</p></article>
            <article className="agent-pattern-card"><span>05 · AGENT AS TOOL</span><h3>把另一个 Agent 当成能力调用</h3><div className="pattern-flow"><b>manager</b><i>→</i><b>specialist run</b><i>→</i><b>result</b></div><p>这是框架层的编排模式；底层仍可能通过 Function Tool 或其他协议实现。</p></article>
            <article className="agent-pattern-card"><span>NOT A NEW TYPE</span><h3>串行、并行、强制与自动选择</h3><div className="pattern-flow"><b>tool_choice</b><i>·</i><b>parallel</b><i>·</i><b>multi-turn</b></div><p>这些控制模型何时、一次调用几个、是否必须调用，不改变工具本身的执行归属。</p></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-4">
          <div className="prose-heading"><span>04</span><div><p>THE COMPLETE LOOP</p><h2>一次工具调用怎样从用户请求走到最终答案？</h2></div></div>
          <p>客户端 Function Tool 的完整过程不是“发一次请求就结束”，而是至少两次 Model Call，中间夹着一次受控执行。模型还可能在看完结果后继续调用另一个 Tool，因此 Runtime 必须实现循环而不是只处理一次回调。</p>
          <div className="agent-loop-board" role="img" aria-label="完整 Tool Calling 循环">
            <article><span>01</span><b>Declare</b><small>给模型 Tool 名称、描述与 Schema</small></article>
            <article><span>02</span><b>Request</b><small>发送用户输入、上下文和 Tools</small></article>
            <article><span>03</span><b>Call</b><small>模型返回 name、arguments、call_id</small></article>
            <article><span>04</span><b>Gate</b><small>解析、校验、鉴权与必要审批</small></article>
            <article><span>05</span><b>Execute</b><small>调用本地代码或远程系统</small></article>
            <article><span>06</span><b>Return</b><small>按 call_id 回传 Tool Result</small></article>
            <article><span>07</span><b>Continue</b><small>模型回答、修正或再次调用</small></article>
          </div>
          <div className="agent-sequence"><table><thead><tr><th></th><th>User</th><th>Runtime</th><th>Model</th><th>Order Service</th></tr></thead><tbody>
            <tr><td>01</td><td className="active-cell">“A123 到哪了？”</td><td>装配 Context + Tools</td><td></td><td></td></tr>
            <tr><td>02</td><td></td><td>请求模型</td><td className="active-cell"><code>get_order({"{order_id: 'A123'}"})</code></td><td></td></tr>
            <tr><td>03</td><td></td><td className="active-cell">校验用户是否拥有 A123</td><td></td><td>读取订单</td></tr>
            <tr><td>04</td><td></td><td>回传与 Call ID 配对的结果</td><td className="active-cell">读取状态并组织答案</td><td className="active-cell">IN_TRANSIT / ETA</td></tr>
            <tr><td>05</td><td className="active-cell">看到有依据的答复</td><td>记录 Trace</td><td>Final Text</td><td></td></tr>
          </tbody></table></div>
          <aside className="answer-first"><span>Call ID 的作用</span><p>一个模型响应可以提出多个调用，结果也可能并行返回。<b>Call ID 把每个 Tool Result 精确配回原始 Tool Call</b>，避免靠数组位置或函数名猜对应关系。</p></aside>
        </section>

        <section className="prose-section" id="chapter-5">
          <div className="prose-heading"><span>05</span><div><p>PROVIDER ENVELOPES</p><h2>OpenAI、Claude 与 Gemini 的调用格式有什么区别？</h2></div></div>
          <p>三者的语义循环相同：声明能力 → 模型产生调用 → 应用执行 → 按调用标识返回结果 → 模型继续。区别主要在消息信封、字段命名、托管工具和状态管理方式。下面展示的是便于理解的协议骨架，不代替各 SDK 当前版本的类型定义。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>接口</th><th>模型发出的调用</th><th>应用返回的结果</th><th>主要组织方式</th></tr></thead><tbody>
            <tr><td>OpenAI Responses</td><td><code>function_call</code> Item + <code>call_id</code></td><td><code>function_call_output</code> Item + 同一 <code>call_id</code></td><td>Typed Items</td></tr>
            <tr><td>OpenAI Chat Completions</td><td>Assistant Message 的 <code>tool_calls[]</code></td><td><code>role: tool</code> + <code>tool_call_id</code></td><td>Role Messages</td></tr>
            <tr><td>Claude Messages</td><td>Assistant Content 中的 <code>tool_use</code> Block</td><td>User Content 中的 <code>tool_result</code> Block</td><td>Content Blocks</td></tr>
            <tr><td>Gemini</td><td>Model Part 中的 <code>functionCall</code></td><td>Client Part 中的 <code>functionResponse</code></td><td>Content Parts</td></tr>
          </tbody></table></div>
          <div className="protocol-grid">
            <article className="protocol-card"><header><b>OpenAI Responses · conceptual</b><span>TYPED ITEMS</span></header><pre className="protocol-code"><code>{`MODEL
{ type: "function_call", call_id: "c1",
  name: "get_order", arguments: "{...}" }

RUNTIME
{ type: "function_call_output", call_id: "c1",
  output: "{...}" }`}</code></pre></article>
            <article className="protocol-card"><header><b>Claude Messages · conceptual</b><span>CONTENT BLOCKS</span></header><pre className="protocol-code"><code>{`ASSISTANT
{ type: "tool_use", id: "t1",
  name: "get_order", input: {...} }

USER
{ type: "tool_result", tool_use_id: "t1",
  content: "{...}" }`}</code></pre></article>
          </div>
          <p>SDK 的 Tool Runner 或 Agent Framework 可以隐藏循环样板，但生产排障时仍需要保存 Provider 原始事件。否则“模型没调用”“调用没执行”“结果没配对”“平台托管工具暂停”会在抽象层里看成同一种失败。</p>
        </section>

        <section className="prose-section" id="chapter-6">
          <div className="prose-heading"><span>06</span><div><p>AGENT-COMPUTER INTERFACE</p><h2>Tool Schema 怎样设计，模型才容易正确使用？</h2></div></div>
          <p>Tool Schema 是面向模型的 API 设计。它不只是类型声明，还要说明使用边界、参数语义和错误恢复方式。模型看不见你的实现，所以名称含糊、能力重叠或返回不可读，都会直接转化为调用错误。</p>
          <div className="agent-checklist">
            <article><span>01</span><h3>名称表达单一动作</h3><p>使用 <code>get_order</code>、<code>propose_refund</code>，避免 <code>handle_order</code> 这种包办所有行为的入口。</p></article>
            <article><span>02</span><h3>描述包含正反边界</h3><p>说明“何时使用、何时不要使用、是否产生副作用”，不要只复述函数名。</p></article>
            <article><span>03</span><h3>参数尽量结构化</h3><p>使用必填、Enum、范围和互斥对象；避免让模型在一个自由文本字段里拼协议。</p></article>
            <article><span>04</span><h3>输入不要让模型伪造身份</h3><p>用户 ID、租户、权限等应由可信 Runtime 注入，不应让模型从对话中自行填写。</p></article>
            <article><span>05</span><h3>错误要可行动</h3><p>区分 INVALID_ARGUMENT、NOT_FOUND、PERMISSION_DENIED、RETRYABLE 与 BUSINESS_REJECTED。</p></article>
            <article><span>06</span><h3>返回事实、证据与状态</h3><p>提供机器可读状态、外部事务 ID、来源和下一步提示，避免只返回“成功了”。</p></article>
          </div>
          <div className="protocol-grid"><article className="protocol-card"><header><b>一个只读 Function Tool</b><span>OPENAI-STYLE SCHEMA</span></header><pre className="protocol-code"><code>{openAiFunctionExample}</code></pre></article><article className="protocol-card"><header><b>推荐的执行结果</b><span>RUNTIME CONTRACT</span></header><pre className="protocol-code"><code>{`{
  "ok": true,
  "status": "IN_TRANSIT",
  "eta": "2026-08-29",
  "source": "order-service",
  "observed_at": "2026-08-27T10:31:22+08:00"
}`}</code></pre></article></div>
          <aside className="boundary-box"><b>Schema 合法不等于业务合法</b><p><code>amount</code> 是数字，只能说明类型正确；它是否超过可退金额、订单是否属于当前用户、退款是否需要审批，仍必须由确定性业务代码检查。</p></aside>
        </section>

        <section className="prose-section" id="chapter-7">
          <div className="prose-heading"><span>07</span><div><p>SELECTION AND SCHEDULING</p><h2>模型何时调用、调用几个、调用多少轮？</h2></div></div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>控制项</th><th>控制什么</th><th>不控制什么</th></tr></thead><tbody>
            <tr><td><code>tool_choice: auto</code></td><td>允许模型在文本回答与 Tool 之间选择</td><td>不保证一定调用</td></tr>
            <tr><td><code>required</code></td><td>要求本轮至少产生 Tool Call</td><td>不代表任意参数都会执行</td></tr>
            <tr><td><code>none</code></td><td>禁止本轮调用 Tool</td><td>不等于移除历史 Tool Results</td></tr>
            <tr><td>指定某个 Tool</td><td>限制模型只能或必须选择该能力</td><td>不跳过 Runtime 校验</td></tr>
            <tr><td><code>strict</code></td><td>提高参数遵守 Schema 的可靠性</td><td>不验证权限与业务约束</td></tr>
            <tr><td><code>parallel_tool_calls</code></td><td>是否允许一次模型输出多个独立调用</td><td>不自动解决依赖、锁和事务顺序</td></tr>
          </tbody></table></div>
          <p>并行只适合互不依赖的读取，例如同时查天气和日历。如果第二个调用需要第一个结果，或两个写操作可能竞争同一资源，Runtime 应按依赖图串行执行。无论是否并行，都要设置最大 Model Calls、Tool Calls、时间、成本和重复调用检测。</p>
          <aside className="text-note"><b>很多 Tools 时怎么办？</b><p>不要把成百上千个完整 Schema 一次性塞给模型。可以先做确定性权限过滤与领域路由，再使用 Tool Search 或分层 Registry 按需加载候选能力。减少 Tool Surface 往往比继续改 Prompt 更有效。</p></aside>
        </section>

        <section className="prose-section" id="chapter-8">
          <div className="prose-heading"><span>08</span><div><p>THE RUNTIME IS THE SECURITY BOUNDARY</p><h2>Runtime 怎样把“模型建议”变成“受控执行”？</h2></div></div>
          <p>Tool Calling 把不确定的模型输出接到了确定性系统，因此真正的安全边界必须放在执行器。Tool 描述可以提醒模型，但不能替代代码级 Policy。</p>
          <div className="agent-architecture-board" role="img" aria-label="Tool Runtime 安全执行流水线">
            <div className="agent-arch-layer"><strong>MODEL INTENT</strong><div><article><b>Name + Arguments + Call ID</b><small>始终视为不可信候选动作</small></article></div></div>
            <div className="agent-arch-layer"><strong>VALIDATION</strong><div><article><b>Schema</b><small>类型、必填、Enum、大小</small></article><article><b>Business Rules</b><small>状态、额度、依赖和合法转移</small></article><article><b>Identity & ACL</b><small>用户、租户、资源归属与最小权限</small></article></div></div>
            <div className="agent-arch-layer"><strong>CONTROL</strong><div><article><b>Approval</b><small>高风险写操作确认</small></article><article><b>Idempotency</b><small>防止重试导致重复副作用</small></article><article><b>Budget</b><small>步数、时间、Token、费用与并发</small></article></div></div>
            <div className="agent-arch-layer"><strong>EXECUTION</strong><div><article><b>Sandbox / Network Policy</b><small>隔离文件、命令和出站访问</small></article><article><b>Timeout / Retry</b><small>只重试可重试错误并使用退避</small></article><article><b>Secrets</b><small>由 Runtime 注入，绝不交给模型保管</small></article></div></div>
            <div className="agent-arch-layer"><strong>EVIDENCE</strong><div><article><b>Typed Result</b><small>成功、失败和部分完成</small></article><article><b>External Receipt</b><small>事务 ID、版本、时间与来源</small></article><article><b>Audit Trace</b><small>谁在何时以什么参数做了什么</small></article></div></div>
          </div>
          <p>Tool Result 也不能天然信任。网页、邮件、文件和第三方 API 可能包含间接 Prompt Injection；Runtime 应把它们标记为外部数据，限制可见范围，并避免把其中的文字提升为 System Instructions。</p>
        </section>

        <section className="prose-section" id="chapter-9">
          <div className="prose-heading"><span>09</span><div><p>START WITH A REAL SYSTEM</p><h2>先不背名词：用“查询订单”理解 MCP</h2></div></div>
          <p>假设你正在使用一个客服 Agent 网页，向它提问：“订单 A123 现在能退款吗？”大模型的参数里没有你此刻的订单状态，也不能直接进入公司的订单数据库。它必须通过一条受控连接去读取真实系统。<b>MCP 规范的就是 AI 应用与这些外部能力提供方之间怎样建立连接、发现能力、发起调用并取回结果。</b></p>

          <h3>第一步：什么是“数据源”？</h3>
          <p>这里的“数据源”不是某个特殊的 AI 名词。它只是指<b>事实原本保存在哪里</b>，或者<b>真正有能力完成动作的系统在哪里</b>。凡是不在当前 Prompt 和模型参数中、需要从外部读取的内容，都可能来自一个外部数据源或业务系统。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>用户想知道或完成什么</th><th>事实或能力实际在哪里</th><th>这就是数据源 / 外部系统</th></tr></thead><tbody>
            <tr><td>订单 A123 是否已发货</td><td>订单服务保存的订单记录</td><td>Order Service / Order Database</td></tr>
            <tr><td>仓库里有哪些文件</td><td>当前电脑或服务器的文件系统</td><td>Local Filesystem</td></tr>
            <tr><td>项目有哪些未关闭 Issue</td><td>GitHub 保存的仓库与 Issue 数据</td><td>GitHub</td></tr>
            <tr><td>创建一张售后工单</td><td>客服工单系统拥有创建权限</td><td>Ticket / CRM System</td></tr>
          </tbody></table></div>
          <aside className="text-note"><b>数据源不一定是数据库</b><p>它也可以是文件、SaaS 平台、内部 API、浏览器、传感器，甚至另一段能执行计算的程序。“数据源”强调事实或能力的来源，而不是具体存储技术。</p></aside>

          <h3>第二步：把订单例子中的每个角色找出来</h3>
          <div className="agent-architecture-board" role="img" aria-label="订单 MCP 示例中的 User、Host、Client、Server 与数据源">
            <div className="agent-arch-layer"><strong>USER</strong><div><article><b>正在提问的你</b><small>只直接使用客服 Agent 网页，不需要自己操作 MCP Client</small></article></div></div>
            <div className="agent-arch-layer"><strong>MCP HOST</strong><div><article><b>客服 Agent 应用</b><small>整个网页后端或桌面应用；管理模型、对话、权限和执行循环</small></article><article><b>LLM</b><small>阅读可用 Tool Schema，提出 get_order Tool Call</small></article><article><b>Agent Runtime</b><small>鉴权、审批、状态、预算、审计和结果回传</small></article><article><b>MCP Client</b><small>Host 内专门和 Order MCP Server 说 MCP 协议的一段连接代码</small></article></div></div>
            <div className="agent-arch-layer"><strong>MCP SERVER</strong><div><article><b>Order MCP Server</b><small>发布 get_order、check_refund_policy 等 Tools，并接收标准 MCP 调用</small></article></div></div>
            <div className="agent-arch-layer"><strong>REAL SYSTEM</strong><div><article><b>Order API</b><small>订单系统原本就有的业务接口</small></article><article><b>Order Database</b><small>订单状态真正保存的位置，也是这次事实的数据源</small></article></div></div>
          </div>

          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>名词</th><th>在订单例子中是谁</th><th>它最主要的责任</th><th>最容易产生的误解</th></tr></thead><tbody>
            <tr className="highlight-row"><td>MCP Host</td><td>整个客服 Agent 应用</td><td>管理模型、用户、Clients、权限和 Agent Loop</td><td>Host 不是某台“主机”，而是使用 MCP 的 AI 应用这一协议角色</td></tr>
            <tr><td>MCP Client</td><td>Host 内的 Order MCP 连接组件</td><td>连接一个 MCP Server，发送 <code>tools/list</code>、<code>tools/call</code> 并接收结果</td><td>Client 通常不是用户，也不是 LLM，而是 Host 内的一段程序</td></tr>
            <tr><td>MCP Server</td><td>Order MCP Server 程序</td><td>把订单能力按 MCP 暴露出来，并把调用转给真实订单系统</td><td>Server 不一定保存订单，也不一定运行在远端</td></tr>
            <tr><td>数据源 / 真实系统</td><td>Order API 与 Order Database</td><td>保存权威事实，或真正执行退款</td><td>它可以位于 MCP Server 后面，二者不是同一个概念</td></tr>
            <tr><td>LLM</td><td>客服 Agent 使用的大模型</td><td>根据问题选择 <code>get_order</code> 并组织回答</td><td>LLM 通常不是 MCP Client，也不会直接连接数据库</td></tr>
          </tbody></table></div>

          <h3>第三步：一次真实查询从头到尾怎样流转？</h3>
          <div className="agent-sequence"><table><thead><tr><th></th><th>发生了什么</th><th>谁在做</th><th>此时 LLM 是否参与</th></tr></thead><tbody>
            <tr><td>01</td><td>客服 Agent 启动，为 Order MCP Server 创建一条连接</td><td className="active-cell">Host 创建 MCP Client</td><td>否</td></tr>
            <tr><td>02</td><td>双方初始化并确认协议版本、支持的能力</td><td>MCP Client ↔ MCP Server</td><td>否</td></tr>
            <tr><td>03</td><td>询问 Server 提供哪些 Tools，得到 <code>get_order</code> 的名称、描述和 Schema</td><td className="active-cell">Client 发送 <code>tools/list</code></td><td>否</td></tr>
            <tr><td>04</td><td>你输入“订单 A123 现在能退款吗？”</td><td>User → Host</td><td>还没有</td></tr>
            <tr><td>05</td><td>Host 把问题和允许使用的 Tool Schema 交给模型</td><td>Host → LLM</td><td className="active-cell">是</td></tr>
            <tr><td>06</td><td>模型返回 <code>get_order(order_id=A123)</code>，这只是调用意图</td><td className="active-cell">LLM → Host</td><td className="active-cell">是</td></tr>
            <tr><td>07</td><td>Runtime 验证用户有权查看 A123，再把调用交给连接组件</td><td>Host / Runtime → MCP Client</td><td>否</td></tr>
            <tr><td>08</td><td>Client 用 MCP 的 <code>tools/call</code> 消息请求 Order MCP Server</td><td className="active-cell">MCP Client → MCP Server</td><td>否</td></tr>
            <tr><td>09</td><td>Server 调用 Order API，Order API 从数据库读取真实状态</td><td>MCP Server → Order System</td><td>否</td></tr>
            <tr><td>10</td><td>结果沿 Server → Client → Host 返回，再由模型解释“可以/不可以退款及原因”</td><td>整条链路返回</td><td className="active-cell">最后再次参与</td></tr>
          </tbody></table></div>
          <aside className="answer-first"><span>用一句不严谨但直观的比喻</span><p><b>Host 像负责整个业务的前台；Client 像前台内部拨向某个部门的专线；MCP Server 像能按统一话术受理请求的部门窗口；数据源是窗口背后的订单档案与业务系统。</b>模型像前台的判断者：它决定要问哪个窗口，但不亲自翻数据库。</p></aside>

          <h3>第四步：MCP 到底标准化了什么？</h3>
          <p>如果没有 MCP，客服 Agent、IDE、桌面助手都可能分别为订单系统写一套私有插件：连接方式、列出能力、参数格式、错误消息各不相同。MCP 规定了一套共同语言，使 Host 可以用相似方式完成初始化、能力发现和调用。它并没有替你创建订单数据库，也没有自动授予模型退款权限。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>MCP Primitive</th><th>可以先怎样理解</th><th>订单例子</th></tr></thead><tbody>
            <tr><td>Tools</td><td>可以执行的动作或查询</td><td><code>get_order</code>、<code>propose_refund</code></td></tr>
            <tr><td>Resources</td><td>可以由应用读取的内容</td><td>退款规则文档、订单字段说明</td></tr>
            <tr><td>Prompts</td><td>可复用、带参数的提示模板</td><td>售后调查模板、退款解释模板</td></tr>
            <tr><td>Notifications</td><td>连接双方主动通知的事件</td><td>可用 Tool 列表已变化、长任务进度更新</td></tr>
          </tbody></table></div>
          <p>协议的数据层使用 JSON-RPC，负责初始化、能力协商和上述 Primitives；传输层负责消息怎样移动。本地进程常使用 STDIO，远程服务常使用 Streamable HTTP。<b>这些是实现细节；第一次理解 MCP 时，先牢牢记住 Host 内有 Client，Client 连接 Server，Server 再连接或封装真实系统。</b></p>
        </section>

        <section className="prose-section" id="chapter-10">
          <div className="prose-heading"><span>10</span><div><p>TWO INTERFACES IN ONE REQUEST</p><h2>Tool Calling 与 MCP 分别出现在订单链路的哪一段？</h2></div></div>
          <p>最容易理解的方法是把一次请求拆成两段对话。<b>第一段发生在模型与 Host 之间，使用 Tool Calling 表达“我想调用什么”；第二段发生在 Host 内的 MCP Client 与 MCP Server 之间，使用 MCP 把这个调用送到能力提供方。</b></p>
          <div className="engineering-stack">
            <article><span>TOOL CALLING</span><b>LLM → Host：我要调用 get_order，参数是 A123</b><small>模型表达调用意图；此时订单还没有被查询</small></article>
            <article><span>RUNTIME GATE</span><b>Host：校验身份、参数和 Policy，决定是否放行</b><small>把不可信模型建议变成受控动作请求</small></article>
            <article><span>MCP</span><b>MCP Client → MCP Server：tools/call(get_order, A123)</b><small>按标准协议把请求送到 Order MCP Server</small></article>
            <article><span>BACKEND</span><b>MCP Server → Order API / Database</b><small>真正读取权威状态，再把结果沿原路返回</small></article>
          </div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>问题</th><th>由哪一层回答</th></tr></thead><tbody>
            <tr><td>模型为什么选择 <code>get_order</code> 而不是直接回答？</td><td>Tool Calling 与模型推理</td></tr>
            <tr><td>模型应该生成哪些参数？</td><td>Tool Schema / Function Calling</td></tr>
            <tr><td>Host 怎样知道 Order Server 提供了哪些能力？</td><td>MCP 的能力发现，例如 <code>tools/list</code></td></tr>
            <tr><td>Host 怎样把调用发给 Order Server？</td><td>MCP Client 发送 <code>tools/call</code></td></tr>
            <tr><td>用户是否有权查看 A123？</td><td>Host Runtime 和业务系统的授权，不由 MCP 自动决定</td></tr>
            <tr><td>订单事实最终从哪里来？</td><td>Order API / Database，而不是模型或 MCP 协议本身</td></tr>
          </tbody></table></div>
          <div className="compare-columns"><article><span>WITHOUT MCP</span><h3>Tool Calling 可以独立存在</h3><ul><li>Runtime 直接调用本地 Python / TypeScript 函数</li><li>Runtime 包装内部 REST API</li><li>平台执行内置 Web Search</li><li>应用自行维护 Tool Registry</li></ul></article><article className="accent-card"><span>MCP ADDS</span><h3>MCP 提供标准连接层</h3><ul><li>初始化与能力协商</li><li>Tools、Resources、Prompts 的发现</li><li>统一的调用与结果消息</li><li>本地和远程 Transport</li></ul></article></div>
          <aside className="answer-first"><span>现在再读这一句话</span><p><b>Tool Calling 是“模型向 Host 提请求”；MCP 是“Host 通过 Client 与能力 Server 通信”。</b>因此 Tool Calling 不一定需要 MCP，MCP 也不只包含 Tools；但当模型要调用 MCP Server 暴露的 Tool 时，两者会出现在同一条执行链上。</p></aside>
        </section>

        <section className="prose-section" id="chapter-11">
          <div className="prose-heading"><span>11</span><div><p>DO NOT MIX THE ABSTRACTION LAYERS</p><h2>MCP、REST、OpenAPI 与 Agent Framework 有什么区别？</h2></div></div>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>概念</th><th>它主要解决什么</th><th>是否决定 Agent Loop</th><th>能否组合</th></tr></thead><tbody>
            <tr><td>REST API</td><td>业务服务通过 HTTP 暴露端点</td><td>否</td><td>MCP Server 可以在内部调用 REST</td></tr>
            <tr><td>OpenAPI</td><td>描述 HTTP API 的路径、参数与响应</td><td>否</td><td>可生成 Tool Schema 或 MCP Adapter</td></tr>
            <tr><td>MCP</td><td>AI Host 与能力提供方之间的发现和调用协议</td><td>否</td><td>可以包装数据库、文件系统和 REST</td></tr>
            <tr><td>Tool Calling API</td><td>模型表达要调用什么能力与哪些参数</td><td>只覆盖 Model ↔ Runtime 交互</td><td>可以调用本地、托管或 MCP Tools</td></tr>
            <tr><td>LangChain / LangGraph / Agents SDK</td><td>循环、状态、节点、Handoff、Tracing 等运行时抽象</td><td>是或部分负责</td><td>可以消费 Function Tools 和 MCP</td></tr>
          </tbody></table></div>
          <p>一个常见实现是：已有业务系统继续提供 REST；团队写一个 MCP Server 作为 AI 友好的适配层；Agent Framework 管理状态和循环；模型 API 负责产生 Tool Calls。它们位于不同层，不需要互相替代。</p>
        </section>

        <section className="prose-section" id="chapter-12">
          <div className="prose-heading"><span>12</span><div><p>INTEGRATION PATTERNS</p><h2>实际项目中常见的三种 Tool 接入架构</h2></div></div>
          <div className="agent-pattern-grid">
            <article className="agent-pattern-card"><span>PATTERN A</span><h3>本地 Function Tool</h3><div className="pattern-flow"><b>Model</b><i>→</i><b>App Runtime</b><i>→</i><b>Local Function / SDK</b></div><p>依赖少、控制强，适合少量内部能力。缺点是每个 Host 都要自行维护连接、发现和适配。</p></article>
            <article className="agent-pattern-card"><span>PATTERN B</span><h3>Provider-hosted Tool</h3><div className="pattern-flow"><b>Model API</b><i>→</i><b>Hosted Search / Code</b><i>→</i><b>Result</b></div><p>集成简单，部分 Loop 由平台处理；能力、数据边界和可移植性取决于 Provider。</p></article>
            <article className="agent-pattern-card"><span>PATTERN C</span><h3>Remote MCP Tool</h3><div className="pattern-flow"><b>Host</b><i>→</i><b>MCP Client</b><i>→</i><b>MCP Server</b><i>→</i><b>Backend</b></div><p>适合把一组能力提供给多个 AI Hosts。仍要解决认证、审批、租户隔离与 Server 信任。</p></article>
            <article className="agent-pattern-card"><span>COMMON HYBRID</span><h3>混合 Registry</h3><div className="pattern-flow"><b>Local</b><i>+</i><b>Hosted</b><i>+</i><b>MCP</b><i>→</i><b>Unified Runtime</b></div><p>生产 Agent 往往同时使用三类工具。Runtime 统一规范化事件、权限、结果和 Trace。</p></article>
          </div>
          <aside className="boundary-box"><b>不要因为 MCP 标准化了连接，就自动信任所有 Server</b><p>安装或连接 MCP Server 等同于扩大 Agent 的数据与动作面。应审核发布者、源码或服务条款、OAuth Scope、Tool 变更、数据去向和高风险操作审批策略。</p></aside>
        </section>

        <section className="prose-section" id="chapter-13">
          <div className="prose-heading"><span>13</span><div><p>OPERATIONS AND EVALUATION</p><h2>Tool 系统怎样调试、评测并安全上线？</h2></div></div>
          <p>只看最终回答无法定位 Tool 系统故障。一次 Run 至少要能还原候选 Tools、模型选择、原始参数、校验决定、执行时延、重试、原始结果、进入模型的裁剪结果以及最终引用了哪些证据。</p>
          <div className="norm-table-wrap"><table className="norm-table"><thead><tr><th>阶段</th><th>常见故障</th><th>应记录或评测什么</th></tr></thead><tbody>
            <tr><td>Selection</td><td>该调用时没调用、选错 Tool、调用过多</td><td>Tool Selection Precision / Recall、无工具基线</td></tr>
            <tr><td>Arguments</td><td>字段缺失、实体错误、模型伪造 ID</td><td>Schema Validity、Argument Accuracy、可信字段来源</td></tr>
            <tr><td>Policy</td><td>越权、跳过审批、读写混淆</td><td>ACL Denial、Approval Coverage、注入测试</td></tr>
            <tr><td>Execution</td><td>超时、重复副作用、错误重试</td><td>P50/P95、Error Taxonomy、Idempotency 命中</td></tr>
            <tr><td>Observation</td><td>结果过长、错误配对、把外部指令当规则</td><td>Call ID 对齐、Token Size、Untrusted-data 标签</td></tr>
            <tr><td>Outcome</td><td>模型声称成功但没有外部回执</td><td>Task Success、Receipt Verification、Trajectory Quality</td></tr>
          </tbody></table></div>
          <h3>上线前最小清单</h3>
          <div className="agent-checklist">
            <article><span>01</span><h3>能力面最小化</h3><p>只给当前身份和当前任务需要的 Tools；默认不暴露危险写操作。</p></article>
            <article><span>02</span><h3>读写工具分离</h3><p>查询、提案与提交拆开；高风险提交需要明确 Approval。</p></article>
            <article><span>03</span><h3>结果可核验</h3><p>成功必须来自外部状态或回执，不能来自模型自己生成的描述。</p></article>
            <article><span>04</span><h3>失败可恢复</h3><p>错误分类、超时、有限重试、幂等键、Checkpoint 与转人工路径齐全。</p></article>
            <article><span>05</span><h3>全链路 Trace</h3><p>保存 Provider 原始事件和规范化事件，并对敏感字段脱敏。</p></article>
            <article><span>06</span><h3>对抗性 Evals</h3><p>覆盖注入、越权、参数污染、重复调用、部分成功和 Server 变更。</p></article>
          </div>
        </section>

        <section className="prose-section" id="chapter-14">
          <div className="prose-heading"><span>14</span><div><p>MINIMUM IMPLEMENTATION</p><h2>不用 Agent 框架，最小 Tool Loop 长什么样？</h2></div></div>
          <p>下面是与 Provider 无关的伪代码。具体 SDK 会改变字段名，但不能省掉中间的解析、授权、执行、结果配对与循环终止。框架的价值是封装这些重复工作，不是取消这些责任。</p>
          <div className="runtime-pseudocode"><span>PROVIDER-AGNOSTIC RUNTIME LOOP</span><pre className="protocol-code"><code>{runtimeLoop}</code></pre></div>
          <div className="compare-columns"><article><span>MODEL OWNS</span><h3>模型适合负责</h3><ul><li>根据自然语言目标选择候选 Tool</li><li>从上下文抽取非敏感参数</li><li>阅读 Observation 并决定下一步</li><li>向用户解释结果或提出澄清</li></ul></article><article className="accent-card"><span>RUNTIME OWNS</span><h3>代码必须负责</h3><ul><li>身份、权限、Secrets 与业务规则</li><li>审批、幂等、事务、超时与重试</li><li>Call ID 配对、状态持久化与停止预算</li><li>真实完成回执、Trace 与审计</li></ul></article></div>
        </section>

        <section className="prose-section rms-qa" id="qa">
          <div className="prose-heading"><span>15</span><div><p>QUESTIONS AS CONNECTIONS</p><h2>关联 QA</h2></div></div>
          <div className="qa-list">
            <details id="qa-1" open><summary><span>Q1</span>Tool 是代码、API，还是给模型看的 Schema？</summary><div><p>完整 Tool 包含两部分：模型可见的 Contract（名称、描述、输入 Schema）与模型不可见的 Executor（本地代码、SDK、数据库、HTTP 或 MCP Server）。只给 Schema 不会自动产生执行能力。</p></div></details>
            <details id="qa-2"><summary><span>Q2</span>Tool Calling 和 Function Calling 是一个东西吗？</summary><div><p>口语中常被混用；严格说 Tool Calling 是总称，Function Calling 是按函数定义生成名称与参数的一类 Tool Calling。内置搜索、计算机操作和 MCP Tool 也属于更广义的 Tools。</p></div></details>
            <details id="qa-3"><summary><span>Q3</span>Function Call 现在到底有几种形式？</summary><div><p>没有跨平台固定数字。按契约与执行位置，常见有 JSON Schema Function、自由文本 Custom Tool、平台托管 Tool、MCP Tool，以及框架层 Agent-as-Tool。串行、并行和强制调用是调度模式。</p></div></details>
            <details id="qa-4"><summary><span>Q4</span>模型会亲自执行函数吗？</summary><div><p>客户端 Function Tool 不会。模型只返回结构化调用；你的 Runtime 执行。平台托管 Tool 会由 Provider 的服务端执行，但仍不是模型参数本身在访问系统。</p></div></details>
            <details id="qa-5"><summary><span>Q5</span>Tool Call 为什么必须带 Call ID？</summary><div><p>Call ID 是一次调用实例的关联键。它让 Runtime 在并行、多轮和同名重复调用中，把每个结果精确配回对应请求。</p></div></details>
            <details id="qa-6"><summary><span>Q6</span>Structured Output 和 Tool Calling 有什么区别？</summary><div><p>Structured Output 让模型交付符合 Schema 的数据；Tool Calling 让模型请求一个能力。前者可以被下游消费，但不会自动执行真实动作。</p></div></details>
            <details id="qa-7"><summary><span>Q7</span>一次响应可以调用多个 Tools 吗？</summary><div><p>可以，支持情况取决于模型与 API。Runtime 应只并行执行互不依赖且不会冲突的调用；存在数据依赖或共享写状态时要显式排序。</p></div></details>
            <details id="qa-8"><summary><span>Q8</span>tool_choice、strict 和 parallel_tool_calls 分别控制什么？</summary><div><p><code>tool_choice</code> 控制本轮是否或必须选择 Tool；<code>strict</code> 约束参数遵守 Schema；<code>parallel_tool_calls</code> 控制是否允许一次产生多个函数调用。三者都不替代业务授权。</p></div></details>
            <details id="qa-9"><summary><span>Q9</span>为什么不能相信模型生成的 Tool 参数？</summary><div><p>参数是概率模型输出，可能错误、被注入或越过用户权限。Runtime 必须重新校验 Schema、资源归属、业务状态和风险策略，可信身份字段应由服务端注入。</p></div></details>
            <details id="qa-10"><summary><span>Q10</span>Tool Result 应该返回多少内容？</summary><div><p>返回完成下一步决策所需的最小充分信息：结构化状态、关键字段、来源、时间和错误语义。巨量原文应存入 Artifact 或 Resource，并返回摘要和引用。</p></div></details>
            <details id="qa-11"><summary><span>Q11</span>MCP 是一种 Tool Calling 格式吗？</summary><div><p>不完全是。MCP 是 Host、Client、Server 间的连接协议，包含 Tools，也包含 Resources、Prompts 和 Notifications。Tool Calling 是模型提出调用意图的机制。</p></div></details>
            <details id="qa-12"><summary><span>Q12</span>有了 MCP 以后还需要 Function Calling 吗？</summary><div><p>通常需要某种模型 Tool Calling 机制来让模型选择已发现的 MCP Tool。MCP 负责能力侧的发现与调用，Function/Tool Calling 负责模型侧表达意图。</p></div></details>
            <details id="qa-13"><summary><span>Q13</span>Tool Calling 一定需要 MCP 吗？</summary><div><p>不需要。应用可以把本地函数、内部 SDK、REST Wrapper 或 Provider 托管工具直接暴露给模型。MCP 在需要标准化连接和复用能力时更有价值。</p></div></details>
            <details id="qa-14"><summary><span>Q14</span>MCP Server 一定运行在远端吗？</summary><div><p>不一定。Server 是协议角色。本地 MCP Server 常由 Host 启动并通过 STDIO 通信；远程 Server 常使用 Streamable HTTP。</p></div></details>
            <details id="qa-15"><summary><span>Q15</span>MCP 与 REST API、OpenAPI 有什么区别？</summary><div><p>REST 是服务接口风格，OpenAPI 描述 HTTP API；MCP 面向 AI Host，额外定义能力发现、协议初始化、Tools/Resources/Prompts 和消息交换。MCP Server 可以包装现有 REST API。</p></div></details>
            <details id="qa-16"><summary><span>Q16</span>MCP 是 LangChain、LangGraph 一类 Agent 框架吗？</summary><div><p>不是。MCP 不管理 Planning、State Graph、Checkpoint、Handoff 或停止条件。框架或自建 Runtime 可以作为 MCP Host，并把 MCP 能力纳入自己的 Agent Loop。</p></div></details>
            <details id="qa-17"><summary><span>Q17</span>Agent-as-Tool 与 MCP Tool 是一回事吗？</summary><div><p>不是。Agent-as-Tool 是把一个 Specialist Run 封装为上层 Agent 的能力；MCP Tool 是通过 MCP 暴露的协议能力。前者可以用普通 Function Tool 或 MCP 实现。</p></div></details>
            <details id="qa-18"><summary><span>Q18</span>怎样判断一次 Tool 执行真的成功？</summary><div><p>以外部系统的可核验状态为准：HTTP/业务状态、事务 ID、资源版本、查询回读或其他完成回执。模型生成“操作成功”只能作为表述，不能作为证据。</p></div></details>
            <details id="qa-19"><summary><span>Q19</span>这里说的数据源到底是什么？</summary><div><p>数据源就是事实真正保存或产生的地方，例如订单数据库、本地文件、GitHub、CRM、天气服务或传感器。它不是 MCP 专属概念，也不一定是数据库。MCP Server 可以在数据源前面提供统一的 AI 接口。</p></div></details>
            <details id="qa-20"><summary><span>Q20</span>MCP Client 是用户、模型，还是一段程序？</summary><div><p>通常是一段运行在 MCP Host 内部的连接代码。它代表 Host 与某一个 MCP Server 建立和维护连接。用户使用 Host；模型选择能力；Client 负责讲 MCP 协议，这三个角色不同。</p></div></details>
            <details id="qa-21"><summary><span>Q21</span>MCP Server 就是数据库或远程服务器吗？</summary><div><p>不是。MCP Server 是“提供 MCP 能力的一段程序”这一协议角色。它可以自己持有数据，也可以只是适配层，在背后调用数据库或 REST API；它既可以运行在本机，也可以部署在远端。</p></div></details>
          </div>
        </section>

        <section className="sources-section rms-sources"><div><p className="mini-label">PRIMARY REFERENCES</p><h2>官方协议与平台文档</h2></div><ol>
          <li><a href="https://developers.openai.com/api/docs/guides/function-calling" target="_blank" rel="noreferrer">OpenAI API · Function Calling</a><span>Official</span></li>
          <li><a href="https://developers.openai.com/api/docs/guides/tools" target="_blank" rel="noreferrer">OpenAI API · Using Tools</a><span>Official</span></li>
          <li><a href="https://developers.openai.com/api/docs/guides/mcp" target="_blank" rel="noreferrer">OpenAI API · MCP and Connectors</a><span>Official</span></li>
          <li><a href="https://modelcontextprotocol.io/docs/learn/architecture" target="_blank" rel="noreferrer">Model Context Protocol · Architecture</a><span>Specification</span></li>
          <li><a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works" target="_blank" rel="noreferrer">Claude Platform · How Tool Use Works</a><span>Official</span></li>
          <li><a href="https://ai.google.dev/gemini-api/docs/function-calling" target="_blank" rel="noreferrer">Gemini API · Function Calling</a><span>Official</span></li>
        </ol></section>

        <footer className="article-footer"><div><span>继续连接知识</span><strong><a className="term-link" href="/agents/agent">Agent Runtime</a> 管理 Tool Loop；<a className="term-link" href="/agents/memory">Memory</a> 决定哪些 Observation 应跨 Run 延续。</strong></div><div className="footer-links"><a href="/agents/agent">Agent 基础 ↗</a><a href="/agents/memory">Agent Memory ↗</a></div></footer>
      </main>

      <aside className="right-rail" aria-label="本页目录">
        <p>本页目录</p>
        {chapters.map(([no, label]) => <a href={no === "15" ? "#qa" : `#chapter-${Number(no)}`} key={no}><span>{no}</span>{label}</a>)}
        <RightQaIndex questions={qaQuestions} />
        <div className="reading-note"><span>15 章</span><div><i></i></div><small>工程协议 · 工具系统</small></div>
      </aside>
    </div>
  );
}
