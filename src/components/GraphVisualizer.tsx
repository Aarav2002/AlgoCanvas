import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  visited?: boolean;
}

interface Link {
  source: string;
  target: string;
  weight?: number;
  visited?: boolean;
}

interface GraphVisualizerProps {
  onAlgorithmChange?: (algorithm: string) => void;
}

type GraphType = 'undirected' | 'directed' | 'weighted';

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ onAlgorithmChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [isRunningBFS, setIsRunningBFS] = useState(false);
  const [isRunningDFS, setIsRunningDFS] = useState(false);
  const [newNode, setNewNode] = useState('');
  const [newEdge, setNewEdge] = useState({ source: '', target: '', weight: '' });
  const [graphType, setGraphType] = useState<GraphType>('undirected');
  const [selectedStartNode, setSelectedStartNode] = useState('');
  const [algorithmExplanation, setAlgorithmExplanation] = useState('');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    if (nodes.length === 0) {
      // Show empty state
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9ca3af')
        .style('font-size', '18px')
        .text('Add nodes and edges to create your graph');
      return;
    }

    // Create simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Define arrow marker for directed graphs
    if (graphType === 'directed') {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');
    }

    // Draw links
    const linkGroup = svg.append('g');
    const link = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', graphType === 'directed' ? 'url(#arrowhead)' : null);

    // Draw weight labels for weighted graphs
    let weightLabels: any = null;
    if (graphType === 'weighted') {
      weightLabels = svg.append('g')
        .selectAll('text')
        .data(links)
        .join('text')
        .text(d => d.weight || 1)
        .attr('fill', '#666')
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .style('font-weight', 'bold')
        .style('font-size', '12px')
        .style('background', 'white');
    }

    // Create node groups
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Draw node circles
    nodeGroup.append('circle')
      .attr('r', 20)
      .attr('fill', '#4f46e5')
      .attr('stroke', '#312e81')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Draw node labels
    nodeGroup.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none');

    // BFS implementation
    const runBFS = async (startNode: Node) => {
      const queue: Node[] = [startNode];
      const visited = new Set<string>();

      // Show initial explanation
      setAlgorithmExplanation(`Starting BFS from node ${startNode.id}. Adding ${startNode.id} to the queue.`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current.id)) continue;

        visited.add(current.id);

        setAlgorithmExplanation(`Visiting node ${current.id}. Marking it as visited and exploring its neighbors.`);

        // Highlight current node
        nodeGroup
          .filter(d => d.id === current.id)
          .select('circle')
          .transition()
          .duration(500)
          .attr('fill', '#22c55e')
          .attr('r', 24);

        // Find neighbors
        const neighbors = getNeighbors(current.id, visited);

        if (neighbors.length > 0) {
          const neighborIds = neighbors.map(n => n.id).join(', ');
          setAlgorithmExplanation(`Found unvisited neighbors of ${current.id}: ${neighborIds}. Adding them to the queue.`);
        } else {
          setAlgorithmExplanation(`Node ${current.id} has no unvisited neighbors.`);
        }

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.id)) {
            queue.push(neighbor);
            highlightEdge(current.id, neighbor.id, '#22c55e');
          }
        }

        if (queue.length > 0) {
          const queueIds = queue.map(n => n.id).join(', ');
          setAlgorithmExplanation(`Queue now contains: [${queueIds}]. Next, we'll process ${queue[0].id}.`);
        } else {
          setAlgorithmExplanation(`Queue is empty. BFS traversal complete!`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsRunningBFS(false);
    };

    // DFS implementation
    const runDFS = async (startNode: Node, visited = new Set<string>()) => {
      if (visited.has(startNode.id)) return;

      visited.add(startNode.id);

      setAlgorithmExplanation(`Visiting node ${startNode.id}. Marking it as visited and going deeper into its neighbors.`);

      // Highlight current node
      nodeGroup
        .filter(d => d.id === startNode.id)
        .select('circle')
        .transition()
        .duration(500)
        .attr('fill', '#e11d48')
        .attr('r', 24);

      const neighbors = getNeighbors(startNode.id, visited);

      if (neighbors.length > 0) {
        const neighborIds = neighbors.map(n => n.id).join(', ');
        setAlgorithmExplanation(`Found unvisited neighbors of ${startNode.id}: ${neighborIds}. Exploring depth-first.`);
      } else {
        setAlgorithmExplanation(`Node ${startNode.id} has no unvisited neighbors. Backtracking...`);
      }

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          highlightEdge(startNode.id, neighbor.id, '#e11d48');
          setAlgorithmExplanation(`Moving from ${startNode.id} to ${neighbor.id} and exploring deeper.`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          await runDFS(neighbor, visited);
        }
      }
    };

    // Helper function to get neighbors
    const getNeighbors = (nodeId: string, visited: Set<string>) => {
      return links
        .filter(l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          
          if (graphType === 'directed') {
            return sourceId === nodeId;
          } else {
            return sourceId === nodeId || targetId === nodeId;
          }
        })
        .map(l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          const neighborId = sourceId === nodeId ? targetId : sourceId;
          return nodes.find(n => n.id === neighborId)!;
        })
        .filter(neighbor => neighbor && !visited.has(neighbor.id));
    };

    // Helper function to highlight edges
    const highlightEdge = (sourceId: string, targetId: string, color: string) => {
      link
        .filter(l => {
          const linkSourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const linkTargetId = typeof l.target === 'string' ? l.target : l.target.id;
          
          if (graphType === 'directed') {
            return linkSourceId === sourceId && linkTargetId === targetId;
          } else {
            return (linkSourceId === sourceId && linkTargetId === targetId) ||
                   (linkSourceId === targetId && linkTargetId === sourceId);
          }
        })
        .transition()
        .duration(500)
        .attr('stroke', color)
        .attr('stroke-width', 3);
    };

    // Reset visualization
    const resetVisualization = () => {
      nodeGroup
        .select('circle')
        .transition()
        .duration(500)
        .attr('fill', '#4f46e5')
        .attr('r', 20);

      link
        .transition()
        .duration(500)
        .attr('stroke', '#999')
        .attr('stroke-width', 2);
    };

    // Add control buttons
    const createButton = (text: string, x: number, onClick: () => void, disabled = false) => {
      const button = svg.append('g')
        .attr('transform', `translate(${x}, ${height - 60})`)
        .style('cursor', disabled ? 'not-allowed' : 'pointer')
        .style('opacity', disabled ? 0.5 : 1);
      
      if (!disabled) {
        button.on('click', onClick);
      }

      button.append('rect')
        .attr('width', 120)
        .attr('height', 40)
        .attr('rx', 8)
        .attr('fill', '#4f46e5');

      button.append('text')
        .attr('x', 60)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('pointer-events', 'none')
        .text(text);
    };

    const hasStartNode = selectedStartNode && nodes.some(n => n.id === selectedStartNode);

    createButton('Start BFS', 50, () => {
      resetVisualization();
      setIsRunningBFS(true);
      onAlgorithmChange?.('bfs');
      const startNode = nodes.find(n => n.id === selectedStartNode) || nodes[0];
      runBFS(startNode);
    }, !hasStartNode);

    createButton('Start DFS', 180, () => {
      resetVisualization();
      setIsRunningDFS(true);
      onAlgorithmChange?.('dfs');
      const startNode = nodes.find(n => n.id === selectedStartNode) || nodes[0];
      runDFS(startNode);
    }, !hasStartNode);

    createButton('Reset', 310, () => {
      resetVisualization();
      setIsRunningBFS(false);
      setIsRunningDFS(false);
      onAlgorithmChange?.('');
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      nodeGroup.attr('transform', (d: Node) => `translate(${d.x},${d.y})`);
      
      link
        .attr('x1', (d: Link) => {
          const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
          return source?.x || 0;
        })
        .attr('y1', (d: Link) => {
          const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
          return source?.y || 0;
        })
        .attr('x2', (d: Link) => {
          const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
          return target?.x || 0;
        })
        .attr('y2', (d: Link) => {
          const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
          return target?.y || 0;
        });

      if (weightLabels) {
        weightLabels
          .attr('x', (d: Link) => {
            const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
            const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
            return ((source?.x || 0) + (target?.x || 0)) / 2;
          })
          .attr('y', (d: Link) => {
            const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
            const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
            return ((source?.y || 0) + (target?.y || 0)) / 2;
          });
      }
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, graphType, selectedStartNode]);

  // Handle adding new nodes
  const handleAddNode = () => {
    if (newNode && !nodes.find(n => n.id === newNode)) {
      setNodes([...nodes, { id: newNode }]);
      setNewNode('');
    }
  };

  // Handle adding new edges
  const handleAddEdge = () => {
    const { source, target, weight } = newEdge;
    
    if (
      source &&
      target &&
      source !== target &&
      nodes.some(n => n.id === source) &&
      nodes.some(n => n.id === target)
    ) {
      // Check for duplicate edges based on graph type
      const isDuplicate = links.some(l => {
        if (graphType === 'directed') {
          return l.source === source && l.target === target;
        } else {
          return (l.source === source && l.target === target) ||
                 (l.source === target && l.target === source);
        }
      });

      if (!isDuplicate) {
        const newLink: Link = { 
          source, 
          target,
          ...(graphType === 'weighted' && { weight: parseInt(weight) || 1 })
        };
        setLinks([...links, newLink]);
        setNewEdge({ source: '', target: '', weight: '' });
      }
    }
  };

  // Clear graph
  const clearGraph = () => {
    setNodes([]);
    setLinks([]);
    setSelectedStartNode('');
    setIsRunningBFS(false);
    setIsRunningDFS(false);
    onAlgorithmChange?.('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Graph Visualization
        </h2>
        
        {/* Graph Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Graph Type:
          </label>
          <div className="flex space-x-4">
            {(['undirected', 'directed', 'weighted'] as GraphType[]).map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  value={type}
                  checked={graphType === type}
                  onChange={(e) => setGraphType(e.target.value as GraphType)}
                  className="mr-2"
                />
                <span className="capitalize text-gray-700 dark:text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Add Node */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newNode}
              onChange={(e) => setNewNode(e.target.value)}
              placeholder="Node ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleAddNode}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add Node
            </button>
          </div>

          {/* Add Edge */}
          <div className="flex space-x-1">
            <input
              type="text"
              value={newEdge.source}
              onChange={(e) => setNewEdge({ ...newEdge, source: e.target.value })}
              placeholder="From"
              className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              value={newEdge.target}
              onChange={(e) => setNewEdge({ ...newEdge, target: e.target.value })}
              placeholder="To"
              className="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            {graphType === 'weighted' && (
              <input
                type="number"
                value={newEdge.weight}
                onChange={(e) => setNewEdge({ ...newEdge, weight: e.target.value })}
                placeholder="Weight"
                className="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm"
              />
            )}
            <button
              onClick={handleAddEdge}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Add Edge
            </button>
          </div>

          {/* Start Node Selection */}
          <div className="flex space-x-2">
            <select
              value={selectedStartNode}
              onChange={(e) => setSelectedStartNode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select start node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.id}</option>
              ))}
            </select>
          </div>

          {/* Clear Graph */}
          <div>
            <button
              onClick={clearGraph}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Clear Graph
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          {isRunningBFS && <div className="text-green-600 font-medium">Running BFS...</div>}
          {isRunningDFS && <div className="text-red-600 font-medium">Running DFS...</div>}
          {algorithmExplanation && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-blue-800 dark:text-blue-200 text-sm">
                {algorithmExplanation}
              </div>
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Nodes: {nodes.length} | Edges: {links.length} | Type: {graphType}
          </div>
        </div>

        {/* SVG Container */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <svg ref={svgRef} className="w-full h-96"></svg>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;











