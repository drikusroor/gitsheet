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
    const { id } = req.query;

    if (!owner || !repo) {
      throw new Error('GitHub configuration is missing');
    }

    const { data: issue } = await octokit.issues.get({
      owner,
      repo,
      issue_number: id,
    });

    res.status(200).json({ issue });
  } catch (error) {
    console.error('Error fetching issue details:', error);
    res.status(500).json({ error: 'Failed to fetch issue details from GitHub' });
  }
}
