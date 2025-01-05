// pages/prs/[id].js
import React from 'react';
import { Octokit } from '@octokit/rest';
import dynamic from 'next/dynamic';
import '@/styles/globals.css';

const ReactDiffViewer = dynamic(() => import('react-diff-viewer'), {
  ssr: false
});

// Helper function to parse git patch into old and new content
function parsePatch(patch: string) {
  // Normalize line endings to \n
  const normalizedPatch = patch.replace(/\r\n/g, '\n');
  const lines = normalizedPatch.split('\n');
  const oldContent: string[] = [];
  const newContent: string[] = [];

  lines.forEach(line => {
    if (line.startsWith('-')) {
      oldContent.push(line.substring(1));
    } else if (line.startsWith('+')) {
      newContent.push(line.substring(1));
    } else {
      oldContent.push(line);
      newContent.push(line);
    }
  });

  return {
    oldContent: oldContent.join('\n'),
    newValue: newContent.join('\n')
  };
}

export default function PrDetails({ prNumber, prData, files, comments }) {
  if (!prData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Pull Request #{prNumber}</h1>
        <p className="text-gray-600">Not found or error fetching.</p>
      </div>
    );
  }

  const githubPrUrl = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/pull/${prNumber}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pull Request #{prData.number}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          prData.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {prData.state}
        </span>
        <a
          href={githubPrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View on GitHub →
        </a>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-700">{prData.title}</h2>
      
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <span>by {prData.user?.login}</span>
        <span>Created: {formatDate(prData.created_at)}</span>
        <span>Updated: {formatDate(prData.updated_at)}</span>
      </div>

      {prData.labels.length > 0 && (
        <div className="flex gap-2 mb-4">
          {prData.labels.map(label => (
            <span
              key={label.id}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: `#${label.color}20`,
                color: `#${label.color}`,
                border: `1px solid #${label.color}`
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="prose max-w-none mb-8">
        {prData.body}
      </div>

      {comments?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Comments</h2>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-800">{comment.user.login}</span>
                  <span className="text-sm text-gray-600">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <div className="prose max-w-none">
                  {comment.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Changed Files</h2>
        {files.map((file) => (
          <div key={file.filename} className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">{file.filename}</h3>
            {file.patch ? (
              <div className="overflow-x-auto">
                <ReactDiffViewer
                  oldValue={parsePatch(file.patch).oldContent}
                  newValue={parsePatch(file.patch).newValue}
                  splitView={true}
                  useDarkTheme={false}
                  hideLineNumbers={false}
                  extraLinesSurroundingDiff={3}
                  styles={{
                    contentText: {
                      fontSize: '0.875rem',
                      fontFamily: 'ui-monospace, monospace'
                    }
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-600">No patch info (binary or something else).</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const prNumber = parseInt(id, 10);

  if (isNaN(prNumber)) {
    return { props: { prNumber, prData: null, files: [], comments: [] } };
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const [prResponse, filesResponse, commentsResponse] = await Promise.all([
      octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      }),
      octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: prNumber,
        per_page: 100,
      }),
      octokit.issues.listComments({
        owner,
        repo,
        issue_number: prNumber,
        per_page: 100,
      })
    ]);

    return {
      props: {
        prNumber,
        prData: prResponse.data,
        files: filesResponse.data,
        comments: commentsResponse.data,
      },
    };
  } catch (error) {
    console.error('Error fetching PR details:', error);
    return {
      props: {
        prNumber,
        prData: null,
        files: [],
        comments: [],
      },
    };
  }
}
