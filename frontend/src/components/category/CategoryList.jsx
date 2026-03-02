import CategoryCard from "./CategoryCard";

export default function CategoryList({
  items,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
        No categories found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CategoryCard
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}