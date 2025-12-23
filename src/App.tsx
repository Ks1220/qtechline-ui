// src/App.tsx
import { useEffect, useState } from "react";
import { fetchStockLevels } from "./api";
import type { StockLevel } from "./types";
import "./App.css";

const PAGE_SIZE = 10;

export default function App() {
  const [data, setData] = useState<StockLevel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockLevels()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pageData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container">
      <h2 className="title">Stock Levels</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Stock No</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, i) => (
              <tr key={i}>
                <td className="mono">{item.stockNo}</td>
                <td>{item.stockName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span>
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
