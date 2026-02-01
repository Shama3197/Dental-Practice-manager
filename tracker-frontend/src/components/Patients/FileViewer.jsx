import { useState } from 'react';
import { FiImage, FiFile, FiVideo, FiX } from 'react-icons/fi';

const FileViewer = ({ files = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const getFileIcon = (type) => {
    switch (type) {
      case 'photo':
        return <FiImage className="w-6 h-6" />;
      case 'video':
        return <FiVideo className="w-6 h-6" />;
      default:
        return <FiFile className="w-6 h-6" />;
    }
  };

  const renderPreview = (file) => {
    switch (file.type) {
      case 'photo':
        return (
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[500px] object-contain"
          />
        );
      case 'video':
        return (
          <video
            src={file.url}
            controls
            className="max-w-full max-h-[500px]"
          />
        );
      case 'document':
        return (
          <iframe
            src={file.url}
            className="w-full h-[500px]"
            title={file.name}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-[500px] bg-gray-100">
            <FiFile className="w-16 h-16 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedFile(file)}
          >
            <div className="flex items-start gap-4">
              <div className="text-gray-500">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                </p>
                {file.description && (
                  <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedFile.name}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              {renderPreview(selectedFile)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileViewer; 