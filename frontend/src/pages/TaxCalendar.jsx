import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/apiClient";
import TaxReminderCard from "../components/tax/TaxReminderCard";

const fallbackReminders = [
  {
    quarter: "Q1",
    title: "Q1 Estimated Payment",
    dueDate: "2026-06-15",
    amount: 30000,
    description: "Pay your estimated taxes for the first quarter.",
  },
  {
    quarter: "Q2",
    title: "Q2 Estimated Payment",
    dueDate: "2026-09-15",
    amount: 30000,
    description: "Pay your estimated taxes for the second quarter.",
  },
  {
    quarter: "Q3",
    title: "Q3 Estimated Payment",
    dueDate: "2027-01-15",
    amount: 30000,
    description: "Pay your estimated taxes for the third quarter.",
  },
  {
    quarter: "Q4",
    title: "Year-End Tax Filing",
    dueDate: "2027-04-15",
    amount: null,
    description: "File your annual tax return.",
  },
];

const TaxCalendar = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/tax/calendar");
        const apiData = response.data;

        let items = [];

        if (Array.isArray(apiData)) {
          items = apiData;
        } else if (Array.isArray(apiData?.data)) {
          items = apiData.data;
        } else if (Array.isArray(apiData?.data?.reminders)) {
          items = apiData.data.reminders;
        }

        if (!items.length) {
          items = fallbackReminders;
        }

        setReminders(items);
      } catch (err) {
        setReminders(fallbackReminders);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <MainLayout>
      <div
        style={{
          padding: "8px 0 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Tax Calendar
            </h1>
            <p
              style={{
                marginTop: "4px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Stay on top of your quarterly estimated tax deadlines.
            </p>
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            Loading tax reminders...
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {reminders.map((reminder) => (
              <TaxReminderCard
                key={reminder.id || reminder.title}
                title={reminder.title}
                quarter={reminder.quarter}
                dueDate={reminder.dueDate}
                amount={reminder.amount}
                description={reminder.description}
              />
            ))}
            {reminders.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "24px",
                  textAlign: "center",
                  color: "#9ca3af",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                }}
              >
                No tax reminders found.
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TaxCalendar;

