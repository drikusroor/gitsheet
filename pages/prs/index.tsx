import React from 'react';
import { Octokit } from '@octokit/rest';
import Link from 'next/link';

export default function PrList({ openPRs }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Open Pull Requests</h1>
      {openPRs.length === 0 && <p className="text-gray-600">No open PRs found.</p>}

      <ul className="space-y-4">
        {openPRs.map((pr) => (
          <li key={pr.number} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <Link href={`/prs/${pr.number}`} className="block">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 font-mono">#{pr.number}</span>
                <span className="font-medium text-gray-800">{pr.title}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                by {pr.user.login}
              </div>
            </Link>
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
  