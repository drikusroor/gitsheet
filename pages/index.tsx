import React from "react";
import "@/styles/globals.css";
import { Octokit } from "@octokit/rest";
import FileViewer from "@/components/FileViewer";
import { FileItem } from "@/types/types";

interface HomeProps {
  files: FileItem;
  error: string;
}

export default function Home({ files, error }: HomeProps) {
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return <FileViewer files={files} error={error} />;
}

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
      path: "example",
    });

    if (!Array.isArray(contents)) {
      throw new Error("Expected directory contents but got a file");
    }

    console.log("Directory contents:", contents);

    // Include more file information
    const files = contents
      .filter((file) => file.type === "file")
      .map((file) => ({
        name: file.name,
        type: file.type,
        download_url: file.download_url,
        size: file.size,
      }));

    return {
      props: {
        files,
      },
    };
  } catch (error) {
    console.error("Error fetching files:", error);
    return {
      props: {
        files: [],
        error: "Failed to fetch files from GitHub",
      },
    };
  }
}
