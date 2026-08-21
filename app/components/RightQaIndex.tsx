type RightQaIndexProps = {
  questions: string[];
};

export function RightQaIndex({ questions }: RightQaIndexProps) {
  return (
    <div className="right-qa-index" aria-label="关联 QA 问题目录">
      {questions.map((question, index) => (
        <a href={`#qa-${index + 1}`} key={question}>
          <span>Q{index + 1}</span>
          <em>{question}</em>
        </a>
      ))}
    </div>
  );
}
