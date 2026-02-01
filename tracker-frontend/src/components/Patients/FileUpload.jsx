import { useState } from 'react';
import { FiUpload, FiX, FiImage, FiFile, FiVideo } from 'react-icons/fi';

const FileUpload = ({ files = [], onFilesChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      type: getFileType(file),
      name: file.name,
      description: '',
      file: file,
      category: 'diagnostic'
    }));

    onFilesChange([...files, ...newFiles]);
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) {
      return 'photo';
    } else if (file.type.startsWith('video/')) {
      return 'video';
    } else if (file.type === 'application/pdf') {
      return 'document';
    } else {
      return 'other';
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const updateFileDescription = (index, description) => {
    const newFiles = [...files];
    newFiles[index].description = description;
    onFilesChange(newFiles);
  };

  const updateFileCategory = (index, category) => {
    const newFiles = [...files];
    newFiles[index].category = category;
    onFilesChange(newFiles);
  };

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

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          id="file-upload"
          accept="image/*,video/*,application/pdf"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-gray-600">
            Drag and drop files here or click to upload
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Supports images, videos, and PDFs
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex items-start gap-4"
              >
                <div className="text-gray-500">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <select
                      value={file.category}
                      onChange={(e) => updateFileCategory(index, e.target.value)}
                      className="w-full p-2 border rounded text-sm"
                    >
                      <option value="diagnostic">Diagnostic</option>
                      <option value="case">Case</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={file.description}
                      onChange={(e) => updateFileDescription(index, e.target.value)}
                      placeholder="Add a description..."
                      className="w-full p-2 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 