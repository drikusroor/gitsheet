// pages/index.js
import React, { useCallback, useState } from "react";
import Papa from "papaparse";
import "@/styles/globals.css";
import GenericDataGrid from "@/components/GenericDataGrid";
import { useRouter } from "next/navigation";

interface HomeProps {
  initialCsvData: any[];
  initialCsvRaw: string;
  filename: string;
}

export default function Home({
  initialCsvData,
  initialCsvRaw,
  filename,
}: HomeProps) {
  const router = useRouter();

  const [tableData, setTableData] = useState(initialCsvData);
  // Convert our tableData (array of objects) back to CSV
  const generateCsvText = () => {
    const unparseConfig = { header: true };
    return Papa.unparse(tableData, unparseConfig);
  };

  // Submit changes to create a PR
  const submitChanges = useCallback(async () => {
    try {
      const updatedCsvText = generateCsvText();
      const response = await fetch("/api/createPr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename, updatedCsvText }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(`PR created: ${result.pullRequestUrl}`);

        const prNumber = result.pullRequestNumber;
        router.push(`/prs/${prNumber}`);
      } else {
        alert(`Error creating PR: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create PR. See console for details.");
    }
  }, [filename, tableData]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Editable CSV Table
      </h1>
      <GenericDataGrid
        data={tableData}
        onDataUpdate={(updated) => setTableData(updated)}
      />
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
        Accept: "application/vnd.github.v3.raw",
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
        filename,
      },
    };
  } catch (err) {
    console.error("Failed to fetch CSV from GitHub:", err);
    return {
      props: {
        initialCsvData: [],
        initialCsvRaw: "",
        filename,
      },
    };
  }
}
