# 🌳 DSA Visualizer

An interactive web application for visualizing Data Structures and Algorithms, built with React, TypeScript, and D3.js. Perfect for students, educators, and developers who want to understand algorithms through visual learning.

![DSA Visualizer Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![D3.js](https://img.shields.io/badge/D3.js-7.8.5-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-cyan)

## ✨ Features

### 🔗 Graph Algorithms
- **Breadth-First Search (BFS)** - Level-by-level exploration with step-by-step explanations
- **Depth-First Search (DFS)** - Deep exploration with backtracking visualization
- **Interactive Graph Builder** - Create directed/undirected graphs with custom nodes and edges
- **Real-time Algorithm Explanations** - Understand what's happening at each step

### 🌲 Tree Visualizations
- **Binary Search Tree (BST)** - Automatic insertion following BST rules
- **Binary Tree** - Manual node placement with full control over structure
- **Tree Traversals**:
  - Pre-order Traversal
  - In-order Traversal  
  - Post-order Traversal
- **Interactive Tree Building** - Click to select parent nodes and choose insertion positions

### 🕸️ Minimum Spanning Tree
- **Kruskal's Algorithm** - Edge-based MST construction
- **Prim's Algorithm** - Vertex-based MST construction
- **Weighted Graph Support** - Visual edge weights and cost calculations

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Step-by-Step Animations** - Smooth transitions and highlighting
- **Algorithm Explanations** - Detailed descriptions with time/space complexity
- **Learning Resources** - Curated links to additional learning materials

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-visualizer.git
   cd dsa-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production
```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Graph Algorithms
1. **Create a Graph**: Add nodes by entering values and clicking "Add Node"
2. **Connect Nodes**: Add edges by specifying source and target nodes
3. **Choose Algorithm**: Select BFS or DFS
4. **Watch & Learn**: Follow the step-by-step execution with explanations

### Tree Structures
1. **Select Mode**: Choose between BST (automatic) or Binary Tree (manual)
2. **Build Your Tree**: 
   - **BST Mode**: Simply enter values - they'll be placed automatically
   - **Binary Tree Mode**: Click nodes to select parents, choose left/right position
3. **Explore Traversals**: Run different traversal algorithms to see the order

### Minimum Spanning Tree
1. **Create Weighted Graph**: Add nodes and weighted edges
2. **Run Algorithm**: Choose Kruskal's or Prim's algorithm
3. **See the MST**: Watch as the minimum spanning tree is constructed

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Visualization**: D3.js 7.8.5
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Build Tool**: Vite 5.4.2
- **Code Quality**: ESLint + TypeScript ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── GraphVisualizer.tsx      # Graph algorithms visualization
│   ├── TreeVisualizer.tsx       # Tree structures visualization
│   ├── MSTVisualizer.tsx        # MST algorithms visualization
│   ├── AlgorithmExplanation.tsx # Algorithm details and complexity
│   ├── ThemeToggle.tsx          # Dark/light theme switcher
│   └── LearningResources.tsx    # Educational resources
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## 🎓 Educational Value

This project is designed to help users understand:

- **Algorithm Complexity**: Visual representation of time and space complexity
- **Step-by-Step Execution**: See exactly how algorithms work internally
- **Data Structure Properties**: Understand the characteristics of different structures
- **Practical Applications**: Learn when and why to use specific algorithms

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution
- Additional algorithms (Dijkstra's, A*, etc.)
- More data structures (Heaps, Hash Tables, etc.)
- Performance optimizations
- UI/UX improvements
- Educational content and explanations

## 🙏 Acknowledgments

- **D3.js Community** - For the powerful visualization library
- **React Team** - For the excellent frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Educational Resources** - Inspired by various algorithm visualization tools

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for the programming community

[Live Demo](https://algocanvas.netlify.app/)

</div>
