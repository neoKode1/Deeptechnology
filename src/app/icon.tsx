import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  // Tesseract (hypercube) — a 3D-projected 4D cube
  // Outer cube vertices and inner cube vertices, connected by edges
  const cx = 16, cy = 16; // center
  const outer = 11; // outer cube half-size
  const inner = 5;  // inner cube half-size
  const off = 1.5;  // inner cube offset for 4D perspective

  // Outer cube corners (2D projection)
  const o = [
    [cx - outer, cy - outer], // 0 top-left
    [cx + outer, cy - outer], // 1 top-right
    [cx + outer, cy + outer], // 2 bot-right
    [cx - outer, cy + outer], // 3 bot-left
  ];
  // Inner cube corners (shifted for depth)
  const i = [
    [cx - inner + off, cy - inner + off], // 4
    [cx + inner + off, cy - inner + off], // 5
    [cx + inner + off, cy + inner + off], // 6
    [cx - inner + off, cy + inner + off], // 7
  ];

  // All edges: outer square, inner square, connecting lines
  const edges = [
    // Outer square
    ...[[0,1],[1,2],[2,3],[3,0]].map(([a,b]) => `M${o[a][0]},${o[a][1]}L${o[b][0]},${o[b][1]}`),
    // Inner square
    ...[[0,1],[1,2],[2,3],[3,0]].map(([a,b]) => `M${i[a][0]},${i[a][1]}L${i[b][0]},${i[b][1]}`),
    // Connecting edges (outer to inner)
    ...[[0,0],[1,1],[2,2],[3,3]].map(([a,b]) => `M${o[a][0]},${o[a][1]}L${i[b][0]},${i[b][1]}`),
  ].join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d={edges} stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

