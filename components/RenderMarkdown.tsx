import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownComponents = {
  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
  pre: ({ node, ...props }) => <pre className="bg-gray-100 rounded-lg p-4 mb-4 overflow-x-auto" {...props} />,
  code: ({ node, inline, ...props }) => 
    inline ? <code className="bg-gray-100 rounded px-1 py-0.5" {...props} /> : <code {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic" {...props} />,
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 my-4" {...props} />
    </div>
  ),
  td: ({ node, ...props }) => <td className="px-4 py-2 border" {...props} />,
  th: ({ node, ...props }) => <th className="px-4 py-2 border font-bold" {...props} />,
};

interface RenderMarkdownProps {
  content: string;
  className?: string;
}

export function RenderMarkdown({ content, className = '' }: RenderMarkdownProps) {
  // Replace single newlines with double newlines for proper paragraph breaks
  const formattedContent = content?.replace(/(?<!\n)\n(?!\n)/g, '\n\n') || '';

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
}
