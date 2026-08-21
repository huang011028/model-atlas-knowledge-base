import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Qwen knowledge document", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Qwen 系列模型的演进 \| 模见<\/title>/i);
  assert.match(html, /Qwen3-Next/);
  assert.match(html, /Gated DeltaNet/);
  assert.match(html, /64 个小 Experts/);
  assert.match(html, /4 SHARED/);
  assert.match(html, /60 ROUTED · TOP-4/);
  assert.match(html, /Long-CoT Cold Start/);
  assert.match(html, /qk-norm-latex/);
  assert.match(html, /什么是 Pre-Norm/);
  assert.match(html, /什么是输出分类矩阵/);
  assert.match(html, /Output Projection/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.ok((html.match(/href="\/activations\/swiglu"/g) ?? []).length >= 3);
  assert.ok((html.match(/href="\/attention\/gqa"/g) ?? []).length >= 8);
  assert.ok((html.match(/href="\/attention\/qkv-bias"/g) ?? []).length >= 6);
  assert.ok((html.match(/href="\/attention\/qk-norm"/g) ?? []).length >= 5);
  assert.ok((html.match(/href="\/training\/long-cot-cold-start"/g) ?? []).length >= 2);
  assert.ok((html.match(/href="\/training\/reasoning-rl"/g) ?? []).length >= 2);
  assert.match(html, /href="\/training\/rlhf"/);
  assert.match(html, /href="\/training\/ppo"/);
  assert.match(html, /href="\/training\/dpo"/);
  assert.match(html, /href="\/training\/kto"/);
  assert.match(html, /href="\/training\/grpo"/);
  assert.ok((html.match(/href="\/architecture\/decoder-only"/g) ?? []).length >= 5);
  assert.ok((html.match(/href="\/position-encoding\/rope"/g) ?? []).length >= 6);
  assert.ok((html.match(/href="\/position-encoding\/dual-chunk-attention"/g) ?? []).length >= 3);
  assert.ok((html.match(/href="\/ffn\/moe"/g) ?? []).length >= 20);
  assert.match(html, /href="\/foundations\/tensor-notation"/);
  assert.match(html, /关联 QA/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-8"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("server-renders the vector and tensor notation standard", async () => {
  const response = await render("/foundations/tensor-notation");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>向量、矩阵与 Token 轴记号规范 \| 模见<\/title>/i);
  assert.match(html, /本知识库以后统一采用什么约定/);
  assert.match(html, /一个单独出现的向量默认是什么方向/);
  assert.match(html, /输入矩阵 X 中，一个 token 是一行还是一列/);
  assert.match(html, /列向量公式与行存储公式为什么不冲突/);
  assert.match(html, /QKᵀ 与 qᵢᵀkⱼ 怎样同时成立/);
  assert.match(html, /nn\.Linear 的 weight 形状为什么和文档里的 W 相反/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-8"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /00 · 数学与记号规范/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the Long-CoT Cold Start document", async () => {
  const response = await render("/training/long-cot-cold-start");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 Long-CoT Cold Start？ \| 模见<\/title>/i);
  assert.match(html, /Long、CoT、Cold Start 分别指什么/);
  assert.match(html, /冷启动位于 Qwen3 后训练的哪一步/);
  assert.match(html, /一条高质量冷启动样本包含什么/);
  assert.match(html, /为什么不能随便找一批问题生成长答案/);
  assert.match(html, /Long-CoT 轨迹怎样从候选变成训练数据/);
  assert.match(html, /冷启动训练时，模型到底在优化什么/);
  assert.match(html, /既然纯 RL 可能涌现推理/);
  assert.match(html, /它与普通 SFT、蒸馏、预训练和/);
  assert.ok((html.match(/href="\/training\/reasoning-rl"/g) ?? []).length >= 12);
  assert.match(html, /为什么冷启动数据不能越多越好/);
  assert.match(html, /Pass@/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-10"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /02 · 训练与对齐/);
  assert.match(html, /class="selected" href="\/training\/long-cot-cold-start"/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the formula-first RMSNorm document", async () => {
  const response = await render("/normalization/rmsnorm");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 RMSNorm？ \| 模见<\/title>/i);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.ok((html.match(/latex-inline/g) ?? []).length >= 20);
  assert.match(html, /operatorname/);
  assert.match(html, /RMSNorm 在 Transformer 里放在哪里/);
  assert.match(html, /Qwen3 对 Q\/K heads 的归一化/);
  assert.ok((html.match(/href="\/attention\/qk-norm"/g) ?? []).length >= 3);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-5"/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the LLM-specific Reasoning RL document", async () => {
  const response = await render("/training/reasoning-rl");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 Reasoning RL？ \| 模见<\/title>/i);
  assert.match(html, /State、Action、Episode 在语言模型里是什么/);
  assert.match(html, /训练集为什么常是“问题 \+ Verifier”/);
  assert.match(html, /一次 LLM Reasoning RL 迭代具体发生什么/);
  assert.match(html, /Verifier 如何把一整段文本变成 Reward/);
  assert.match(html, /为什么要比较同一道题的多条回答/);
  assert.match(html, /只有最终 Reward，模型怎样更新前面的每一个 Token/);
  assert.match(html, /On-policy、Off-policy 在 LLM Rollouts 中意味着什么/);
  assert.match(html, /持续监控熵和回答长度/);
  assert.match(html, /Reasoning RL 最终改变了模型什么/);
  assert.match(html, /3,995/);
  assert.match(html, /170 个 RL steps/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-10"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /02 · 训练与对齐/);
  assert.match(html, /class="selected" href="\/training\/reasoning-rl"/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the RLHF document", async () => {
  const response = await render("/training/rlhf");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>什么是 RLHF？ \| 模见<\/title>/i);
  assert.match(html, /为什么“会续写”不等于“会帮助用户”/);
  assert.match(html, /RLHF 包含哪三个阶段/);
  assert.match(html, /Reward Model 怎样从比较中学习/);
  assert.match(html, /为什么不能只最大化 Reward Model 分数/);
  assert.match(html, /经典在线 RLHF 训练时同时有哪些模型/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-9"/);
  assert.match(html, /偏好概率为什么会变成带负号和/);
  assert.match(html, /Negative log-likelihood/);
  assert.match(html, /General binary cross-entropy/);
  assert.match(html, /class="selected" href="\/training\/rlhf"/);
  assert.ok((html.match(/href="\/training\/ppo"/g) ?? []).length >= 4);
  assert.ok((html.match(/href="\/training\/dpo"/g) ?? []).length >= 4);
  assert.doesNotMatch(html, /\\mbox|\/og\.png/);
});

test("server-renders the PPO document", async () => {
  const response = await render("/training/ppo");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>什么是 PPO？ \| 模见<\/title>/i);
  assert.match(html, /策略梯度为什么自然地出现了 Log Probability/);
  assert.match(html, /逐 Token Shaped Reward 是怎样从序列目标推出来的/);
  assert.match(html, /Return 公式究竟在累计什么/);
  assert.match(html, /GAE 为什么是 TD Error 的加权和/);
  assert.match(html, /PPO 的 Clip Objective 究竟在限制什么/);
  assert.match(html, /一轮完整的 LLM PPO 训练怎样运行/);
  assert.match(html, /GAE 不是奖励函数/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-12"/);
  assert.match(html, /class="selected" href="\/training\/ppo"/);
  assert.doesNotMatch(html, /\\mbox|katex-error|\/og\.png/);
});

test("server-renders the DPO document", async () => {
  const response = await render("/training/dpo");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>什么是 DPO？ \| 模见<\/title>/i);
  assert.match(html, /怎样把显式 Reward Model 消去/);
  assert.match(html, /DPO 最终优化的公式是什么/);
  assert.match(html, /一对样本怎样推动模型参数/);
  assert.match(html, /DPO 训练架构为什么更简单/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-8"/);
  assert.match(html, /class="selected" href="\/training\/dpo"/);
  assert.doesNotMatch(html, /\\mbox|\/og\.png/);
});

test("server-renders the KTO document", async () => {
  const response = await render("/training/kto");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>什么是 KTO？ \| 模见<\/title>/i);
  assert.match(html, /为什么大模型对齐需要不成对的二元反馈/);
  assert.match(html, /为什么它叫 Kahneman–Tversky Optimization/);
  assert.match(html, /没有 Reward Model，KTO 的 Reward 从哪里来/);
  assert.match(html, /为什么不能直接用零作为好坏分界线/);
  assert.match(html, /KTO 的价值函数与最终损失是什么/);
  assert.match(html, /一次 KTO 训练迭代具体发生什么/);
  assert.match(html, /KTO 与 DPO、RLHF、Reasoning RL 有什么关系/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-10"/);
  assert.match(html, /class="selected" href="\/training\/kto"/);
  assert.doesNotMatch(html, /\\mbox|\/og\.png/);
});

test("server-renders the GRPO document", async () => {
  const response = await render("/training/grpo");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>什么是 GRPO？ \| 模见<\/title>/i);
  assert.match(html, /Reasoning RL 中 Critic 为什么尤其困难/);
  assert.match(html, /组内 Reward 怎样变成 Advantage/);
  assert.match(html, /GRPO 的策略目标与/);
  assert.match(html, /一轮 GRPO 训练具体发生什么/);
  assert.match(html, /DAPO/);
  assert.match(html, /GSPO/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-9"/);
  assert.match(html, /class="selected" href="\/training\/grpo"/);
  assert.doesNotMatch(html, /\\mbox|\/og\.png/);
});

test("server-renders the formula-first SwiGLU document", async () => {
  const response = await render("/activations/swiglu");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 SwiGLU？ \| 模见<\/title>/i);
  assert.match(html, /SwiGLU 不只是一个激活函数/);
  assert.match(html, /8d\/3|frac/);
  assert.match(html, /class="katex"/);
  assert.match(html, /为什么它成为现代 Decoder LLM 的常见选择/);
  assert.match(html, /aria-controls=.*函数图像|函数图像.*aria-controls=/);
  assert.match(html, /关联 QA/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-6"/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the formula-first GQA document", async () => {
  const response = await render("/attention/gqa");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 GQA？ \| 模见<\/title>/i);
  assert.match(html, /GQA 改变的是哪一部分/);
  assert.match(html, /MHA、MQA 与 GQA/);
  assert.match(html, /KV Cache 如何减少/);
  assert.match(html, /class="katex"/);
  assert.match(html, /head-sharing-map/);
  assert.match(html, /关联 QA/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-6"/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the QKV Bias document", async () => {
  const response = await render("/attention/qkv-bias");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 QKV Bias？ \| 模见<\/title>/i);
  assert.match(html, /Bias 具体加在 Attention 的哪一步/);
  assert.match(html, /Query Bias 如何改变 Attention score/);
  assert.match(html, /Key Bias 在简化 Attention 中可能被抵消/);
  assert.match(html, /Value Bias 如何进入 Attention 输出/);
  assert.match(html, /Softmax 的平移不变性/);
  assert.match(html, /RoPE、/);
  assert.match(html, /会怎样改变 Bias 的效果/);
  assert.ok((html.match(/href="\/attention\/qk-norm"/g) ?? []).length >= 12);
  assert.match(html, /QKV Bias 不等于 Attention Bias/);
  assert.match(html, /Qwen2 \/ Qwen2\.5/);
  assert.match(html, /Qwen3：移除 QKV Bias/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-9"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /06 · 注意力机制与 KV Cache/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the Decoder-only architecture document", async () => {
  const response = await render("/architecture/decoder-only");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 Decoder-only？ \| 模见<\/title>/i);
  assert.match(html, /“只有 Decoder”到底删掉了什么/);
  assert.match(html, /Causal Mask 如何防止/);
  assert.match(html, /自回归概率分解/);
  assert.match(html, /训练能并行，生成却必须串行/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-7"/);
  assert.match(html, /href="#qa-8"/);
  assert.match(html, /设为负无穷后，如何参与计算/);
  assert.match(html, /0\.731/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the formula-first QK-Norm document", async () => {
  const response = await render("/attention/qk-norm");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 QK-Norm？ \| 模见<\/title>/i);
  assert.match(html, /Attention 已经缩放，为什么 logits 仍可能变得很大/);
  assert.match(html, /QK-Norm 加在 Attention 的哪一步/);
  assert.match(html, /对每个 Head 分别归一化/);
  assert.match(html, /归一化后，Attention logits 为什么更稳定/);
  assert.match(html, /为什么 Query 与 Key 要分别归一化/);
  assert.match(html, /QK-Norm 与 RoPE 谁先谁后/);
  assert.match(html, /与缩放因子、温度和 Softmax 有什么区别/);
  assert.match(html, /Qwen3 为什么同时移除 QKV Bias/);
  assert.match(html, /这里的 S 不是新增步骤/);
  assert.match(html, /普通 Decoder Attention 与 QK-Norm Attention 的唯一区别/);
  assert.match(html, /是 QK-Norm 新增的步骤吗/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-10"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /06 · 注意力机制与 KV Cache/);
  assert.match(html, /class="selected" href="\/attention\/qk-norm"/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the formula-first RoPE document", async () => {
  const response = await render("/position-encoding/rope");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 RoPE？ \| 模见<\/title>/i);
  assert.match(html, /Self-Attention 为什么必须补充位置信息/);
  assert.match(html, /为什么旋转后，Attention 会感知相对位置/);
  assert.match(html, /R\(\(n-m\)/);
  assert.match(html, /公式能算到任意位置，为什么还需要 YaRN/);
  assert.match(html, /KV Cache 中保存的是旋转前还是旋转后的 Key/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-9"/);
  assert.match(html, /只是第.*个位置，为什么可以乘旋转矩阵/);
  assert.match(html, /分块对角矩阵/);
  assert.match(html, /07 · 位置编码与上下文/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the Dual Chunk Attention document", async () => {
  const response = await render("/position-encoding/dual-chunk-attention");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 Dual Chunk Attention？ \| 模见<\/title>/i);
  assert.match(html, /你的两个理解中，哪一个更接近 DCA/);
  assert.match(html, /谈 maxlen 之前，先把四种长度分开/);
  assert.match(html, /既然目标是 1M，为什么不直接训练 1M/);
  assert.match(html, /超过训练长度后，RoPE 的哪一部分出了问题/);
  assert.match(html, /先用 18 个 token 看完整流程/);
  assert.match(html, /更早 Chunks 仍可访问，但距离被压缩/);
  assert.match(html, /为什么相邻前一块不能直接当作远端块/);
  assert.match(html, /三条路径最终如何组成一次 Attention/);
  assert.match(html, /Qwen2\.5-1M/);
  assert.match(html, /256.*训练.*DCA 外推到/);
  assert.match(html, /Chunked Prefill/);
  assert.match(html, /Sliding Window Attention/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-11"/);
  assert.match(html, /href="#qa"[^>]*><span>12<\/span>关联 QA/);
  assert.match(html, /12 章/);
  assert.match(html, /07 · 位置编码与上下文/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("server-renders the formula-first MoE document", async () => {
  const response = await render("/ffn/moe");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>什么是 MoE？ \| 模见<\/title>/i);
  assert.match(html, /MoE 替换了 Transformer 的哪一部分/);
  assert.match(html, /Router 如何为每个 token 选择 Experts/);
  assert.match(html, /Top-k 选择与归一化/);
  assert.match(html, /总参数与激活参数为什么必须分开看/);
  assert.match(html, /Expert Collapse/);
  assert.match(html, /Shared \+ Routed Experts/);
  assert.match(html, /Qwen1\.5-MoE/);
  assert.match(html, /\\text\{All-to-All\}/);
  assert.doesNotMatch(html, /All\\!\\!-/);
  assert.match(html, /class="katex"/);
  assert.match(html, /class="katex-mathml"/);
  assert.match(html, /class="right-qa-index"/);
  assert.match(html, /href="#qa-10"/);
  assert.match(html, /逐 token 路由后恢复原序列位置/);
  assert.match(html, /按 Expert 临时分组/);
  assert.match(html, /SFT 后某个 token 换了 Expert/);
  assert.match(html, /routing drift/);
  assert.match(html, /路由遗忘/);
  assert.match(html, /<strong>路由遗忘：<\/strong>/);
  assert.match(html, /<strong>参数干扰：<\/strong>/);
  assert.match(html, /href="#chapter-9"/);
  assert.match(html, /href="#qa"[^>]*><span>10<\/span>关联 QA/);
  assert.match(html, /10 章/);
  assert.match(html, /05 · 激活函数与前馈网络/);
  assert.doesNotMatch(html, /\\mbox/);
  assert.doesNotMatch(html, /\/og\.png/);
});

test("keeps the repository portable and its sharing assets present", async () => {
  const [page, layout, globalStyles, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    access(new URL("public/og.png", root)),
    access(new URL("public/favicon.png", root)),
  ]);

  assert.match(page, /Qwen 系列模型的演进/);
  assert.match(page, /href="\/normalization\/rmsnorm"/);
  assert.match(page, /href="\/attention\/gqa"/);
  assert.match(page, /href="\/attention\/qkv-bias"/);
  assert.match(page, /href="\/attention\/qk-norm"/);
  assert.match(page, /href="\/training\/long-cot-cold-start"/);
  assert.match(page, /href="\/training\/reasoning-rl"/);
  assert.match(page, /href="\/architecture\/decoder-only"/);
  assert.match(page, /href="\/position-encoding\/rope"/);
  assert.match(page, /href="\/position-encoding\/dual-chunk-attention"/);
  assert.match(page, /href="\/ffn\/moe"/);
  assert.match(page, /href="\/foundations\/tensor-notation"/);
  assert.match(layout, /zh-CN/);
  assert.match(globalStyles, /--latex-text: "KaTeX_Main"/);
  assert.match(globalStyles, /body \{[^}]*font-family: var\(--latex-text\)/);
  assert.match(globalStyles, /\.article \{[^}]*margin-left: max\(278px, calc\(50vw - 390px\)\)/);
  assert.match(globalStyles, /\.rms-article \{[^}]*margin-left: max\(278px, calc\(50vw - 375px\)\)/);
  assert.match(packageJson, /"dev": "vinext dev --host 127\.0\.0\.1 --port 3000"/);
  assert.match(packageJson, /"dev:lan": "vinext dev --host 0\.0\.0\.0 --port 3000"/);
});
