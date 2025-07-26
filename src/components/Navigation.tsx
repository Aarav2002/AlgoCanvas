import React from 'react';
import { Trees as Tree, GitGraph } from 'lucide-react';

interface NavigationProps {
  activeView: 'tree' | 'graph';
  setActiveView: (view: 'tree' | 'graph') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => setActiveView('tree')}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeView === 'tree'
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Tree className="h-5 w-5 mr-2" />
        Trees
      </button>
      <button
        onClick={() => setActiveView('graph')}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
          activeView === 'graph'
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <GitGraph className="h-5 w-5 mr-2" />
        Graphs
      </button>
    </div>
  );
}

export default Navigation