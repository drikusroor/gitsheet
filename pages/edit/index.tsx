// pages/index.js
import React, { useState } from 'react';
import Papa from 'papaparse';

export default function Home({ initialCsvData, initialCsvRaw }) {
  // initialCsvData is array of objects from Papa.parse
  // initialCsvRaw is the raw CSV text from GitHub (used if we need the original for diff or something else)

  const [tableData, setTableData] = useState(initialCsvData);

  // Handler for editing a cell
  const handleCellChange = (rowIndex, key, newValue) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [key]: newValue };
      return newData;
    });
  };

  // Convert our tableData (array of objects) back to CSV
  const generateCsvText = () => {
    const unparseConfig = { header: true };
    return Papa.unparse(tableData, unparseConfig);
  };

  // Submit changes to create a PR
  const submitChanges = async () => {
    try {
      const updatedCsvText = generateCsvText();
      const response = await fetch('/api/createPr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updatedCsvText }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`PR created: ${result.pullRequestUrl}`);
      } else {
        alert(`Error creating PR: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create PR. See console for details.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Editable CSV Table</h1>
      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: 'collapse', marginBottom: '1rem' }}
      >
        <thead>
          <tr>
            {/* Render table headers from the keys of the first row */}
            {tableData[0] &&
              Object.keys(tableData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((key) => (
                <td key={key}>
                  <input
                    style={{ width: '100%' }}
                    value={row[key] || ''}
                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={submitChanges}>
        Submit changes (create PR)
      </button>
    </div>
  );
}

export async function getServerSideProps() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_PATH;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub fetch failed with status ${res.status}`);
    }

    const csvText = await res.text();
    const parseResult = Papa.parse(csvText, { header: true });
    const csvData = parseResult.data;

    return {
      props: {
        initialCsvData: csvData,
        initialCsvRaw: csvText,
      },
    };
  } catch (err) {
    console.error('Failed to fetch CSV from GitHub:', err);
    return {
      props: {
        initialCsvData: [],
        initialCsvRaw: '',
      },
    };
  }
}
