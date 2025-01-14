import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MarkdownInput from './MarkdownInput';

type Issue = {
  title: string;
  body: string;
  labels: { name: string }[];
  number: number;
}

interface IssueFormProps {
  issue?: Issue;
  onSubmit: (data: { title: string; body: string; labels: string[] }) => Promise<Issue>;
}

const IssueForm: React.FC<IssueFormProps> = ({ issue, onSubmit }) => {
  const [title, setTitle] = useState(issue?.title || '');
  const [body, setBody] = useState(issue?.body || '');
  const [labels, setLabels] = useState(issue?.labels.map(label => label.name).join(', ') || '');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const labelsArray = labels ? labels.split(',').map(label => label.trim()) : [];
    const updatedIssue = await onSubmit({ title, body, labels: labelsArray });
    const issueNumber = updatedIssue ? updatedIssue.number : issue ? issue.number : '';
    router.push(`/issues/${issueNumber}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Body</label>
        <MarkdownInput
          value={body}
          onChange={setBody}
          absolute={true}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Labels</label>
        <input
          type="text"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <p className="mt-2 text-sm text-gray-500">Separate labels with commas</p>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default IssueForm;
