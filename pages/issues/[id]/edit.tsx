import React from 'react';
import IssueForm from '@/components/IssueForm';
import { Octokit } from '@octokit/rest';

const EditIssuePage = ({ issue }) => {
  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`/api/issues/${issue.number}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update issue');
      }

      const result = await response.json();
      console.log('Issue updated:', result);

      return result.issue;
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  return <IssueForm issue={issue} onSubmit={handleSubmit} />;
};

export async function getServerSideProps(context) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const issueNumber = context.params.id;

    if (!owner || !repo) {
      throw new Error('GitHub configuration is missing');
    }

    const { data: issue } = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    return {
      props: {
        issue,
      },
    };
  } catch (error) {
    console.error('Error fetching issue:', error);
    return {
      props: {
        issue: null,
        error: 'Failed to fetch issue from GitHub',
      },
    };
  }
}

export default EditIssuePage;
