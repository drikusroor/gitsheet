// pages/prs/index.js
import React from 'react';
import { Octokit } from '@octokit/rest';

export default function PrList({ openPRs }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Open Pull Requests</h1>
      {openPRs.length === 0 && <p>No open PRs found.</p>}

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {openPRs.map((pr) => (
          <li key={pr.number} style={{ margin: '1rem 0' }}>
            <a href={`/prs/${pr.number}`}>
              <strong>#{pr.number}</strong> {pr.title}
            </a>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              by {pr.user.login}  
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    // We want only open PRs
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      per_page: 50, // or however many you want
    });

    // We could reduce the data we return, but let's pass everything
    return {
      props: {
        openPRs: pulls,
      },
    };
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    return {
      props: {
        openPRs: [],
      },
    };
  }
}
