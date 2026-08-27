type TrainingSidebarProps = {
  selected: "importance-sampling" | "reward-model" | "rlhf" | "ppo" | "dpo" | "kto" | "grpo" | "agent" | "memory" | "tools";
};

const rlLinks = [
  ["rlhf", "/training/rlhf", "RLHF"],
  ["ppo", "/training/ppo", "PPO"],
  ["dpo", "/training/dpo", "DPO"],
  ["kto", "/training/kto", "KTO"],
  ["grpo", "/training/grpo", "GRPO"],
] as const;

export function TrainingSidebar({ selected }: TrainingSidebarProps) {
  return (
    <aside className="left-rail" aria-label="知识库目录">
      <p className="rail-kicker">知识库</p>
      <a className="rail-home" href="/"><span>◇</span> 大模型时代</a>
      <div className="rail-group"><p>00 · 数学与记号规范</p><a href="/foundations/tensor-notation">向量、矩阵与 Token 轴</a><span className="rail-subhead">概率、采样与估计</span><a className={selected === "importance-sampling" ? "selected" : undefined} href="/foundations/importance-sampling">Importance Sampling</a></div>
      <div className="rail-group"><p>01 · 模型与架构</p><a href="/">Qwen 系列演进</a><a href="/architecture/decoder-only">Decoder-only Transformer</a><a className="locked" href="#">DeepSeek 系列演进 <em>待更新</em></a><a className="locked" href="#">Llama 系列演进 <em>待更新</em></a></div>
      <div className="rail-group">
        <p>02 · 训练与对齐</p>
        <span className="rail-subhead">推理后训练</span>
        <a href="/training/long-cot-cold-start">Long-CoT Cold Start</a>
        <a href="/training/reasoning-rl">Reasoning RL</a>
        <span className="rail-subhead">反馈与奖励</span>
        <a className={selected === "reward-model" ? "selected" : undefined} href="/training/reward-model">Reward Model</a>
        <span className="rail-subhead">RL 与偏好优化</span>
        {rlLinks.map(([key, href, label]) => <a className={selected === key ? "selected" : undefined} href={href} key={key}>{label}</a>)}
        <span>Pre-training · 待更新</span>
      </div>
      <div className="rail-group"><p>03 · Agent 与应用</p><a className={selected === "agent" ? "selected" : undefined} href="/agents/agent">Agent 基础</a><a className={selected === "memory" ? "selected" : undefined} href="/agents/memory">Memory</a><a className={selected === "tools" ? "selected" : undefined} href="/agents/tools">Tools</a></div>
      <div className="rail-group"><p>04 · 标准化与归一化</p><a href="/normalization/rmsnorm">RMSNorm</a></div>
      <div className="rail-group"><p>05 · 激活函数与前馈网络</p><a href="/activations/swiglu">SwiGLU</a><a href="/ffn/moe">MoE</a></div>
      <div className="rail-group"><p>06 · 注意力机制与 KV Cache</p><a href="/attention/gqa">GQA</a><a href="/attention/qkv-bias">QKV Bias</a><a href="/attention/qk-norm">QK-Norm</a></div>
      <div className="rail-group"><p>07 · 位置编码与上下文</p><a href="/position-encoding/rope">RoPE</a><a href="/position-encoding/dual-chunk-attention">Dual Chunk Attention</a></div>
    </aside>
  );
}
