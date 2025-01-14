import React from 'react';
import IssueForm from '@/components/IssueForm';
import { Octokit } from '@octokit/rest';

const NewIssuePage = ({ labels }) => {
  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/issues/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create issue');
      }

      const result = await response.json();
      console.log('Issue created:', result);

      return result.issue;
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  return <IssueForm onSubmit={handleSubmit} />;
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

    const { data: labels } = await octokit.issues.listLabelsForRepo({
      owner,
      repo,
    });

    return {
      props: {
        labels,
      },
    };
  } catch (error) {
    console.error('Error fetching labels:', error);
    return {
      props: {
        labels: [],
        error: 'Failed to fetch labels from GitHub',
      },
    };
  }
}

export default NewIssuePage;
