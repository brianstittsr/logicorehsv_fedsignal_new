"use client";

import { useState } from "react";

// ── Graph data ──────────────────────────────────────────────────────────────
type NodeType = "university" | "faculty" | "topic" | "grant" | "agency";

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

const nodes: GraphNode[] = [
  // University (center)
  { id: "tu", label: "Tuskegee University", type: "university", x: 480, y: 230 },

  // Faculty
  { id: "f1", label: "Dr. Chen\nAI/ML", type: "faculty", x: 200, y: 100 },
  { id: "f2", label: "Dr. Okafor\nCybersecurity", type: "faculty", x: 760, y: 100 },
  { id: "f3", label: "Dr. Patel\nEnergy Systems", type: "faculty", x: 200, y: 360 },
  { id: "f4", label: "Dr. Williams\nBiomedical", type: "faculty", x: 760, y: 360 },

  // Research Topics
  { id: "t1", label: "AI & Machine\nLearning", type: "topic", x: 100, y: 220 },
  { id: "t2", label: "Network\nSecurity", type: "topic", x: 860, y: 220 },
  { id: "t3", label: "Renewable\nEnergy", type: "topic", x: 340, y: 420 },
  { id: "t4", label: "Health\nDisparities", type: "topic", x: 620, y: 420 },

  // Grants
  { id: "g1", label: "NSF AI Grant\n$1.4M", type: "grant", x: 150, y: 330 },
  { id: "g2", label: "NSA Cyber\n$750K", type: "grant", x: 810, y: 330 },
  { id: "g3", label: "DoE HBCU\n$2.1M", type: "grant", x: 340, y: 130 },
  { id: "g4", label: "NIH Research\n$3.2M", type: "grant", x: 620, y: 130 },

  // Agencies
  { id: "a1", label: "NSF", type: "agency", x: 60, y: 430 },
  { id: "a2", label: "NSA / DoD", type: "agency", x: 900, y: 430 },
  { id: "a3", label: "Dept. of\nEnergy", type: "agency", x: 260, y: 490 },
  { id: "a4", label: "NIH", type: "agency", x: 700, y: 490 },
];

const edges: GraphEdge[] = [
  // University → Faculty
  { from: "tu", to: "f1", label: "EMPLOYS" },
  { from: "tu", to: "f2", label: "EMPLOYS" },
  { from: "tu", to: "f3", label: "EMPLOYS" },
  { from: "tu", to: "f4", label: "EMPLOYS" },
  // Faculty → Topics
  { from: "f1", to: "t1", label: "RESEARCHES" },
  { from: "f2", to: "t2", label: "RESEARCHES" },
  { from: "f3", to: "t3", label: "RESEARCHES" },
  { from: "f4", to: "t4", label: "RESEARCHES" },
  // Faculty → Grants
  { from: "f1", to: "g1", label: "HOLDS" },
  { from: "f2", to: "g2", label: "HOLDS" },
  { from: "f3", to: "g3", label: "HOLDS" },
  { from: "f4", to: "g4", label: "HOLDS" },
  // Grants → Agencies
  { from: "g1", to: "a1", label: "FUNDED_BY" },
  { from: "g2", to: "a2", label: "FUNDED_BY" },
  { from: "g3", to: "a3", label: "FUNDED_BY" },
  { from: "g4", to: "a4", label: "FUNDED_BY" },
  // Topics → Agencies (opportunity alignment)
  { from: "t1", to: "a2", label: "ALIGNED" },
  { from: "t3", to: "a3", label: "ALIGNED" },
];

const nodeStyles: Record<NodeType, { fill: string; stroke: string; textColor: string; r: number }> = {
  university: { fill: "#1a56db", stroke: "#1549c0", textColor: "#fff", r: 38 },
  faculty:    { fill: "#7c3aed", stroke: "#6d28d9", textColor: "#fff", r: 28 },
  topic:      { fill: "#0e7490", stroke: "#0c6680", textColor: "#fff", r: 26 },
  grant:      { fill: "#15803d", stroke: "#166534", textColor: "#fff", r: 26 },
  agency:     { fill: "#92400e", stroke: "#78350f", textColor: "#fff", r: 22 },
};

