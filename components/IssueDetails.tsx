import React from 'react';
import { RenderMarkdown } from './RenderMarkdown';
import Link from 'next/link';

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
      <Link href={`/issues/${issue.number}/edit`}>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Edit Issue
        </button>
      </Link>
    </div>
  );
};

export default IssueDetails;
