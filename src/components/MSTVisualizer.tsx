import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
  inMST?: boolean;
}

interface MSTVisualizerProps {
  onAlgorithmChange?: (algorithm: string) => void;
}

const MSTVisualizer: React.FC<MSTVisualizerProps> = ({ onAlgorithmChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<'kruskal' | 'prim' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Sample data with weighted edges
  const nodes: Node[] = [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
  ];

  const links: Link[] = [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'B', target: 'C', weight: 8 },
    { source: 'C', target: 'D', weight: 7 },
    { source: 'D', target: 'E', weight: 9 },
    { source: 'E', target: 'F', weight: 10 },
    { source: 'F', target: 'A', weight: 2 },
    { source: 'B', target: 'D', weight: 3 },
    { source: 'C', target: 'F', weight: 6 },
    { source: 'A', target: 'D', weight: 5 },
  ];

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

    // Create simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(d => d.weight * 20))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4');

    // Draw weight labels
    const weightLabels = svg.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .text(d => d.weight)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .style('font-weight', 'bold');

    // Draw nodes
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    nodeGroup.append('circle')
      .attr('r', 20)
      .attr('fill', '#4f46e5')
      .attr('stroke', '#312e81')
      .attr('stroke-width', 2);

    nodeGroup.append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Reset visualization
    const resetVisualization = () => {
      links.forEach(l => l.inMST = false);
      setTotalCost(0);
      setCurrentStep(0);
      
      link
        .transition()
        .duration(500)
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');

      nodeGroup.select('circle')
        .transition()
        .duration(500)
        .attr('fill', '#4f46e5')
        .attr('r', 20);
    };

    // Union-Find data structure for Kruskal's algorithm
    class UnionFind {
      private parent: Map<string, string> = new Map();
      private rank: Map<string, number> = new Map();

      constructor(nodes: Node[]) {
        nodes.forEach(node => {
          this.parent.set(node.id, node.id);
          this.rank.set(node.id, 0);
        });
      }

      find(node: string): string {
        if (this.parent.get(node) !== node) {
          this.parent.set(node, this.find(this.parent.get(node)!));
        }
        return this.parent.get(node)!;
      }

      union(x: string, y: string): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false;

        const rankX = this.rank.get(rootX)!;
        const rankY = this.rank.get(rootY)!;

        if (rankX < rankY) {
          this.parent.set(rootX, rootY);
        } else if (rankX > rankY) {
          this.parent.set(rootY, rootX);
        } else {
          this.parent.set(rootY, rootX);
          this.rank.set(rootX, rankX + 1);
        }
        return true;
      }
    }

    // Kruskal's Algorithm implementation
    const runKruskal = async () => {
      resetVisualization();
      onAlgorithmChange?.('kruskal');
      
      const uf = new UnionFind(nodes);
      let cost = 0;
      let step = 0;

      const sortedLinks = [...links].sort((a, b) => a.weight - b.weight);

      for (const l of sortedLinks) {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;

        if (uf.union(sourceId, targetId)) {
          l.inMST = true;
          cost += l.weight;
          step++;

          setCurrentStep(step);
          setTotalCost(cost);

          // Highlight nodes
          nodeGroup
            .filter(d => d.id === sourceId || d.id === targetId)
            .select('circle')
            .transition()
            .duration(500)
            .attr('fill', '#22c55e')
            .attr('r', 24);

          // Highlight edge
          link
            .filter(d => d === l)
            .transition()
            .duration(500)
            .attr('stroke', '#22c55e')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', 'none');

          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setIsRunning(false);
    };

    // Prim's Algorithm implementation
    const runPrim = async () => {
      resetVisualization();
      onAlgorithmChange?.('prim');
      
      const visited = new Set<string>();
      let cost = 0;
      let step = 0;
      
      // Start with node A
      visited.add('A');
      nodeGroup
        .filter(d => d.id === 'A')
        .select('circle')
        .transition()
        .duration(500)
        .attr('fill', '#22c55e')
        .attr('r', 24);

      await new Promise(resolve => setTimeout(resolve, 1000));

      while (visited.size < nodes.length) {
        let minEdge: Link | null = null;
        let minWeight = Infinity;

        // Find minimum weight edge from visited to unvisited nodes
        for (const l of links) {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;

          if ((visited.has(sourceId) && !visited.has(targetId)) ||
              (visited.has(targetId) && !visited.has(sourceId))) {
            if (l.weight < minWeight) {
              minWeight = l.weight;
              minEdge = l;
            }
          }
        }

        if (minEdge) {
          const sourceId = typeof minEdge.source === 'string' ? minEdge.source : minEdge.source.id;
          const targetId = typeof minEdge.target === 'string' ? minEdge.target : minEdge.target.id;
          const newNode = visited.has(sourceId) ? targetId : sourceId;

          visited.add(newNode);
          minEdge.inMST = true;
          cost += minEdge.weight;
          step++;

          setCurrentStep(step);
          setTotalCost(cost);

          // Highlight new node
          nodeGroup
            .filter(d => d.id === newNode)
            .select('circle')
            .transition()
            .duration(500)
            .attr('fill', '#22c55e')
            .attr('r', 24);

          // Highlight edge
          link
            .filter(d => d === minEdge)
            .transition()
            .duration(500)
            .attr('stroke', '#22c55e')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', 'none');

          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setIsRunning(false);
    };

    // Create control buttons
    const createButton = (text: string, x: number, onClick: () => void, disabled: boolean = false) => {
      const button = svg.append('g')
        .attr('transform', `translate(${x}, ${height - 60})`)
        .style('cursor', disabled ? 'not-allowed' : 'pointer')
        .style('opacity', disabled ? 0.5 : 1)
          if (!disabled) {
        button.on('click', onClick);
      }

      button.append('rect')
        .attr('width', 160)
        .attr('height', 40)
        .attr('rx', 8)
        .attr('fill', disabled ? '#9ca3af' : '#4f46e5');

      if (!disabled) {
        button.select('rect')
          .on('mouseover', function() {
            d3.select(this).transition().duration(200).attr('fill', '#6366f1');
          })
          .on('mouseout', function() {
            d3.select(this).transition().duration(200).attr('fill', '#4f46e5');
          });
      }

      button.append('text')
        .attr('x', 80)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('pointer-events', 'none')
        .text(text);
    };

    // Control buttons
    createButton('Reset', 20, () => {
      if (!isRunning) {
        resetVisualization();
        setAlgorithm(null);
        onAlgorithmChange?.('');
      }
    }, isRunning);

    createButton('Run Kruskal\'s', 200, async () => {
      if (!isRunning) {
        setIsRunning(true);
        setAlgorithm('kruskal');
        await runKruskal();
      }
    }, isRunning);

    createButton('Run Prim\'s', 380, async () => {
      if (!isRunning) {
        setIsRunning(true);
        setAlgorithm('prim');
        await runPrim();
      }
    }, isRunning);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      weightLabels
        .attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
        .attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2);

      nodeGroup
        .attr('transform', d => `translate(${d.x},${d.y})`);
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
  }, [onAlgorithmChange]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Minimum Spanning Tree Visualization
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Watch how Kruskal's and Prim's algorithms find the minimum spanning tree step by step.
        </p>

        {/* Status Display */}
        {isRunning && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Running {algorithm === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm...
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-blue-600 dark:text-blue-300">
                  Step: {currentStep}
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-300">
                  Total Cost: {totalCost}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Visualization Area */}
        <div className="w-full aspect-video bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
          <svg ref={svgRef} className="w-full h-full" />
        </div>

        {/* Algorithm Info */}
        {algorithm && !isRunning && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              {algorithm === 'kruskal' ? "Kruskal's" : "Prim's"} Algorithm Complete!
            </h3>
            <div className="text-sm text-green-700 dark:text-green-300">
              <p>Total edges in MST: {currentStep}</p>
              <p>Total cost: {totalCost}</p>
              <p>
                {algorithm === 'kruskal' 
                  ? "Kruskal's algorithm sorts all edges and adds them if they don't create a cycle."
                  : "Prim's algorithm starts from a vertex and grows the MST by adding minimum weight edges."
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MSTVisualizer;






