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

    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'data'
    });

    if (!Array.isArray(contents)) {
      throw new Error('Expected directory contents but got a file');
    }

    const csvFiles = contents
      .filter(file => file.type === 'file' && file.name.endsWith('.csv'))
      .map(file => file.name);

    res.status(200).json({ files: csvFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files from GitHub' });
  }
}
