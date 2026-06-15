import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ meta, page, onPageChange, perPage, onPerPageChange }) {
  if (!meta) {
    return null;
  }

  return (
    <div className="pagination">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <select
          className="form-select"
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          style={{ width: 90 }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span>
          Showing {meta.from ?? 0} - {meta.to ?? 0} of {meta.total ?? 0} rows
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className="btn btn-ghost btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>

        <span>
          Page {meta.current_page} of {meta.last_page}
        </span>

        <button
          className="btn btn-ghost btn-sm"
          disabled={page >= meta.last_page}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
