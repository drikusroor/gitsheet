import React from 'react';
import Link from 'next/link';

interface Issue {
  number: number;
  title: string;
}

interface IssueListProps {
  issues: Issue[];
}

const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Issues</h1>
      {issues.length === 0 && <p className="text-gray-600">No issues found.</p>}

      <ul className="space-y-4">
        {issues.map((issue) => (
          <li key={issue.number} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <Link href={`/issues/${issue.number}`} className="block">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 font-mono">#{issue.number}</span>
                <span className="font-medium text-gray-800">{issue.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;
