function Skeleton({ height = 16, width = "100%", raduis = 8 }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: raduis,
        background: "var(--bg-surface-2)",
        opacity: 0.8,
      }}
    />
  );
}

export default Skeleton;
