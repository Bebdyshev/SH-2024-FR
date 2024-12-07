'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Student } from '@/constants/data';
import { AreaChart } from './area-graph';

interface StudentPopupProps {
  studentData: Student;
  onClose: () => void;
}

// Function to determine danger level color
const getDangerLevelColor = (percentageDifference: number) => {
  console.log(percentageDifference)
  if (percentageDifference < 5) return 'bg-white'; // Белый
  if (percentageDifference <= 10) return 'bg-green-200'; // Зелёный
  if (percentageDifference <= 15) return 'bg-yellow-200'; // Жёлтый
  return 'bg-red-200'; // Красный
};

// Function to calculate percentage difference
const calculateDifference = (actual: number, predicted: number) => {
  if (actual === 0) return 0; // Return 0 for undefined difference
  return (Math.abs(predicted - actual) / actual) * 100;
};


export const StudentPopup: React.FC<StudentPopupProps> = ({ studentData, onClose }) => {
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
          <h2 className="text-[25px] font-bold">{studentData.student_name}</h2>
          <p className="text-[25px] ml-auto">{studentData.class_liter}</p>
        </div>
        <div className="p-6 pb-2">
          <p className="text-[15px] ml-auto">Куратор: {studentData.curator_name}</p>
          <table className="min-w-full table-auto mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border" colSpan={4}>
                  Score
                </th>
                <th className="px-4 py-2 border" colSpan={4}>
                  Predicted Score
                </th>
              </tr>
              <tr>
                <th className="px-4 py-1 border border-r">I</th>
                <th className="px-4 py-1 border border-r">II</th>
                <th className="px-4 py-1 border border-r">III</th>
                <th className="px-4 py-1 border border-r">IV</th>
                <th className="px-4 py-1 border border-r">I</th>
                <th className="px-4 py-1 border border-r">II</th>
                <th className="px-4 py-1 border border-r">III</th>
                <th className="px-4 py-1 border">IV</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                {studentData.actual_score.slice(0, 4).map((actualScore, index) => {
                  const predictedScore = studentData.predicted_score[index];
                  const percentageDifference = calculateDifference(actualScore, predictedScore);
                  const dangerColor = getDangerLevelColor(percentageDifference); // Определяем цвет для уровня опасности
                  return(
                    <td
                    key={`actual-${index}`}
                    className={`relative px-4 py-2 text-center border ${dangerColor}`} // Применяем цвет
                    >
                    {actualScore !== 0.0 ? `${actualScore.toFixed(1)}%` : 'ND'}
                  </td>
                  );
                })}

                {studentData.predicted_score.slice(0, 4).map((predictedScore, index) => {
                  const actualScore = studentData.actual_score[index];
                  const percentageDifference = calculateDifference(actualScore, predictedScore);
                  const dangerColor = getDangerLevelColor(percentageDifference); // Определяем цвет для уровня опасности

                  return (
                    <td
                      key={`predicted-${index}`}
                      className={`relative px-4 py-2 text-center border ${dangerColor}`} // Применяем цвет
                    >
                      {predictedScore !== 0.0 ? `${predictedScore.toFixed(1)}%` : 'ND'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          <div className='mt-4'>
          <AreaChart
            predicted_scores={studentData.predicted_score.slice(0, 4)}
            actual_score={studentData.actual_score.slice(0, 4)}
          />
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
