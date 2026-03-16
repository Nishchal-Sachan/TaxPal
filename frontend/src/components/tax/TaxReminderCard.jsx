const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
};

const TaxReminderCard = ({ reminder }) => {
  if (!reminder) return null;

  const title = reminder.title ?? "";
  const quarter = reminder.quarter ?? "";
  const dueDate = reminder.dueDate ?? "";
  const amount = reminder.amount ?? 0;
  const description = reminder.description ?? "";

  return (
    <div
      className="tax-reminder-card"
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {title}
          </h3>
          {quarter && (
            <span
              style={{
                display: "inline-block",
                marginTop: "4px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#4b5563",
              }}
            >
              {quarter}
            </span>
          )}
        </div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#6b7280",
            }}
          >
            Due
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1d4ed8",
            }}
          >
            {formatDate(dueDate)}
          </div>
        </div>
      </div>

      {description && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {description}
        </p>
      )}

      {(typeof amount === "number" || (typeof amount === "string" && !isNaN(Number(amount)))) && (
        <div
          style={{
            marginTop: "4px",
            fontSize: "13px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Amount:{" "}
          <span style={{ color: "#16a34a" }}>
            ₹{Number(amount).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaxReminderCard;

