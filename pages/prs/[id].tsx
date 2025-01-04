// pages/prs/[id].js
import React from 'react';
import { Octokit } from '@octokit/rest';
import '@/styles/globals.css';

export default function PrDetails({ prNumber, prData, files }) {
  if (!prData) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Pull Request #{prNumber}</h1>
        <p className="text-gray-600">Not found or error fetching.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Pull Request #{prData.number}</h1>
      <h2 className="text-xl font-semibold mb-2 text-gray-700">{prData.title}</h2>
      <p className="text-gray-600 mb-4">by {prData.user?.login}</p>
      <p className="text-gray-800 mb-8">{prData.body}</p>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Changed Files</h2>
        {files.map((file) => (
          <div key={file.filename} className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">{file.filename}</h3>
            {file.patch ? (
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                {file.patch}
              </pre>
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
    return { props: { prNumber, prData: null, files: [] } };
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // 1. Fetch the PR info
    const { data: prData } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    // 2. Fetch the files changed in this PR
    const { data: fileList } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100, // if many files changed, you may need pagination
    });

    return {
      props: {
        prNumber,
        prData,
        files: fileList,
      },
    };
  } catch (error) {
    console.error('Error fetching PR details:', error);
    return {
      props: {
        prNumber,
        prData: null,
        files: [],
      },
    };
  }
}
