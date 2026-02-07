import { useEffect, useState } from "react";
import { fetchSqlStockItem, fetchStockLevels, saveStockItem } from "./api";
import type { StockLevel } from "./types";
import "./App.css";

const PAGE_SIZE = 10;

export default function App() {
  const MAX_VISIBLE_PAGES = 10;

  const [data, setData] = useState<StockLevel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedItem, setSelectedItem] = useState<StockLevel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStockLevels()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pageData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openModal = async (item: StockLevel) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      const sqlStock = await fetchSqlStockItem(item?.stockNo!);

      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              stockLevel: sqlStock,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert("Failed to load stock details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      setSaving(true);
      await saveStockItem(selectedItem?.stockNo!, selectedItem);
      alert("Saved successfully");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const getVisiblePages = () => {
    const start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="container">
      <h2 className="title">Stock Levels</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Stock No</th>
              <th>Description</th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((item) => (
              <tr key={item.stockNo}>
                <td className="mono">{item.stockNo}</td>
                <td>{item.stockName}</td>
                <td className="actions">
                  <button className="dots-btn" onClick={() => openModal(item)}>
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={page <= 10}
          onClick={() => setPage((p) => Math.max(1, p - 10))}
        >
          «
        </button>

        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ‹
        </button>

        {getVisiblePages().map((p) => (
          <button
            key={p}
            className={p === page ? "active" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          ›
        </button>

        <button
          disabled={page + 10 > totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 10))}
        >
          »
        </button>
      </div>

      {/* ===== MODAL ===== */}
      {isModalOpen && selectedItem && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Stock Item</h3>

            {modalLoading ? (
              <p className="loading">Loading stock details...</p>
            ) : (
              <>
                <label>
                  Stock No
                  <input value={selectedItem.stockNo} disabled />
                </label>

                <label>
                  Description
                  <input value={selectedItem.stockName} disabled />
                </label>

                <label>
                  Stock Level
                  <input
                    value={selectedItem.stockLevel ?? ""}
                    onChange={(e) =>
                      setSelectedItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              stockLevel: e.target.value,
                            }
                          : prev
                      )
                    }
                  />
                </label>
              </>
            )}

            <div className="modal-actions">
              <button onClick={closeModal} className="secondary">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
