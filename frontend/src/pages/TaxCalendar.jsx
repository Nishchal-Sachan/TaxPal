import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/apiClient";
import TaxReminderCard from "../components/tax/TaxReminderCard";

const TaxCalendar = () => {

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiClient.get("/tax/calendar");

      const data = res.data?.data || [];

      setReminders(data);

    } catch (err) {
      console.error("Tax calendar fetch failed:", err);
      setError("Failed to load tax reminders.");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <MainLayout>
      <div style={{ padding: "8px 0 24px" }}>

        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
            Tax Calendar
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Stay on top of your quarterly estimated tax deadlines.
          </p>
        </div>

        {loading && (
          <div style={{
            padding: "24px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px"
          }}>
            Loading tax reminders...
          </div>
        )}

        {error && !loading && (
          <div style={{
            padding: "16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#b91c1c"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && reminders.length === 0 && (
          <div style={{
            padding: "24px",
            textAlign: "center",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px"
          }}>
            No tax reminders found.
          </div>
        )}

        {!loading && !error && reminders.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px"
          }}>
            {reminders.map((reminder) => (
              <TaxReminderCard
                key={reminder.id || reminder.quarter}
                reminder={reminder}
              />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default TaxCalendar;