import React from 'react';
import { ExternalLink, Book, Video, Code } from 'lucide-react';

interface Resource {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'practice';
}

interface LearningResourcesProps {
  topic: string;
}

const LearningResources: React.FC<LearningResourcesProps> = ({ topic }) => {
  const resources: Record<string, Resource[]> = {
    'tree': [
      {
        title: 'Binary Trees - GeeksforGeeks',
        description: 'Comprehensive guide to binary trees and traversals',
        url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
        type: 'article'
      },
      {
        title: 'Tree Traversal Visualization',
        description: 'Interactive tree traversal examples',
        url: 'https://visualgo.net/en/bst',
        type: 'practice'
      }
    ],
    'graph': [
      {
        title: 'Graph Algorithms - MIT',
        description: 'Detailed explanation of BFS and DFS',
        url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
        type: 'article'
      },
      {
        title: 'Graph Theory Practice',
        description: 'Practice problems for graph algorithms',
        url: 'https://leetcode.com/tag/graph/',
        type: 'practice'
      }
    ],
    'mst': [
      {
        title: 'Minimum Spanning Trees',
        description: 'Understanding Kruskal\'s and Prim\'s algorithms',
        url: 'https://www.geeksforgeeks.org/minimum-spanning-tree/',
        type: 'article'
      }
    ]
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'article': return <Book className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'practice': return <Code className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const topicResources = resources[topic] || [];

  if (topicResources.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Learning Resources
      </h3>
      <div className="space-y-3">
        {topicResources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="text-indigo-600 dark:text-indigo-400 mt-1">
              {getIcon(resource.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {resource.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {resource.description}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default LearningResources;