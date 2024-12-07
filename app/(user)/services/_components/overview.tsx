"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { ServicePopup } from "./servicePopup";

export default function OverViewPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null); // Отслеживание выбранного элемента

  const data = [
    { id: 1, ipAddress: "192.168.0.1", domain: "example.com", vulnerability: { potential: 0, real: 2, total: 2 }, status: "Активен", lastUpdated: "2024-12-01", location: "Центр обработки данных 1" },
    { id: 2, ipAddress: "192.168.0.2", domain: "test.com", vulnerability: { potential: 3, real: 3, total: 6 }, status: "Неактивен", lastUpdated: "2024-11-28", location: "Центр обработки данных 2" },
    { id: 3, ipAddress: "192.168.0.3", domain: "demo.net", vulnerability: { potential: 5, real: 1, total: 6 }, status: "Активен", lastUpdated: "2024-12-05", location: "Центр обработки данных 3" },
  ];

  const formatDate = (dateString: string) => {
    const months = [
      "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
      "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
    ];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month}, ${year}`;
  };

  const openPopup = (item: any) => {
    setSelectedItem(item);  // Установить данные выбранного элемента
    setIsPopupOpen(true);    // Открыть всплывающее окно
  };

  const closePopup = () => {
    setIsPopupOpen(false);   // Закрыть всплывающее окно
    setSelectedItem(null);   // Очистить выбранный элемент
  };

  // Функция для определения цвета строки на основе количества уязвимостей
  const getRowColor = (vulnerabilities: number) => {
    if (vulnerabilities > 5) {
      return "bg-red-100 hover:bg-red-200"; // Высокая уязвимость, красный
    } else if (vulnerabilities > 2) {
      return "bg-yellow-100 hover:bg-yellow-200 "; // Средняя уязвимость, желтый
    } else {
      return "hover:bg-gray-100 ";
    }
  };

  return (
    <PageContainer scrollable>
      <div className="overflow-x-auto rounded-lg border border-[#5754de] mt-4 overflow-hidden ">
        {/* Структура таблицы */}
        <table className="table-auto border-collapse w-full">
          {/* Заголовок таблицы */}
          <thead className="bg-[#5754de]  text-white">
            <tr>
              <th className="px-4 py-2 border-l border-[#5754de]">ID</th>
              <th className="px-4 py-2">IP-адрес</th>
              <th className="px-4 py-2">Домен</th>
              <th className="px-4 py-2">Уязвимости</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Последняя проверка</th>
            </tr>
          </thead>
          {/* Тело таблицы */}
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={`${getRowColor(item.vulnerability.total)}`}
                onClick={() => openPopup(item)}
              >
                <td className="border border-[#5754de] px-4 py-2">{item.id}</td>
                <td className="border border-[#5754de] px-4 py-2">{item.ipAddress}</td>
                <td className="border border-[#5754de] px-4 py-2">{item.domain}</td>
                <td className="border border-[#5754de] px-4 py-2">{item.vulnerability.total}</td>
                <td className="border border-[#5754de] px-4 py-2">{item.status}</td>
                <td className="border border-[#5754de] px-4 py-2">{formatDate(item.lastUpdated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && <ServicePopup onClose={closePopup} data={selectedItem} />}
    </PageContainer>
  );
}
