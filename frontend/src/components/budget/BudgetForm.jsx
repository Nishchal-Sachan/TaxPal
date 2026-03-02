import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useCategories } from "../../hooks/useCategories";

export default function BudgetForm({
  onBudgetAdded,
  onBudgetUpdated,
  editData,
  clearEdit,
}) {
  const { expenseCategories } = useCategories();
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        category: editData.category,
        limit: editData.limit,
        month: editData.month,
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleReset = () => {
    setFormData({ category: "", limit: "", month: "" });
    if (editData) clearEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        category: formData.category,
        limit: Number(formData.limit),
        month: formData.month,
      };

      if (editData) {
        await apiClient.put(`/budgets/${editData._id}`, payload);

        if (onBudgetUpdated) {
          onBudgetUpdated(payload.month);
        }
      } else {
        await apiClient.post("/budgets", payload);

        if (onBudgetAdded) {
          onBudgetAdded(payload.month);
        }
      }

      handleReset();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>
        {editData ? "Update Budget" : "Create New Budget"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="budget-form-grid">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {[
                ...expenseCategories,
                ...(formData.category &&
                !expenseCategories.some((c) => c.name === formData.category)
                  ? [{ _id: "legacy", name: formData.category }]
                  : []),
              ].map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Budget Amount</label>
            <input
              type="number"
              name="limit"
              className="form-input"
              value={formData.limit}
              onChange={handleChange}
              required
              min="1"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group" style={{ width: "48.5%" }}>
          <label className="form-label">Month</label>
          <input
            type="month"
            name="month"
            className="form-input"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 40px",
              borderRadius: "6px",
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Processing..."
              : editData
                ? "Update Budget"
                : "Create Budget"}
          </button>
        </div>
      </form>
    </div>
  );
}
