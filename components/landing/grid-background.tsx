"use client";

export function GridBackground() {
  return (
    <>
      {/* Fine dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, oklch(0.35 0.02 260 / 0.35) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Cyan top bloom */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% -10%, oklch(0.75 0.15 195 / 0.1), transparent),
            radial-gradient(ellipse 50% 35% at 75% 65%, oklch(0.78 0.14 75 / 0.06), transparent)
          `,
        }}
      />

      {/* Edge vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 120% at 50% 50%, transparent 55%, oklch(0.06 0.01 260 / 0.9) 100%)`,
        }}
      />
    </>
  );
}
