import Navbar from "./Navbar";

function Layout({
  children,
  title = "Finance Dashboard",
  subtitle = "Manage your money smarter",
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">F</div>
          <div>
            <div className="sidebar-brand-text">Finance</div>
            <div className="sidebar-brand-sub">Personal tracker</div>
          </div>
        </div>
        <Navbar />
      </aside>

      <main className="main-content">
        <div className="page-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export default Layout;
