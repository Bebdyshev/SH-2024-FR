'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TypingAnimation } from '@/components/ui/typing-animation';

interface ServicePopupProps {
  data: any; // Assuming 'data' will be an object containing the report's details
  onClose: () => void;
}

export const ServicePopup: React.FC<ServicePopupProps> = ({ data, onClose }) => {
  const [history, setHistory] = useState<any>(null); // State to store the report history
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Track current entry being typed
  const reportId = data?.id; // Assuming the reportId is available in the 'data' prop
  
  useEffect(() => {
    // Fetch the history data when the component mounts
    const fetchReportHistory = async () => {
      try {
        const response = await fetch(`http://20.64.237.199:4000/user/reports/${reportId}/history`);
        if (response.ok) {
          const historyData = await response.json();
          setHistory(historyData); // Store the fetched history data
        } else {
          console.error('Failed to fetch report history');
        }
      } catch (error) {
        console.error('Error fetching report history:', error);
      }
    };

    if (reportId) {
      fetchReportHistory();
    }
  }, [reportId]); // Only refetch if reportId changes

  console.log(history);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg w-[50%] h-[80%] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.05 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-4">{data?.exploit?.title}</h2>
          
          {/* Display the verdict */}
          <div className="mb-4">
            <strong>Вердикт: </strong>
            <span>{data?.verdict}</span>
          </div>

          {/* Display service domain */}
          <div className="mb-4">
            <strong>Домен сервиса: </strong>
            <span>{data?.service?.domain}</span>
          </div>

          {/* Display agent status */}
          <div className="mb-4">
            <strong>Статус агента: </strong>
            <span>{data?.agent?.status}</span>
          </div>

          {/* Display creation date */}
          <div className="mb-4">
            <strong>Время создания: </strong>
            <span>{data?.createdAt}</span>
          </div>

          {history || history?.length !== 0 ? (
            <div className="">
              <h3 className="font-semibold text-xl">Терминал</h3>
              <div className="bg-gray-900 text-white p-4 h-[350px] rounded-md font-mono text-sm overflow-auto whitespace-nowrap overflow-x-auto">
              {history ? (
                <div className="mb-4">
                {history.slice(0, currentIndex + 1).map((entry, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex">
                      <span className="text-gray-400 pr-[4px]">{"> "}</span>
                      <TypingAnimation 
                        text={" " + entry.command} 
                        duration={10} 
                        className="text-sm whitespace-nowrap"
                        onComplete={() => {
                          console.log("Typing complete!");
                          setCurrentIndex((prevIndex) => prevIndex + 1); // Переход к следующему элементу
                        }}
                      />
                    </div>
            
                    {/* Output будет показываться только после завершения печати команды */}
                    {currentIndex > index && (
                      <div className="mt-2 flex whitespace-nowrap overflow-x-auto">
                        <span className="text-gray-400 pr-[4px]">{"bash: "}</span>
                        {" " + entry.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              ) : (
                <div className="mb-4">Loading history...</div>
              )}


              </div>
            </div>
          ) : (
            <>
            <h3 className="font-semibold text-xl">Терминал</h3>
            <div className="bg-gray-900 text-white p-4 h-[350px] rounded-md font-mono text-sm overflow-auto whitespace-nowrap overflow-x-auto">
              <span className="text-gray-400 pr-[4px]">{"> "}</span>
            </div>
            </>

          )}


          <div className="flex justify-end space-x-2 mt-2">
            <Button className="w-full bg-gray-400 hover:bg-[#9ca4ac] w-20" onClick={onClose}>
              Назад
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
