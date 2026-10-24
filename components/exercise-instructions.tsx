import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Markdown du support : aucun HTML brut ni URL de script n’est exécuté. */
export function ExerciseInstructions({ content }: { content: string }) {
  return (
    <div className="instruction-content">
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
