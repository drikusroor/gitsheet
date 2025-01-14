import React from 'react';
import IssueList from '@/components/IssueList';
import { Octokit } from '@octokit/rest';

const IssuesPage = ({ issues }) => {
  return <IssueList issues={issues} />;
};

export async function getServerSideProps() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!owner || !repo) {
      throw new Error('GitHub configuration is missing');
    }

    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: 'open',
    });

    return {
      props: {
        issues,
      },
    };
  } catch (error) {
    console.error('Error fetching issues:', error);
    return {
      props: {
        issues: [],
        error: 'Failed to fetch issues from GitHub',
      },
    };
  }
}

export default IssuesPage;
