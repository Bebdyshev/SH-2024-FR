'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Service } from '@/constants/data';
import { AreaChart } from './area-graph';

interface ServicePopupProps {
  data: Service;
  onClose: () => void;
}

export const ServicePopup: React.FC<ServicePopupProps> = ({ data, onClose }) => {
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
        <div className="p-6 pb-2 border-b flex">
          <h2 className="text-[25px] font-bold">{data.domain}</h2>
          <p className="text-[25px] ml-auto">{data.ipAddress}</p>
        </div>
        <div className="p-6 pb-2">
          {/* Статус */}
          <div className="mb-4 flex">
            <div>
              <p className="text-lg font-medium">Статус:</p>
              <p
                className={`text-[17px] ${
                  data.status === 'Активен'
                    ? 'text-green-500'
                    : data.status === 'Неактивен'
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {data.status}
              </p>
            </div>
            <div className='ml-auto pl-5'>
              <p className="text-lg font-medium">Последняя проверка:</p>
              <p className="text-[17px] text-gray-500">{data.lastUpdated}</p>
            </div>
          </div>

          {/* Информация о сервисе */}
          <div className="mb-4 rounded overflow-hidden">
          <table className="table-auto w-full text-black border overflow-hidden">
            <thead className='border'>
              <tr>
                <th className="px-4 py-2 text-left border">Тип уязвимости</th>
                <th className="px-4 py-2 text-left border">Количество</th>
              </tr>
            </thead>
            <tbody className='border'>
              <tr className='border'>
                <td className="px-4 py-2 border">Потенциальные уязвимости</td>
                <td className="px-4 py-2">{data.vulnerability.potential}</td>
              </tr>
              <tr className='border'> 
                <td className="px-4 py-2 border">Реальные уязвимости</td>
                <td className="px-4 py-2">{data.vulnerability.real}</td>
              </tr>
              <tr className='border'>
                <td className="px-4 py-2 border">Общие уязвимости</td>
                <td className="px-4 py-2">{data.vulnerability.total}</td>
              </tr>
            </tbody>
          </table>
          </div>

          {/* Оценка уязвимости */}
          <div className="mb-4">
            <p className="text-lg font-medium">Оценка: {data.vulnerability.total > 5 ? 'Высокая уязвимость' : data.vulnerability.total > 2 ? 'Средняя уязвимость' : 'Низкая уязвимость'}</p>
          </div>
        </div>

        <div className="mt-auto flex justify-end space-x-2 p-6 ">
          <Button className="w-full bg-gray-400 hover:bg-[#9ca4ac] w-20" onClick={onClose}>
            Назад
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
