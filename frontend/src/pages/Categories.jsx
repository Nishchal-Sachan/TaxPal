import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";
import PageHeader from "../components/ui/PageHeader";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useToast } from "../context/ToastContext";

export default function Categories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/categories");
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/categories/${deleteId}`);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        subtitle="Organize your income and expense types"
      />

      <CategoryForm
        editData={editing}
        clearEdit={() => setEditing(null)}
        onSuccess={fetchCategories}
      />

      <CategoryList
        items={categories}
        loading={loading}
        onEdit={(item) => setEditing(item)}
        onDelete={(id) => setDeleteId(id)}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Category"
        message="Categories used by transactions or budgets cannot be deleted."
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
