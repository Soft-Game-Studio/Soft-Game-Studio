import parse from "html-react-parser";
import katex from "katex";
import "katex/dist/katex.min.css";

const RenderContent = ({ content }) => {
  if (!content) return null;

  // ✅ Step 1: Convert $$...$$ → KaTeX HTML
  const processedContent = content.replace(
    /\$\$(.*?)\$\$/gs,
    (_, formula) => {
      try {
        return katex.renderToString(formula, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        return formula;
      }
    }
  );

  // ✅ Step 2: Render HTML normally
  return <div>{parse(processedContent)}</div>;
};

export default RenderContent;