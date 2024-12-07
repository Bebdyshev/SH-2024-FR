"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/page-container";

export default function OverViewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  const [ipAddress, setIpAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    // Проверка: оба поля должны быть заполнены
    setIsButtonVisible(ipAddress.trim() !== "" && domain.trim() !== "");
  }, [ipAddress, domain]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStudentModalOpen(false);
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [studentModalOpen, isModalOpen]);

  return (
    <PageContainer scrollable>
      <div className="mx-10 flex flex-col gap-3">
        <div className="mt-[20%]">
          <label
            htmlFor="ipAddress"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            IP-адрес
          </label>
          <input
            id="ipAddress"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="Введите IP-адрес сервиса"
            className="border rounded-lg w-full h-10 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#5754de] focus:outline-none transition duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="domain"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Домен
          </label>
          <input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Введите домен сервиса"
            className="border rounded-lg w-full h-10 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#5754de] focus:outline-none transition duration-200"
          />
        </div>
        <button
          className={`h-10 py-2 px-6 rounded-lg transition-opacity duration-300 mt-3 ${
            isButtonVisible
              ? "opacity-100 bg-[#5754de] text-white hover:bg-[#4542b8]"
              : "opacity-0 pointer-events-none"
          }`}
          disabled={!isButtonVisible}
        >
          Отправить
        </button>
      </div>
    </PageContainer>
  );
}
