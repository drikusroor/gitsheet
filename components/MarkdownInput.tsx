import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownInputProps = {
  value: string;
  onChange: (value: string) => void;
  absolute?: boolean;
};

const MarkdownInput = ({ value, onChange, absolute = false }: MarkdownInputProps) => {
  const [input, setInput] = useState(value || '');
  const [activeTab, setActiveTab] = useState('write');

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInput(newValue);
    onChange(newValue);
  };

  return (
    <div className="markdown-input">
      <div className={`flex justify-center space-x-4 ${absolute ? 'absolute top-0 right-0' : ''}`}>
        <button
          className={`drop-shadow transition-colors rounded text-sm px-1 ${activeTab === 'write' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setActiveTab('write')}
          type="button"
        >
          Write
        </button>
        <button
          className={`drop-shadow transition-colors rounded text-sm px-1 ${activeTab === 'preview' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setActiveTab('preview')}
          type="button"
        >
          Preview
        </button>
        <button
          className={`drop-shadow transition-colors rounded text-sm px-1 ${activeTab === 'side-by-side' ? 'bg-blue-600 text-white' : ''}`}
          onClick={() => setActiveTab('side-by-side')}
          type="button"
        >
          Side-by-Side
        </button>
      </div>
      <div className='mt-1'>
        {activeTab === 'write' && (
          <textarea
            value={input}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={6}
          />
        )}
        {activeTab === 'preview' && (
          <div className="p-4 border border-gray-300 rounded-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
          </div>
        )}
        {activeTab === 'side-by-side' && (
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={handleInputChange}
              className="w-1/2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={6}
            />
            <div className="prose p-4 border border-gray-300 rounded-md w-1/2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownInput;
