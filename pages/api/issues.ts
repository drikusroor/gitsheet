import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ issues });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ error: 'Failed to fetch issues from GitHub' });
  }
}
