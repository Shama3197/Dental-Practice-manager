import React from 'react';
import { format } from 'date-fns';

const LabworkTimeline = ({ progressImages = [] }) => (
  <div className="relative border-l-2 border-blue-200 pl-6">
    {progressImages.map((img, idx) => (
      <div key={idx} className="mb-8 flex items-center">
        <span className="absolute -left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {idx + 1}
        </span>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {img.url && (
            <img src={img.url} alt={img.stage} className="w-16 h-16 object-cover border rounded" />
          )}
          <div>
            <div className="font-semibold text-lg">{img.stage}</div>
            <div className="text-xs text-gray-500">{img.uploadedAt ? format(new Date(img.uploadedAt), 'yyyy-MM-dd HH:mm') : ''}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LabworkTimeline; 