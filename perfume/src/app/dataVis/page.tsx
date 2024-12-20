"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  season: string;
  color: string;
  connections: number;
  x?: number;
  y?: number;
  angle?: number;
}

interface Link {
  source: string;
  target: string;
  weight: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const topNotes = [
  "bergamot",
  "aldehydes",
  "neroli",
  "mandarin orange",
  "lemon",
  "peach",
  "pink pepper",
];
const middleNotes = [
  "jasmine",
  "rose",
  "ylang-ylang",
  "iris",
  "orange blossom",
  "tuberose",
  "geranium",
];
const baseNotes = [
  "vetiver",
  "vanilla",
  "sandalwood",
  "musk",
  "patchouli",
  "amber",
  "white musk",
  "tonka bean",
  "cedar",
  "oakmoss",
];

const seasonColors: Record<string, string> = {
  Spring: "#7DC352",
  Summer: "#F45DA6",
  Autumn: "#D2691E",
  Winter: "#87CEEB",
};

const selectedNotes: Record<string, string> = {
  bergamot: "Summer",
  aldehydes: "Winter",
  neroli: "Spring",
  "mandarin orange": "Summer",
  lemon: "Summer",
  peach: "Autumn",
  "pink pepper": "Winter",
  jasmine: "Summer",
  rose: "Spring",
  "ylang-ylang": "Summer",
  iris: "Spring",
  "orange blossom": "Spring",
  tuberose: "Summer",
  geranium: "Summer",
  vetiver: "Autumn",
  vanilla: "Winter",
  sandalwood: "Winter",
  musk: "Winter",
  patchouli: "Autumn",
  amber: "Autumn",
  "white musk": "Winter",
  "tonka bean": "Winter",
  cedar: "Autumn",
  oakmoss: "Autumn",
};

const seasonOrder: Record<string, number> = { Spring: 0, Summer: 1, Autumn: 2, Winter: 3 };

const allNotesSorted = Object.keys(selectedNotes).sort((a, b) => {
  const seasonDiff =
    seasonOrder[selectedNotes[a]] - seasonOrder[selectedNotes[b]];
  if (seasonDiff !== 0) return seasonDiff;
  return a.localeCompare(b);
});

const brandThresholds: Record<string, number> = {
  chanel: 23,
  dior: 22,
  "yves-saint-laurent": 21,
  "tom-ford": 8,
  "jo-malone-london": 5,
  gucci: 11,
  default: 20,
};

function RadialNetworkGraphBySeason({
  brand,
  width = 800,
  height = 800,
  highlightCategory,
}: {
  brand?: string;
  width?: number;
  height?: number;
  highlightCategory?: string;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const connectionThreshold = brand
    ? brandThresholds[brand] || brandThresholds.default
    : 40;

  const labelFontSize = brand ? "10px" : "14px";

  useEffect(() => {
    const processData = async () => {
      const rawData = await d3.csv("/top_7_filtered_perfumes.csv");

      const nodesMap: Record<string, Node> = {};
      const links: Link[] = [];

      const filteredData = brand ? rawData.filter((row: any) => row.Brand === brand) : rawData;

      filteredData.forEach((row: any) => {
        const allNotes: string[] = [];
        ["Top", "Middle", "Base"].forEach((column) => {
          if (row[column]) {
            const notes = row[column].split(",").map((n: string) => n.trim().toLowerCase());
            allNotes.push(...notes);
          }
        });

        const uniqueNotes = Array.from(new Set(allNotes.filter((note) => selectedNotes[note])));

        uniqueNotes.forEach((note) => {
          if (!nodesMap[note]) {
            nodesMap[note] = {
              id: note,
              season: selectedNotes[note],
              color: seasonColors[selectedNotes[note]],
              connections: 0,
            };
          }
        });

        for (let i = 0; i < uniqueNotes.length; i++) {
          for (let j = i + 1; j < uniqueNotes.length; j++) {
            const source = uniqueNotes[i];
            const target = uniqueNotes[j];
            const existingLink = links.find(
              (link) =>
                (link.source === source && link.target === target) ||
                (link.source === target && link.target === source)
            );
            if (existingLink) {
              existingLink.weight++;
            } else {
              links.push({ source, target, weight: 1 });
            }
            nodesMap[source].connections++;
            nodesMap[target].connections++;
          }
        }
      });

      const filteredLinks = links.filter((link) => link.weight > connectionThreshold);
      const filteredNodes = Object.values(nodesMap).filter((node) =>
        filteredLinks.some((link) => link.source === node.id || link.target === node.id)
      );

      setData({ nodes: filteredNodes, links: filteredLinks });
    };

    processData();
  }, [brand, connectionThreshold]);

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0 || data.links.length === 0) return;

    const radius = Math.min(width, height) / 2.6667;
    const labelRadius = radius + 20;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("font", "10px sans-serif");

    svg.selectAll("*").remove();

    const angleStep = (2 * Math.PI) / allNotesSorted.length;
    const notePositions: Record<string, { x: number; y: number; angle: number }> = {};
    allNotesSorted.forEach((note, i) => {
      const angle = i * angleStep;
      const x = width / 2 + radius * Math.cos(angle);
      const y = height / 2 + radius * Math.sin(angle);
      notePositions[note] = { x, y, angle };
    });

    const filteredNodes = data.nodes;
    const filteredLinks = data.links;

    const maxWeight = d3.max(filteredLinks, (link) => link.weight) || 1;

    const hoveredNodeData = highlightedNode
      ? filteredNodes.find((n) => n.id === highlightedNode)
      : null;
    const hoveredNodeColor = hoveredNodeData ? hoveredNodeData.color : null;

    const highlightColors: Record<string, string> = {
      top: "#5F156E",
      middle: "#5B21A2",
      base: "#7F4CD6",
    };

    const highlightedNotes =
      highlightCategory === "top"
        ? topNotes
        : highlightCategory === "middle"
          ? middleNotes
          : highlightCategory === "base"
            ? baseNotes
            : [];

    // Links
    svg.append("g")
      .selectAll("line")
      .data(filteredLinks)
      .join("line")
      .attr("stroke", (d) => {
        if (
          highlightedNode &&
          (d.source === highlightedNode || d.target === highlightedNode) &&
          hoveredNodeColor
        ) {
          return hoveredNodeColor;
        }
        return "#DFDFDF";
      })
      .attr("stroke-opacity", 1)
      .attr("stroke-width", (d) => (d.weight / maxWeight) * 4 + 1)
      .attr("x1", (d) => notePositions[d.source].x)
      .attr("y1", (d) => notePositions[d.source].y)
      .attr("x2", (d) => notePositions[d.target].x)
      .attr("y2", (d) => notePositions[d.target].y);

    // Nodes
    svg.append("g")
      .selectAll("circle")
      .data(filteredNodes)
      .join("circle")
      .attr("r", (d) => (d.id === highlightedNode ? 8 : 6))
      .attr("cx", (d) => notePositions[d.id].x)
      .attr("cy", (d) => notePositions[d.id].y)
      .attr("fill", (d) => {
        if (highlightCategory && highlightCategory !== "none" && highlightedNotes.length > 0) {
          return highlightedNotes.includes(d.id) ? highlightColors[highlightCategory] : "#D3D3D3";
        } else {
          return d.color;
        }
      })
      .attr("stroke", (d) => (d.id === selectedNode ? "#333" : "#fff"))
      .attr("stroke-width", 1.5)
      .on("mouseover", (event, d) => setHighlightedNode(d.id))
      .on("mouseout", () => setHighlightedNode(null))
      .on("click", (event, d) => setSelectedNode(d.id === selectedNode ? null : d.id));

    // Labels
    svg.append("g")
      .selectAll("text")
      .data(filteredNodes)
      .join("text")
      .attr("font-size", labelFontSize)
      .attr("dy", "0.35em")
      .attr("transform", (d) => {
        const { angle } = notePositions[d.id];
        const angleDeg = (angle * 180) / Math.PI;
        const x = notePositions[d.id].x + (labelRadius - radius) * Math.cos(angle);
        const y = notePositions[d.id].y + (labelRadius - radius) * Math.sin(angle);
        let rotate = angleDeg;
        if (angleDeg > 90 && angleDeg < 270) {
          rotate = angleDeg + 180;
        }
        return `translate(${x}, ${y}) rotate(${rotate})`;
      })
      .text((d) => d.id)
      .each(function (d) {
        const angleDeg = ((notePositions[d.id].angle || 0) * 180) / Math.PI;
        const t = d3.select(this);
        if (angleDeg > 90 && angleDeg < 270) {
          t.attr("text-anchor", "end");
        } else {
          t.attr("text-anchor", "start");
        }
      });
  }, [data, highlightedNode, selectedNode, brand, width, height, labelFontSize, highlightCategory]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}

