"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/user/reports/1/history'); 
        setHistory(response.data);
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="p-6">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">История сканирований</h2>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-200 px-4 py-2 text-left">IP/Домен</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Статус</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Эксплойт</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Дата</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td className="border border-gray-200 px-4 py-2">{entry.id}</td>
              <td className="border border-gray-200 px-4 py-2">{entry.ip}</td>
              <td className="border border-gray-200 px-4 py-2">{entry.status}</td>
              <td className="border border-gray-200 px-4 py-2">{entry.exploit || 'N/A'}</td>
              <td className="border border-gray-200 px-4 py-2">{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
