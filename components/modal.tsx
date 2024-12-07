import React from 'react';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-11/12 sm:w-3/4 max-w-4xl rounded-lg p-4 shadow-lg relative text-white">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal content */}
        <h2 className="text-2xl font-semibold mb-6">Open resume</h2>

        {/* Left Sidebar */}
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full sm:w-1/4 bg-gray-900 p-4 rounded-lg mb-4 sm:mb-0">
            <ul className="space-y-2">
              <li className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                Examples
              </li>
              <li className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                Recent
              </li>
              <li className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                Google Drive
              </li>
              <li className="hover:bg-gray-700 p-2 rounded-md cursor-pointer">
                Upload
              </li>
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="w-full sm:w-3/4 bg-gray-700 p-4 rounded-lg">
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search notebooks"
                className="w-full p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* File List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto sm:table-fixed">
                <thead>
                  <tr>
                    <th className="w-1/2 py-2">Title</th>
                    <th className="w-1/4 py-2">Owner</th>
                    <th className="w-1/4 py-2">Last opened</th>
                    <th className="w-1/4 py-2">Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example rows */}
                  {[
                    { title: 'Резюме Монтажник', owner: 'Abdulaziz Gabitov', opened: '8 November', modified: '10 November' },
                    { title: 'CV Frontend developer', owner: 'Abdulaziz Gabitov', opened: '9 November', modified: '9 November' },
                    { title: 'CV Строитель', owner: 'Abdulaziz Gabitov', opened: '9 November', modified: '9 November' },
                    { title: 'Резюме Телеоператор', owner: 'Abdulaziz Gabitov', opened: '8 November', modified: '8 November' },
                  ].map((file, index) => (
                    <tr key={index} className="border-b border-gray-600">
                      <td className="py-2">
                        <span className="text-blue-400 cursor-pointer">
                          {file.title}
                        </span>
                      </td>
                      <td className="py-2">{file.owner}</td>
                      <td className="py-2">{file.opened}</td>
                      <td className="py-2">{file.modified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* New Resume Button */}
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
              + New resume
            </button>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
