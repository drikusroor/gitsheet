import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const tabs = [
  { id: "grid", label: "Files", path: "/" },
  { id: "prs", label: "Pull Requests", path: "/prs" },
  { id: "issues", label: "Issues", path: "/issues" },
];

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Check if the current tab is active by checking whether the current path includes the tab path
  // Except for the home tab, we need to check if the current path is exactly '/'
  const isActiveTab = (tabPath: string) =>
    tabPath === "/" ? currentPath === tabPath : currentPath.includes(tabPath);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  isActiveTab(tab.path)
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
