import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

export default function CategoryForm({
  editData,
  clearEdit,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        type: editData.type,
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleReset = () => {
    setFormData({ name: "", type: "expense" });
    if (editData) clearEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await apiClient.put(
          `/categories/${editData._id}`,
          formData
        );
      } else {
        await apiClient.post("/categories", formData);
      }

      handleReset();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        {editData ? "Edit Category" : "Create Category"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border px-3 py-2"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white"
          >
            {loading
              ? "Processing..."
              : editData
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}