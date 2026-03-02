import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiClient";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/categories");
      const data = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return {
    categories,
    incomeCategories,
    expenseCategories,
    loading,
    refresh: fetchCategories,
  };
}
