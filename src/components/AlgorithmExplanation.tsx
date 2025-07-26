import React from 'react';
import { BookOpen, Clock, Zap } from 'lucide-react';

interface AlgorithmExplanationProps {
  algorithm: string;
  type: 'graph' | 'tree' | 'mst';
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ algorithm, type }) => {
  const getExplanation = () => {
    switch (type) {
      case 'graph':
        return {
          'BFS': {
            title: 'Breadth-First Search (BFS)',
            description: 'Explores nodes level by level, visiting all neighbors before moving deeper.',
            timeComplexity: 'O(V + E)',
            spaceComplexity: 'O(V)',
            useCase: 'Finding shortest path in unweighted graphs, level-order traversal'
          },
          'DFS': {
            title: 'Depth-First Search (DFS)',
            description: 'Explores as far as possible along each branch before backtracking.',
            timeComplexity: 'O(V + E)',
            spaceComplexity: 'O(V)',
            useCase: 'Topological sorting, detecting cycles, pathfinding'
          }
        };
      case 'tree':
        return {
          'preorder': {
            title: 'Preorder Traversal',
            description: 'Visit root first, then left subtree, then right subtree.',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(h)',
            useCase: 'Creating a copy of the tree, prefix expression evaluation'
          },
          'inorder': {
            title: 'Inorder Traversal',
            description: 'Visit left subtree, then root, then right subtree.',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(h)',
            useCase: 'Getting sorted order in BST, expression tree evaluation'
          },
          'postorder': {
            title: 'Postorder Traversal',
            description: 'Visit left subtree, then right subtree, then root.',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(h)',
            useCase: 'Deleting tree, postfix expression evaluation'
          }
        };
      case 'mst':
        return {
          'kruskal': {
            title: "Kruskal's Algorithm",
            description: 'Finds MST by sorting edges and adding them if they don\'t create a cycle.',
            timeComplexity: 'O(E log E)',
            spaceComplexity: 'O(V)',
            useCase: 'Network design, clustering, approximation algorithms'
          },
          'prim': {
            title: "Prim's Algorithm",
            description: 'Builds MST by starting from a vertex and adding minimum weight edges.',
            timeComplexity: 'O(E log V)',
            spaceComplexity: 'O(V)',
            useCase: 'Dense graphs, real-time applications, network routing'
          }
        };
      default:
        return {};
    }
  };

  const explanations = getExplanation();
  const info = explanations[algorithm as keyof typeof explanations];

  if (!info) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900">{info.title}</h3>
      </div>
      
      <p className="text-gray-700 mb-4">{info.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">Time Complexity</p>
            <p className="text-sm text-blue-700">{info.timeComplexity}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <Zap className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">Space Complexity</p>
            <p className="text-sm text-green-700">{info.spaceComplexity}</p>
          </div>
        </div>
        
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-900">Common Use Cases</p>
          <p className="text-sm text-purple-700">{info.useCase}</p>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplanation;
