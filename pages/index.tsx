import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/globals.css';
import { Octokit } from '@octokit/rest';

export default function Home({ files, error }) {

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">CSV Files</h1>
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file}>
            <Link 
              href={`/edit?filename=${encodeURIComponent(file)}`}
              className="text-blue-500 hover:underline"
            >
              {file}
            </Link>
          </div>
        ))}
        {files.length === 0 && <p className="text-gray-600">No CSV files found.</p>}
      </div>
    </div>
  );
}

// get server side props to fetch the list of files in the data directory of the GitHub repository
export async function getServerSideProps() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'example',
    });

    if (!Array.isArray(contents)) {
      throw new Error('Expected directory contents but got a file');
    }

    const csvFiles = contents
      .filter(file => file.type === 'file' && file.name.endsWith('.csv'))
      .map(file => file.name);

    return {
      props: {
        files: csvFiles,
      },
    };
  }
  catch (error) {
    console.error('Error fetching files:', error);
    return {
      props: {
        files: [],
        error: 'Failed to fetch files from GitHub',
      },
    };
  }

}
