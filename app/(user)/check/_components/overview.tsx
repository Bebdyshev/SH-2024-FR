"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/page-container";
import axiosInstance from "@/app/axios/instance";
import { useRouter } from "next/navigation";
import HistoryPopup from "./historyPopup";

export default function OverViewPage() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [ipError, setIpError] = useState("");
  const [domainError, setDomainError] = useState("");
  const [touched, setTouched] = useState({ ip: false, domain: false }); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 
  
  const router = useRouter(); 

  const validateIpAddress = (ip: string) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;
    if (!ipRegex.test(ip)) {
      return "Некорректный IP-адрес. Пример: <b>0.0.0.0</b>";
    }
    return "";
  };

  const validateDomain = (dom: string) => {
    const domainRegex =
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(dom)) {
      return "Некорректное доменное имя. Пример: <b>google.com</b>";
    }
    return "";
  };

  useEffect(() => {
    const ipValidationError = validateIpAddress(ipAddress);
    const domainValidationError = validateDomain(domain);

    setIpError(ipValidationError);
    setDomainError(domainValidationError);

    setIsButtonVisible(
      ipValidationError === "" &&
        domainValidationError === "" &&
        ipAddress.trim() !== "" &&
        domain.trim() !== ""
    );
  }, [ipAddress, domain]);

  const handleFocus = (field: "ip" | "domain") => {
    setTouched({ ...touched, [field]: true });
  };

  const submitForm = async () => {
    const token = localStorage.getItem('access_token');

    try {
      const res = await axiosInstance.post("/user/service", {
        token: token,
        ip: ipAddress,
        domain: domain,
      });
      console.log(res);
      router.push("/services"); 
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <PageContainer scrollable>
      <div className="mx-10 flex flex-col gap-3">
        <div className="mt-[12%]">
          <h2 className="text-[23px] font-semibold text-center">Проверка сервиса на уязвимости</h2>
          <label
            htmlFor="ipAddress"
            className="block text-lg font-semibold text-gray-700 mb-2 mt-4"
          >
            IP-адрес
          </label>
          <input
            id="ipAddress"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            onFocus={() => handleFocus("ip")}
            placeholder="Введите IP-адрес сервиса"
            className={`border rounded-lg w-full h-10 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:outline-none transition duration-200 ${
              ipError && !(ipAddress === "")
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#5754de]"
            }`}
          />
          {!(ipAddress==="") && ipError && (
            <p
              className="text-red-500 text-sm mt-1"
              dangerouslySetInnerHTML={{ __html: ipError }}
            />
          )}
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
            onFocus={() => handleFocus("domain")}
            placeholder="Введите домен сервиса"
            className={`border rounded-lg w-full h-10 px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:outline-none transition duration-200 ${
              domainError && !(domain==="")
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[#5754de]"
            }`}
          />
          {!(domain === "") && domainError && (
            <p
              className="text-red-500 text-sm mt-1"
              dangerouslySetInnerHTML={{ __html: domainError }}
            />
          )}
        </div>
        <button
          className={`h-10 py-2 px-6 rounded-lg transition-opacity duration-300 mt-3 ${
            isButtonVisible
              ? "opacity-100 pointer-events-auto bg-[#5754de] text-white hover:bg-[#4542b8]"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={submitForm}
        >
          Отправить
        </button>
      </div>
    </PageContainer>
  );
}
