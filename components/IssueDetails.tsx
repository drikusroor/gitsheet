import React from 'react';
import { RenderMarkdown } from './RenderMarkdown';

interface IssueDetailsProps {
  issue: {
    title: string;
    number: number;
    body: string;
    labels: { name: string }[];
  };
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ issue }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{issue.title}</h1>
      <div className="text-gray-600 mb-4">Issue #{issue.number}</div>
      <div className="mb-4">
        {issue.labels.map((label) => (
          <span key={label.name} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
            {label.name}
          </span>
        ))}
      </div>
      <RenderMarkdown content={issue.body} />
    </div>
  );
};

export default IssueDetails;
