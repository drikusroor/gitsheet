// pages/prs/[id].js
import React from 'react';
import { Octokit } from '@octokit/rest';

export default function PrDetails({ prNumber, prData, files }) {
  if (!prData) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Pull Request #{prNumber}</h1>
        <p>Not found or error fetching.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pull Request #{prData.number}</h1>
      <h2>{prData.title}</h2>
      <p>by {prData.user?.login}</p>
      <p>{prData.body}</p>

      <hr />
      <h2>Changed Files</h2>
      {files.map((file) => (
        <div key={file.filename} style={{ marginBottom: '2rem' }}>
          <h3>{file.filename}</h3>
          {file.patch ? (
            <pre
              style={{
                background: '#f4f4f4',
                padding: '1rem',
                overflowX: 'auto',
              }}
            >
              {file.patch}
            </pre>
          ) : (
            <p>No patch info (binary or something else).</p>
          )}
        </div>
      ))}
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
