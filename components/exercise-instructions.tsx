import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Markdown du support : aucun HTML brut ni URL de script n’est exécuté. */
export function ExerciseInstructions({
  content,
  contextLabel = "Contexte et prérequis du labo",
}: {
  content: string;
  contextLabel?: string;
}) {
  const match = content.match(
    /^## (?:Réalisation dans Thor|Projet final dans Thor)\s*\n([\s\S]*?)(?=^#{1,2} |$(?![\s\S]))/m,
  );
  const context = match?.[1]?.trim();
  const instructions = match
    ? (
        content.slice(0, match.index) +
        content.slice((match.index ?? 0) + match[0].length)
      ).trimStart()
    : content;
  return (
    <div className="instruction-content">
      {context && (
        <details
          className="exercise-lab-context"
          data-testid="exercise-lab-context"
        >
          <summary>{contextLabel}</summary>
          <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
            {context}
          </ReactMarkdown>
        </details>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {instructions}
      </ReactMarkdown>
    </div>
  );
}
