// pages/api/createPr.js

import { Octokit } from '@octokit/rest';

/*
  We'll use @octokit/rest for convenience, but you could use fetch() with the GitHub REST API.
  Make sure to install it:
    npm install @octokit/rest
*/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, updatedCsvText } = req.body as { filename: string; updatedCsvText: string };

  if (!filename) {
    return res.status(400).json({ error: 'No filename provided' });
  }

  if (!updatedCsvText) {
    return res.status(400).json({ error: 'No CSV text provided' });
  }

  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const defaultBranch = process.env.GITHUB_DEFAULT_BRANCH || 'main';
    const folderPath = process.env.GITHUB_PATH;
    const path = folderPath ? `${folderPath}/${filename}` : filename;

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // 1. Get the default branch SHA (main) so we can create a new branch from it.
    //    This is needed to reference a commit SHA when creating the new branch ref.
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });
    const baseSha = repoData.default_branch === defaultBranch
      ? repoData.pushed_at // We'll fix this below, see note
      : null;

    // Actually, better approach is to get the exact ref:
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = refData.object.sha;

    // 2. Create a new branch name (e.g., "update-csv-YYYYMMDD-HHMM")
    const branchName = `update-csv-${Date.now()}`;
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha, // reference the main branch commit
    });

    // 3. Update the CSV file in that branch
    //    - We need the content in base64
    const contentBase64 = Buffer.from(updatedCsvText, 'utf8').toString('base64');

    // We must get the file's current SHA (for that branch). Actually, if the file doesn't exist, this can be omitted, but let's be safe:
    let fileSha;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branchName,
      });
      fileSha = fileData.sha;
    } catch (err) {
      // If we get a 404, that means the file doesn't exist yet. That's okay; fileSha can be undefined.
      if (err.status !== 404) throw err;
    }

    const commitMsg = `Update CSV data at ${new Date().toISOString()}`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMsg,
      content: contentBase64,
      branch: branchName,
      sha: fileSha, // if file already existed on that branch
    });

    // 4. Create a Pull Request
    const prTitle = `Automated CSV Update (${filename})`;
    const prBody = 'This PR was created automatically by the CSV editor.';
    const { data: prData } = await octokit.pulls.create({
      owner,
      repo,
      title: prTitle,
      head: branchName,
      base: defaultBranch,
      body: prBody,
    });

    return res.status(200).json({
      message: 'PR created successfully',
      pullRequestUrl: prData.html_url,
      pullRequestNumber: prData.number,
    });
  } catch (error) {
    console.error('Failed to create PR:', error);
    return res.status(500).json({ error: error.message });
  }
}