const legend: { type: NodeType; label: string }[] = [
  { type: "university", label: "University" },
  { type: "faculty",    label: "Faculty" },
  { type: "topic",      label: "Research Topic" },
  { type: "grant",      label: "Grant" },
  { type: "agency",     label: "Agency" },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CapabilitiesPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const W = 960;
  const H = 560;

  return (
    <div className="space-y-4">
      {/* Graph card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden border-t-2 border-t-[#1a56db]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f1f5f9]">
          <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#1a56db]">
            University Capability Graph — Neo4j Visualization
          </span>
          <button
            className="text-[11px] font-bold px-3 py-1.5 rounded border border-[#1a56db] text-[#1a56db] hover:bg-blue-50 tracking-wide transition-colors"
            onClick={() => setSelected(null)}
          >
            LAUNCH GRAPH EXPLORER
          </button>
        </div>

        {/* SVG Graph */}
        <div className="relative bg-[#f8faff] overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ minHeight: 420, maxHeight: 560 }}
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const from = getNode(edge.from);
              const to = getNode(edge.to);
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              const isActive =
                hovered === edge.from || hovered === edge.to ||
                selected?.id === edge.from || selected?.id === edge.to;
              return (
                <g key={i}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={isActive ? "#1a56db" : "#cbd5e1"}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={isActive ? "none" : "4 3"}
                    markerEnd="url(#arrow)"
                    opacity={isActive ? 1 : 0.6}
                  />
                  <text
                    x={mx} y={my - 4}
                    textAnchor="middle"
                    fontSize={9}
                    fill={isActive ? "#1a56db" : "#94a3b8"}
                    fontWeight={isActive ? "bold" : "normal"}
                    style={{ userSelect: "none" }}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const s = nodeStyles[node.type];
              const isHov = hovered === node.id;
              const isSel = selected?.id === node.id;
              const lines = node.label.split("\n");
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(isSel ? null : node)}
                >
                  <circle
                    r={s.r + (isHov || isSel ? 4 : 0)}
                    fill={s.fill}
                    stroke={isSel ? "#fbbf24" : s.stroke}
                    strokeWidth={isSel ? 3 : 1.5}
                    opacity={0.92}
                    style={{ transition: "r 0.15s" }}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      y={(li - (lines.length - 1) / 2) * 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={node.type === "university" ? 10 : 9}
                      fontWeight="bold"
                      fill={s.textColor}
                      style={{ userSelect: "none", pointerEvents: "none" }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-[#f1f5f9]">
          {legend.map((l) => (
            <div key={l.type} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: nodeStyles[l.type].fill }}
              />
              <span className="text-[11px] text-[#64748b]">{l.label}</span>
            </div>
          ))}
          <span className="ml-auto text-[11px] text-[#94a3b8]">
            Faculty → Research Topics → Grants → Agencies · Interactive visualization
          </span>
        </div>
      </div>

      {/* Selected node detail panel */}
      {selected && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm px-5 py-4 flex items-start gap-4">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: nodeStyles[selected.type].fill }}
          >
            {selected.label.split("\n")[0][0]}
          </span>
          <div>
            <div className="text-sm font-bold text-[#0f172a]">{selected.label.replace("\n", " ")}</div>
            <div className="text-[11px] text-[#64748b] mt-0.5 capitalize">{selected.type} node</div>
            <div className="text-[12px] text-[#334155] mt-2">
              {selected.type === "university" && "Hub of all capability relationships. Connected to 4 faculty members across AI/ML, Cybersecurity, Energy, and Biomedical domains."}
              {selected.type === "faculty" && "Active researcher with linked grants and research topics. Click connected edges to explore relationships."}
              {selected.type === "topic" && "Research domain with active agency alignment. Linked to funding opportunities and federal contracts."}
              {selected.type === "grant" && "Active federal award. Connected to sponsoring agency and PI faculty member."}
              {selected.type === "agency" && "Federal funding agency. Sponsoring active grants and aligned research topics at Tuskegee."}
            </div>
          </div>
          <button
            className="ml-auto text-[#94a3b8] hover:text-[#64748b] text-lg leading-none"
            onClick={() => setSelected(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
