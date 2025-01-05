import { FaFile, FaFileCsv, FaFileImage } from "react-icons/fa";

interface FileIconProps {
  fileName: string;
}

// FileIcon component
const FileIcon = ({ fileName }: FileIconProps) => {
  if (fileName.match(/\.(jpg|jpeg|png|gif)$/i))
    return <FaFileImage className="text-blue-500" />;
  if (fileName.endsWith(".csv"))
    return <FaFileCsv className="text-green-500" />;
  return <FaFile className="text-gray-500" />;
};

export default FileIcon;
