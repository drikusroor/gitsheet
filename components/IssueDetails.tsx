import React from 'react';
import { RenderMarkdown } from './RenderMarkdown';

interface IssueDetailsProps {
  issue: {
    title: string;
    number: number;
    body: string;
  };
}

const IssueDetails: React.FC<IssueDetailsProps> = ({ issue }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{issue.title}</h1>
      <div className="text-gray-600 mb-4">Issue #{issue.number}</div>
      <RenderMarkdown content={issue.body} />
    </div>
  );
};

export default IssueDetails;
