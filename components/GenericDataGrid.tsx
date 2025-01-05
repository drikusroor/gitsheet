import React, { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface GenericDataGridProps {
  data: any[];
  onDataUpdate(updatedData: any[]): void;
}

export default function GenericDataGrid({
  data,
  onDataUpdate,
}: GenericDataGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const sortedFilteredIndexes = useMemo(() => {
    let indexes = Array.from({ length: data.length }, (_, i) => i);
    indexes = indexes.filter((i) =>
      Object.values(data[i]).some((val) =>
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    if (sortConfig) {
      indexes.sort((a, b) => {
        const valA = data[a][sortConfig.key];
        const valB = data[b][sortConfig.key];
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return indexes;
  }, [data, searchQuery, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      if (prev.direction === "desc") {
        return null; // reset sorting
      }
      return { key, direction: "asc" };
    });
  };

  const handleCellChange = (
    sortedIndex: number,
    key: string,
    newValue: string
  ) => {
    const originalIndex = sortedFilteredIndexes[sortedIndex];
    const updatedData = [...data];
    updatedData[originalIndex] = {
      ...updatedData[originalIndex],
      [key]: newValue,
    };
    onDataUpdate(updatedData);
  };

  return (
    <div>
      <input
        className="border p-1 mb-2"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search..."
      />
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b">
              {data[0] &&
                Object.keys(data[0]).map((header) => {
                  let icon = <FaSort />;
                  if (sortConfig?.key === header) {
                    icon =
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      );
                  }
                  return (
                    <th
                      key={header}
                      onClick={() => handleSort(header)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer"
                    >
                      <span className="flex items-center">
                        {header} {icon}
                      </span>
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedFilteredIndexes.map((rowIndex) => {
              const row = data[rowIndex];
              return (
                <tr key={rowIndex}>
                  {Object.keys(row).map((key) => (
                    <td key={key} className="px-6 py-2">
                      <input
                        className="w-full px-2 py-1 border rounded focus:outline-none"
                        value={row[key] || ""}
                        onChange={(e) =>
                          handleCellChange(
                            sortedFilteredIndexes.indexOf(rowIndex),
                            key,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