export default function Page() {
  const brands = [
    "chanel",
    "dior",
    "yves-saint-laurent",
    "tom-ford",
    "jo-malone-london",
    "gucci"
  ];

  const [highlightCategory, setHighlightCategory] = useState<string>("none");

  const buttonStyle: React.CSSProperties = {
    margin: "0 10px",
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s",
  };

  const activeButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#d0d0d0",
    fontWeight: "bold",
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      {/* Background Image */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          opacity: 0.3
        }}
      ></div>

      {/* Main Title with some margin */}
      <h2 style={{ textAlign: "center", marginTop: "40px", marginBottom: "20px", fontSize: "24px" }}>
        Radial Network Graph for Perfume Note
      </h2>

      {/* Buttons below the main title */}
      <div style={{ textAlign: "center", marginBottom: "20px", zIndex: 1, position: "relative" }}>
        <button
          style={highlightCategory === "top" ? activeButtonStyle : buttonStyle}
          onClick={() => setHighlightCategory("top")}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
          onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            highlightCategory === "top" ? "#d0d0d0" : "#f0f0f0")
          }
        >
          Top Note
        </button>
        <button
          style={highlightCategory === "middle" ? activeButtonStyle : buttonStyle}
          onClick={() => setHighlightCategory("middle")}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
          onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            highlightCategory === "middle" ? "#d0d0d0" : "#f0f0f0")
          }
        >
          Middle Note
        </button>
        <button
          style={highlightCategory === "base" ? activeButtonStyle : buttonStyle}
          onClick={() => setHighlightCategory("base")}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
          onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            highlightCategory === "base" ? "#d0d0d0" : "#f0f0f0")
          }
        >
          Base Note
        </button>
        <button
          style={highlightCategory === "none" ? activeButtonStyle : buttonStyle}
          onClick={() => setHighlightCategory("none")}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
          onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            highlightCategory === "none" ? "#d0d0d0" : "#f0f0f0")
          }
        >
          Clear
        </button>
      </div>

      {/* Main (All Brands) Graph */}
      <div style={{ margin: "20px auto", width: "900px", position: "relative", zIndex: 1 }}>
        <RadialNetworkGraphBySeason width={800} height={800} highlightCategory={highlightCategory} />
      </div>

      {/* Brand-specific Graphs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          justifyItems: "center",
          margin: "10 auto",
          padding: "0px",
          position: "relative",
          zIndex: 1
        }}
      >
        {brands.map((brand) => (
          <div key={brand}>
            <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "16px" }}>
              {brand}
            </h2>
            <RadialNetworkGraphBySeason
              brand={brand}
              width={500}
              height={500}
              highlightCategory={highlightCategory}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
