function CardHeader({ title, children }) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div
        className="section-title"
        style={{
          marginBottom: 0,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default CardHeader;
