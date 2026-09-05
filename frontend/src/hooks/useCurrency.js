import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../utils/format";

export const useCurrency = () => {
  const { user } = useAuth();
  const country = user?.country || "United States";

  return {
    country,
    format: (amount) => formatCurrency(amount, country),
  };
};
