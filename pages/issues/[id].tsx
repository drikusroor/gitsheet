import React from 'react';
import { Octokit } from '@octokit/rest';
import IssueDetails from '@/components/IssueDetails';

const IssueDetailsPage = ({ issue }) => {
  return <IssueDetails issue={issue} />;
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!owner || !repo) {
      throw new Error('GitHub configuration is missing');
    }

    const { data: issue } = await octokit.issues.get({
      owner,
      repo,
      issue_number: id,
    });

    return {
      props: {
        issue,
      },
    };
  } catch (error) {
    console.error('Error fetching issue details:', error);
    return {
      props: {
        issue: null,
        error: 'Failed to fetch issue details from GitHub',
      },
    };
  }
}

export default IssueDetailsPage;
