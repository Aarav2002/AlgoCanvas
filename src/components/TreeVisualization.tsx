import React, { useState } from 'react';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

const TreeVisualization: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState<number | string>('');
  const [error, setError] = useState('');

  const addNode = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setError('Please enter a valid number.');
      return;
    }

    const newNode: TreeNode = { value: Number(inputValue) };
    setTreeData(prevTree => (prevTree ? { ...prevTree, left: newNode } : newNode)); // Simple example adding to the left
    setInputValue('');
    setError('');
  };

  const renderTree = (node: TreeNode, x: number, y: number, level: number) => {
    const spacing = 120 / (level + 1);
    return (
      <g key={`${x}-${y}`}>
        <circle cx={x} cy={y} r="20" className="fill-indigo-500 cursor-pointer hover:fill-indigo-600 transition-colors" />
        <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm font-medium">
          {node.value}
        </text>
        {node.left && (
          <>
            <line x1={x} y1={y + 20} x2={x - spacing} y2={y + 60} className="stroke-gray-400 stroke-2" />
            {renderTree(node.left, x - spacing, y + 80, level + 1)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y + 20} x2={x + spacing} y2={y + 60} className="stroke-gray-400 stroke-2" />
            {renderTree(node.right, x + spacing, y + 80, level + 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900">Binary Tree Visualization</h2>
        <p className="text-gray-600">Create a binary tree and visualize the traversal algorithms.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
        <svg width="100%" height="400" viewBox="0 0 400 400">
          <g transform="translate(200, 40)">
            {treeData && renderTree(treeData, 0, 0, 1)}
          </g>
        </svg>
      </div>

      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter node value"
          className="px-4 py-2 border rounded-md"
        />
        <button onClick={addNode} className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-md">
          Add Node
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default TreeVisualization;
