export default function CategoryCard({
  item,
  onEdit,
  onDelete,
}) {
  const badgeColor =
    item.type === "income"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-slate-800">
          {item.name}
        </h4>

        <span
          className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${badgeColor}`}
        >
          {item.type}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(item)}
          className="text-blue-600 font-medium"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item._id)}
          className="text-red-600 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}