import React, { useState } from 'react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeVisualizerProps {
  onAlgorithmChange?: (algorithm: string) => void;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ onAlgorithmChange }) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [traversalArrows, setTraversalArrows] = useState<{ from: number; to: number }[]>([]);
  const [traversalList, setTraversalList] = useState<number[]>([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [treeType, setTreeType] = useState<'bst' | 'binary'>('bst');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [insertPosition, setInsertPosition] = useState<'left' | 'right'>('left');

  // Insert node into BST
  const insertNodeBST = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { value, left: null, right: null };
    }
    
    if (value < root.value) {
      root.left = insertNodeBST(root.left, value);
    } else if (value > root.value) {
      root.right = insertNodeBST(root.right, value);
    }
    
    return root;
  };

  // Insert node into binary tree at specific position
  const insertNodeBinary = (root: TreeNode | null, value: number, targetValue: number, position: 'left' | 'right'): TreeNode | null => {
    if (!root) {
      return null;
    }
    
    if (root.value === targetValue) {
      const newNode = { value, left: null, right: null };
      if (position === 'left' && !root.left) {
        root.left = newNode;
        return root;
      } else if (position === 'right' && !root.right) {
        root.right = newNode;
        return root;
      }
      return null; // Position already occupied
    }
    
    const leftResult = insertNodeBinary(root.left, value, targetValue, position);
    if (leftResult) return root;
    
    const rightResult = insertNodeBinary(root.right, value, targetValue, position);
    if (rightResult) return root;
    
    return null;
  };

  const addNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (treeData && findNode(treeData, value)) {
      setError('Node already exists');
      return;
    }

    setError('');
    
    if (treeType === 'bst') {
      setTreeData(prev => insertNodeBST(prev, value));
    } else {
      // Binary tree mode
      if (!treeData) {
        setTreeData({ value, left: null, right: null });
      } else if (selectedNode === null) {
        setError('Please select a parent node for binary tree insertion');
        return;
      } else {
        const newTree = { ...treeData };
        const inserted = insertNodeBinary(newTree, value, selectedNode, insertPosition);
        if (inserted) {
          setTreeData(newTree);
        } else {
          setError(`Cannot insert at ${insertPosition} of node ${selectedNode} - position occupied or node not found`);
          return;
        }
      }
    }
    
    setInputValue('');
    setSelectedNode(null);
  };

  const findNode = (root: TreeNode | null, value: number): boolean => {
    if (!root) return false;
    if (root.value === value) return true;
    return findNode(root.left, value) || findNode(root.right, value);
  };

  const clearTree = () => {
    setTreeData(null);
    setHighlightedNodes([]);
    setTraversalArrows([]);
    setTraversalList([]);
    setError('');
  };

  const traverseTree = async (order: 'preorder' | 'inorder' | 'postorder') => {
    if (!treeData || isTraversing) return;
    
    setIsTraversing(true);
    setHighlightedNodes([]);
    setTraversalArrows([]);
    setTraversalList([]);
    onAlgorithmChange?.(order);

    const result: number[] = [];
    const arrows: { from: number; to: number }[] = [];

    const traverse = (node: TreeNode | null, prev?: number) => {
      if (!node) return;

      if (order === 'preorder') {
        result.push(node.value);
      }
      if (prev !== undefined) arrows.push({ from: prev, to: node.value });

      traverse(node.left, node.value);
      if (order === 'inorder') {
        result.push(node.value);
      }
      traverse(node.right, node.value);
      if (order === 'postorder') {
        result.push(node.value);
      }
    };

    traverse(treeData);

    // Animate the traversal
    for (let i = 0; i < result.length; i++) {
      setHighlightedNodes(result.slice(0, i + 1));
      setTraversalArrows(arrows.slice(0, i));
      setTraversalList(result.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsTraversing(false);
  };

  const calculateTreeHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(calculateTreeHeight(node.left), calculateTreeHeight(node.right));
  };

  const svgHeight = Math.max(400, calculateTreeHeight(treeData) * 80 + 100);

  const renderTree = (node: TreeNode | null, x: number, y: number, level: number): JSX.Element | null => {
    if (!node) return null;

    const spacing = Math.max(60, 200 / Math.pow(2, level - 1));
    const isHighlighted = highlightedNodes.includes(node.value);
    const isSelected = selectedNode === node.value;

    return (
      <g key={`${node.value}-${x}-${y}`}>
        {traversalArrows
          .filter((arrow) => arrow.to === node.value)
          .map((arrow, index) => (
            <line
              key={`arrow-${index}`}
              x1={x}
              y1={y - 40}
              x2={x}
              y2={y - 5}
              className="stroke-red-500 stroke-2 animate-pulse"
              markerEnd="url(#arrowhead)"
            />
          ))}

        <circle 
          cx={x} 
          cy={y} 
          r="20" 
          className={`transition-all duration-300 cursor-pointer ${
            isHighlighted 
              ? 'fill-red-500 stroke-red-700' 
              : isSelected 
                ? 'fill-yellow-500 stroke-yellow-700'
                : 'fill-indigo-500 stroke-indigo-700'
          } stroke-2`}
          onClick={() => treeType === 'binary' && !isTraversing ? setSelectedNode(node.value) : null}
        />
        <text 
          x={x} 
          y={y + 5} 
          textAnchor="middle" 
          className="fill-white text-sm font-medium pointer-events-none"
        >
          {node.value}
        </text>

        {node.left && (
          <>
            <line 
              x1={x} 
              y1={y + 20} 
              x2={x - spacing} 
              y2={y + 60} 
              className="stroke-gray-400 stroke-2" 
            />
            {renderTree(node.left, x - spacing, y + 80, level + 1)}
          </>
        )}

        {node.right && (
          <>
            <line 
              x1={x} 
              y1={y + 20} 
              x2={x + spacing} 
              y2={y + 60} 
              className="stroke-gray-400 stroke-2" 
            />
            {renderTree(node.right, x + spacing, y + 80, level + 1)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {treeType === 'bst' ? 'Binary Search Tree' : 'Binary Tree'} Visualization
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {treeType === 'bst' 
            ? 'Build a binary search tree and explore different traversal algorithms.'
            : 'Build a binary tree by selecting parent nodes and explore traversal algorithms.'
          }
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          {/* Tree Type Selection */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTreeType('bst');
                setSelectedNode(null);
                setError('');
              }}
              disabled={isTraversing}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 ${
                treeType === 'bst'
                  ? 'bg-indigo-600 text-white focus:ring-indigo-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
              }`}
            >
              BST Mode
            </button>
            <button
              onClick={() => {
                setTreeType('binary');
                setSelectedNode(null);
                setError('');
              }}
              disabled={isTraversing}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 ${
                treeType === 'binary'
                  ? 'bg-indigo-600 text-white focus:ring-indigo-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
              }`}
            >
              Binary Tree Mode
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
              placeholder="Enter a number"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={isTraversing}
            />
            
            {treeType === 'binary' && treeData && (
              <>
                <select
                  value={insertPosition}
                  onChange={(e) => setInsertPosition(e.target.value as 'left' | 'right')}
                  disabled={isTraversing}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="left">Left Child</option>
                  <option value="right">Right Child</option>
                </select>
              </>
            )}
            
            <button
              onClick={addNode}
              disabled={isTraversing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Add Node
            </button>
          </div>

          <button
            onClick={clearTree}
            disabled={isTraversing}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Clear Tree
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => traverseTree('preorder')}
              disabled={!treeData || isTraversing}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              Pre-order
            </button>
            <button
              onClick={() => traverseTree('inorder')}
              disabled={!treeData || isTraversing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              In-order
            </button>
            <button
              onClick={() => traverseTree('postorder')}
              disabled={!treeData || isTraversing}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              Post-order
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {treeType === 'binary' && treeData && !isTraversing && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-800 dark:text-blue-200 font-medium mb-2">
              Binary Tree Mode Instructions:
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              1. Click on a node to select it as parent (yellow highlight)
              {selectedNode && ` - Selected: ${selectedNode}`}
              <br />
              2. Choose position (Left/Right Child) and enter value
              <br />
              3. Click "Add Node" to insert
            </div>
          </div>
        )}

        {isTraversing && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Traversing tree...
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-300">
                Visited: [{traversalList.join(', ')}]
              </span>
            </div>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-auto border">
          {treeData ? (
            <svg
              width="100%"
              height={svgHeight}
              viewBox={`0 0 600 ${svgHeight}`}
              className="mx-auto"
            >
              <defs>
                <marker 
                  id="arrowhead" 
                  markerWidth="10" 
                  markerHeight="7" 
                  refX="5" 
                  refY="3.5" 
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
                </marker>
              </defs>
              <g transform="translate(300, 40)">
                {renderTree(treeData, 0, 0, 1)}
              </g>
            </svg>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No tree yet. Add some nodes to get started!</p>
            </div>
          )}
        </div>

        {traversalList.length > 0 && !isTraversing && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Traversal Complete!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Final order: [{traversalList.join(', ')}]
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualizer;










