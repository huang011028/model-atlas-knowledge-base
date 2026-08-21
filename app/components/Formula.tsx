import katex from "katex";
import type { ReactNode } from "react";

type FormulaProps = {
  tex: string;
  label?: ReactNode;
  className?: string;
  inline?: boolean;
};

export function Formula({ tex, label, className = "", inline = false }: FormulaProps) {
  const html = katex.renderToString(tex, {
    displayMode: !inline,
    throwOnError: true,
    output: "htmlAndMathml",
    strict: "warn",
  });

  if (inline) {
    return <span className={`latex-inline ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <div className={`latex-formula ${className}`}>
      {label ? <span className="math-label">{label}</span> : null}
      <div className="latex-scroll" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
