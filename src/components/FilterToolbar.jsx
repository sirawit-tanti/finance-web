function FilterToolbar({ children }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "180px minmax(240px, 1fr) auto auto",
        gap: 12,
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

export default FilterToolbar;
