import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const { title, body = "", labels = [] } = req.body;

    if (!owner || !repo) {
      throw new Error('GitHub configuration is missing');
    }

    const { data: issue } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    });

    res.status(201).json({ issue });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue on GitHub' });
  }
}
