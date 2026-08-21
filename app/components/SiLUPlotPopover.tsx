"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Formula } from "./Formula";

function drawSiLU(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(280, rect.width);
  const height = Math.max(180, rect.height);

  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  const context = canvas.getContext("2d");
  if (!context) return;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const padding = { left: 38, right: 14, top: 15, bottom: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const xMin = -5;
  const xMax = 5;
  const yMin = -0.6;
  const yMax = 5;
  const xToCanvas = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const yToCanvas = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotHeight;

  context.font = '10px "KaTeX_Main", serif';
  context.textAlign = "center";
  context.textBaseline = "top";
  context.strokeStyle = "#dedbd2";
  context.fillStyle = "#8b887f";
  context.lineWidth = 1;

  for (const x of [-4, -2, 0, 2, 4]) {
    const px = xToCanvas(x);
    context.beginPath();
    context.moveTo(px, padding.top);
    context.lineTo(px, padding.top + plotHeight);
    context.stroke();
    context.fillText(String(x), px, padding.top + plotHeight + 7);
  }

  context.textAlign = "right";
  context.textBaseline = "middle";
  for (const y of [0, 1, 2, 3, 4]) {
    const py = yToCanvas(y);
    context.beginPath();
    context.moveTo(padding.left, py);
    context.lineTo(padding.left + plotWidth, py);
    context.stroke();
    context.fillText(String(y), padding.left - 7, py);
  }

  context.strokeStyle = "#858178";
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(padding.left, yToCanvas(0));
  context.lineTo(padding.left + plotWidth, yToCanvas(0));
  context.moveTo(xToCanvas(0), padding.top);
  context.lineTo(xToCanvas(0), padding.top + plotHeight);
  context.stroke();

  context.strokeStyle = "#e84c26";
  context.lineWidth = 2.4;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.beginPath();

  for (let index = 0; index <= 320; index += 1) {
    const x = xMin + (index / 320) * (xMax - xMin);
    const y = x / (1 + Math.exp(-x));
    const px = xToCanvas(x);
    const py = yToCanvas(y);
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }

  context.stroke();

  const minimumX = -1.278;
  const minimumY = minimumX / (1 + Math.exp(-minimumX));
  context.fillStyle = "#e84c26";
  context.beginPath();
  context.arc(xToCanvas(minimumX), yToCanvas(minimumY), 3.2, 0, Math.PI * 2);
  context.fill();
}

export function SiLUPlotPopover() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    drawSiLU(canvas);
    const observer = new ResizeObserver(() => drawSiLU(canvas));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <span className="silu-plot-control" ref={rootRef}>
      <button
        className="silu-plot-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">⌁</span> 函数图像
      </button>
      {open ? (
        <span className="silu-plot-popover" id={dialogId} role="dialog" aria-label="SiLU 函数图像">
          <span className="silu-plot-head">
            <span><b>SiLU / Swish</b><small>平滑、自门控、非单调</small></span>
            <button type="button" aria-label="关闭 SiLU 函数图像" onClick={() => setOpen(false)}>×</button>
          </span>
          <Formula inline tex={String.raw`f(x)=x\,\sigma(x)=\dfrac{x}{1+e^{-x}}`} />
          <canvas ref={canvasRef} className="silu-plot-canvas" aria-label="SiLU 函数在负五到正五区间的曲线">
            SiLU 函数图像：f(x)=x/(1+e^-x)
          </canvas>
          <span className="silu-plot-note"><i></i>橙色曲线为 SiLU；圆点标记其约在 <Formula inline tex={String.raw`x=-1.278`} /> 处的最低点。</span>
        </span>
      ) : null}
    </span>
  );
}
