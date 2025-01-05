// pages/index.js
import React, { useState } from 'react';
import Papa from 'papaparse';
import '@/styles/globals.css';


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
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Editable CSV Table</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b">
              {tableData[0] &&
                Object.keys(tableData[0]).map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key) => (
                  <td key={key} className="px-6 py-2">
                    <input
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={row[key] || ''}
                      onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={submitChanges}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Submit changes (create PR)
      </button>
    </div>
  );
}

// Fetch CSV data from GitHub, get the filename from url params
export async function getServerSideProps(context) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.GITHUB_PATH;

  // get filename from url params
  const filename = context.query.filename;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}/${filename}`;

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
