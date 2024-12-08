"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import PageContainer from "@/components/layout/page-container";
import axiosInstance from "@/app/axios/instance";
import { ServicePopup } from "./servicePopup";

export default function OverViewPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [data, setServiceData] = useState<any>([]); // Initialize as empty array

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("JWT token not found.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axiosInstance.get(`/user/reports?userId=${userId}`);
        
        // Sort the data immediately after fetching
        const sortedData = response.data.sort((a: any, b: any) => {
          const priority = ["potential vulnerability", "proccessing..."];
          const verdictA = a.verdict;
          const verdictB = b.verdict;

          // Give priority to rows with colored verdicts
          if (priority.includes(verdictA) && !priority.includes(verdictB)) return -1;
          if (!priority.includes(verdictA) && priority.includes(verdictB)) return 1;
          return 0; // If both are the same, leave their order unchanged
        });

        setServiceData(sortedData); // Set sorted data in state
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const months = [
      "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
      "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
    ];
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Неизвестно";
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const openPopup = (item: any) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  const getRowColor = (verdict: string) => {
    if (verdict === "proccessing...") return "bg-white hover:bg-gray-100";
    if (verdict === "potential vulnerability") return "bg-orange-200 hover:bg-orange-300";
    return "bg-green-200 hover:bg-green-300";
  };

  const capitalize = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  console.log(data); // Log sorted data for debugging

  return (
    <PageContainer>
      <h1 className="text-[23px] font-bold">Обзор отчетов</h1>

      <table className="min-w-full table-auto mt-4 bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2">Exploit Title</th>
            <th className="border px-4 py-2">Verdict</th>
            <th className="border px-4 py-2">Service Domain</th>
            <th className="border px-4 py-2">Agent Status</th>
            <th className="border px-4 py-2">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any) => (
            <tr
              key={item.id}
              className={getRowColor(item.verdict) + ' transition-colors duration-100 ease-in-out'}
              onClick={() => openPopup(item)}
            >
              <td className="border px-4 py-2">{item.exploit.title}</td>
              <td className="border px-4 py-2">{capitalize(item.verdict)}</td>
              <td className="border px-4 py-2">{item.service.domain}</td>
              <td className="border px-4 py-2">{capitalize(item.agent.status)}</td>
              <td className="border px-4 py-2">{formatDate(item.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedItem && (
        <ServicePopup data={selectedItem} onClose={closePopup} />
      )}
    </PageContainer>
  );
}
