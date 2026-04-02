import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Budgets from "./pages/Budgets";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaxCalendar from "./pages/TaxCalendar";
import TaxEstimator from "./pages/TaxEstimator";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import { getToken } from "./utils/auth";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = getToken();
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Budgets />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Categories />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tax-estimator"
          element={
            <ProtectedRoute>
              <TaxEstimator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tax-calendar"
          element={
            <ProtectedRoute>
              <TaxCalendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
