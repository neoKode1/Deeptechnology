export default function RoboticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override the opaque body bg so the fixed Spline iframe shows through */}
      <style>{`body { background: transparent !important; }`}</style>
      {children}
    </>
  );
}

