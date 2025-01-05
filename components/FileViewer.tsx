import Link from "next/link";
import { useState } from "react";
import { FaThList, FaThLarge } from "react-icons/fa";
import FileIcon from "./FileIcon";
import { FileItem } from "@/types/types";
import Image from "next/image";

interface ViewToggleProps {
  view: string;
  onViewChange: (view: string) => void;
}

// ViewToggle component
const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => (
  <div className="flex gap-2 mb-4">
    <button
      onClick={() => onViewChange("list")}
      className={`p-2 rounded ${
        view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      <FaThList />
    </button>
    <button
      onClick={() => onViewChange("grid")}
      className={`p-2 rounded ${
        view === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      <FaThLarge />
    </button>
  </div>
);

interface FileViewerProps {
  files: FileItem[];
  error: string;
}

const FileViewer = ({ files, error }: FileViewerProps) => {
  const [viewMode, setViewMode] = useState("list");
  const [previewUrl, setPreviewUrl] = useState(null);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const renderFileItem = (file: FileItem) => {
    const isImage = file.name.match(/\.(jpg|jpeg|png|gif)$/i);

    return viewMode === "list" ? (
      <Link
        href={`/edit?filename=${encodeURIComponent(file.name)}`}
        className="text-blue-500 hover:underline flex-grow"
      >
        <div
          key={file.name}
          className="flex items-center p-3 gap-3 hover:bg-gray-50 rounded"
        >
          <FileIcon fileName={file.name} />
          {file.name}
          {isImage && file.download_url && (
            <button
              onClick={() => setPreviewUrl(file.download_url)}
              className="text-sm text-blue-500 hover:underline"
            >
              Preview
            </button>
          )}

          <span className="text-gray-500 text-sm ml-auto">
            {file.size > 1024
              ? `${(file.size / 1024).toFixed(2)} KB`
              : `${file.size} B`}
          </span>
        </div>
      </Link>
    ) : (
      <Link
        key={file.name}
        href={`/edit?filename=${encodeURIComponent(file.name)}`}
        className="text-center block text-blue-500 group cursor-pointer"
      >
        <div className="p-4 border rounded-lg hover:shadow-md">
          <div className="flex justify-center mb-2">
            {isImage && file.download_url ? (
              <Image
                src={file.download_url}
                alt={file.name}
                className="h-32 object-cover cursor-pointer"
                onClick={() => setPreviewUrl(file.download_url)}
              />
            ) : (
              <FileIcon fileName={file.name} />
            )}
          </div>

          <span className="text-blue-500 group-hover:underline">
            {file.name}
          </span>

          <span className="text-gray-500 text-xs block mt-1">
            {file.size > 1024
              ? `${(file.size / 1024).toFixed(2)} KB`
              : `${file.size} B`}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Files</h1>
        <ViewToggle view={viewMode} onViewChange={setViewMode} />
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-3 gap-4"
            : "space-y-2"
        }
      >
        {files.map(renderFileItem)}
      </div>
    </div>
  );
};

export default FileViewer;
