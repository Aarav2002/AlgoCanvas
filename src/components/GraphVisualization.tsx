import React, { useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  from: number;
  to: number;
}

const GraphVisualization: React.FC = () => {
  const [nodes] = useState<Node[]>([
    { id: 1, x: 100, y: 100 },
    { id: 2, x: 200, y: 200 },
    { id: 3, x: 300, y: 100 },
    { id: 4, x: 200, y: 300 },
  ]);

  const [edges] = useState<Edge[]>([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 },
  ]);

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900">Graph Visualization</h2>
        <p className="text-gray-600">
          A graph is a non-linear data structure consisting of vertices and edges.
          Explore different types of graphs and their algorithms.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <svg width="100%" height="400" viewBox="0 0 400 400">
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className="stroke-gray-400 stroke-2"
              />
            );
          })}
          
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                className="fill-indigo-500 cursor-pointer hover:fill-indigo-600 transition-colors"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="fill-white text-sm font-medium"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          BFS Traversal
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          DFS Traversal
        </button>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
          Shortest Path
        </button>
      </div>
    </div>
  );
};

export default GraphVisualization;