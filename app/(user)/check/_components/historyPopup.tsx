import React from 'react';

interface HistoryPopupProps {
  onClose: () => void;
}

function HistoryPopup({ onClose }: HistoryPopupProps) {
  const history = [
    {
      id: 1,
      ip: '192.168.1.1',
      status: 'Уязвим',
      exploit: 'Exploit-123',
      date: '2024-12-08',
    },
    {
      id: 2,
      ip: '192.168.1.2',
      status: 'Не уязвим',
      exploit: null,
      date: '2024-12-07',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-4/5 md:w-1/2 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">История сканирований</h2>

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

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default HistoryPopup;
