type Props = { size?: number; className?: string };

/**
 * Deterministic QR-code-like visual placeholder for the single general
 * InoLab access code. This is NOT a scannable QR code — it is a static
 * decorative graphic that represents the concept of the general QR code.
 */
export function QrCode({ size = 120, className = '' }: Props) {
  const grid = 21;
  const cell = size / grid;
  const pattern = generatePattern(grid);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR Code geral do InoLab"
    >
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#1c2024"
            />
          ) : null,
        ),
      )}
      {/* Finder squares */}
      {[
        { x: 0, y: 0 },
        { x: grid - 7, y: 0 },
        { x: 0, y: grid - 7 },
      ].map((pos, i) => (
        <g key={i}>
          <rect x={pos.x * cell} y={pos.y * cell} width={7 * cell} height={7 * cell} fill="#1c2024" />
          <rect x={(pos.x + 1) * cell} y={(pos.y + 1) * cell} width={5 * cell} height={5 * cell} fill="white" />
          <rect x={(pos.x + 2) * cell} y={(pos.y + 2) * cell} width={3 * cell} height={3 * cell} fill="#1c2024" />
        </g>
      ))}
    </svg>
  );
}

function generatePattern(grid: number): boolean[][] {
  const pattern: boolean[][] = [];
  const seed = 'inolab-inopetro-general-access';
  for (let r = 0; r < grid; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < grid; c++) {
      const hash = simpleHash(seed + r + '_' + c);
      row.push(hash % 3 === 0);
    }
    pattern.push(row);
  }
  // Clear areas around finder squares
  [[0, 0], [grid - 7, 0], [0, grid - 7]].forEach(([fx, fy]) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const rr = fy + r;
        const cc = fx + c;
        if (rr < grid && cc < grid && rr >= 0 && cc >= 0) {
          pattern[rr][cc] = false;
        }
      }
    }
  });
  return pattern;
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
