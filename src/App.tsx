import React, { useState, useEffect } from 'react';
import { Share2, Github, BookOpen } from 'lucide-react';
import GraphVisualizer from './components/GraphVisualizer';
import TreeVisualizer from './components/TreeVisualizer';
import MSTVisualizer from './components/MSTVisualizer';
import AlgorithmExplanation from './components/AlgorithmExplanation';
import ThemeToggle from './components/ThemeToggle';

type GraphType = 'simple' | 'tree' | 'mst';

function App() {
  const [graphType, setGraphType] = useState<GraphType>('tree');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderVisualizer = () => {
    switch (graphType) {
      case 'simple':
        return <GraphVisualizer onAlgorithmChange={setCurrentAlgorithm} />;
      case 'tree':
        return <TreeVisualizer onAlgorithmChange={setCurrentAlgorithm} />;
      case 'mst':
        return <MSTVisualizer onAlgorithmChange={setCurrentAlgorithm} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                DSA Visualizer
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
              
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gray-500" />
                <Github className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setGraphType('simple')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  graphType === 'simple'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Graph Algorithms
              </button>
              <button
                onClick={() => setGraphType('tree')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  graphType === 'tree'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tree Traversal
              </button>
              <button
                onClick={() => setGraphType('mst')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  graphType === 'mst'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Minimum Spanning Tree
              </button>
            </nav>
          </div>
        </div>

        {/* Algorithm Explanation */}
        {currentAlgorithm && (
          <AlgorithmExplanation algorithm={currentAlgorithm} type={graphType === 'simple' ? 'graph' : graphType} />
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {renderVisualizer()}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Learn Data Structures and Algorithms through interactive visualizations
            </p>
            <p className="text-sm">
              Built by Shubham Kumar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;




