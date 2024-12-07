// components/Modal.tsx
"use client";

import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4 text-black">Initial message</h2>
        <input
          type="text"
          placeholder="Exciting opportunity"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <div className="p-4 bg-gray-100 rounded-lg mb-4">
          <p className="mb-4 text-black">Hi Antoine,</p>
          <p className="text-black mb-4">[Message content goes here]</p>
          <p className="mb-4 text-black">Looking forward to connecting,</p>
          <p className="text-black">Allison</p>
        </div>

        {/* Assisted pre-screening section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="mr-2 text-black">Assisted pre-screening ✨</span>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-black text-sm">18/500 InMail credits</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={onClose}>
            Send to Antoine
          </button>
        </div>

        {/* Close button */}
        <button className="absolute top-2 right-2 text-black" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
