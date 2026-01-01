import { useEffect, useState } from "react";
import { fetchStockLevels, updateStockItem } from "./api";
import type { StockLevel } from "./types";
import "./App.css";

const PAGE_SIZE = 10;

export default function App() {
  const [data, setData] = useState<StockLevel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const openModal = (item: StockLevel) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      await updateStockItem(selectedItem?.stockNo!, selectedItem);
      alert("Saved successfully");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
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

      {/* ===== MODAL ===== */}
      {isModalOpen && selectedItem && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Stock Item</h3>

            <label>
              Stock No
              <input value={selectedItem.stockNo} disabled />
            </label>

            <label>
              Description
              <input value={selectedItem.stockName} disabled />
            </label>

            {/* You can add more fields here later */}

            <div className="modal-actions">
              <button onClick={closeModal} className="secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
