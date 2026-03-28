import React, { useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const DownloadButton = ({ type = "pdf", period }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!period) return alert("Please select a period");

    try {
      setLoading(true);

      const response = await axios.get(
        `/reports/export?type=${type}&period=${period}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `report-${period}.${type}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      <FaDownload />
      {loading ? "Downloading..." : "Download"}
    </button>
  );
};

export default DownloadButton;