import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/categories");
      setCategories(res.data.data || []);
    } catch {
      console.error("Fetch failed");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await apiClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 className="mb-6 text-2xl font-bold">Category Management</h1>

      <CategoryForm
        editData={editing}
        clearEdit={() => setEditing(null)}
        onSuccess={fetchCategories}
      />

      <div className="mt-8">
        <CategoryList
          items={categories}
          loading={loading}
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}