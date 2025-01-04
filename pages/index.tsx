import React from 'react';
import Papa from 'papaparse';

// We'll fetch a CSV from a GitHub repo. Let's say it's at
// https://github.com/{owner}/{repo}/contents/path/to/data.csv
// We'll use the GitHub "Contents API" endpoint.

export default function Home({ csvData }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>CSV Viewer</h1>
      {csvData && csvData.length > 0 ? (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {Object.keys(csvData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, idx) => (
              <tr key={idx}>
                {Object.keys(row).map((key) => (
                  <td key={key}>{row[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

// This function runs on the server for every request (unless using Next.js caching).
export async function getServerSideProps() {
  // 1. Prepare the GitHub API endpoint for your CSV file
  //    Example: /repos/{OWNER}/{REPO}/contents/path/to/data.csv
  const owner = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_PATH;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 2. Fetch from GitHub
    //    We pass the token in the Authorization header.
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`, // from .env.local
        Accept: 'application/vnd.github.v3.raw', 
      },
    });

    // If we use 'application/vnd.github.v3.raw',
    // GitHub returns the *raw file contents* instead of a JSON object with base64.
    // Alternatively, you can fetch the JSON and base64-decode it yourself.
    // e.g. Accept: 'application/vnd.github.v3+json' 
    // and then parse the "content" field.

    if (!res.ok) {
      throw new Error(`GitHub fetch failed with status ${res.status}`);
    }

    // 3. Get the raw CSV text
    const csvText = await res.text();

    // 4. Parse CSV into JSON
    //    Papa.parse returns an object with { data, errors, meta }
    const parseResult = Papa.parse(csvText, { header: true });
    const csvData = parseResult.data; // This should be an array of objects

    // 5. Return props to the page
    return {
      props: {
        csvData,
      },
    };
  } catch (err) {
    console.error('Failed to fetch/parse CSV from GitHub:', err);
    return {
      props: {
        csvData: [],
      },
    };
  }
}
