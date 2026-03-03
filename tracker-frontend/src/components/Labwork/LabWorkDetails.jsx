import React, { useEffect, useState } from 'react';
import { getLabWork } from '../../api/labwork';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import LabWorkTimeline from './LabworkTimeline';

const LabWorkDetails = () => {
  const { id } = useParams();
  const [labWork, setLabWork] = useState(null);

  useEffect(() => {
    getLabWork(id).then(res => setLabWork(res.data));
  }, [id]);

  if (!labWork) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Lab Work Details</h2>
      <div className="mb-2">
        <span className="font-semibold">Patient: </span>
        <Link to={`/patients/${labWork.patientId?._id || ''}`} className="text-blue-600 underline">
          {labWork.patientId?.name || 'Unknown'}
        </Link>
      </div>
      <div className="mb-2"><span className="font-semibold">Case Type:</span> {labWork.caseType}</div>
      <div className="mb-2"><span className="font-semibold">Date Sent:</span> {labWork.dateSent ? format(new Date(labWork.dateSent), 'yyyy-MM-dd') : ''}</div>
      <div className="mb-2"><span className="font-semibold">Status:</span> {labWork.status}</div>
      <div className="mb-2"><span className="font-semibold">Notes:</span> {labWork.notes}</div>
      <div className="mb-4">
        <span className="font-semibold">Lab Files:</span>
        <ul className="list-disc ml-6">
          {labWork.labFiles.map((url, i) => (
            <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">File {i + 1}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <span className="font-semibold">Progress Images:</span>
        <div className="mt-2 space-y-4">
          {labWork.progressImages.map((img, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={img.url} alt={img.stage} className="w-16 h-16 object-cover border rounded" />
              <div>
                <div className="font-semibold">{img.stage}</div>
                <div className="text-xs text-gray-500">{img.uploadedAt ? format(new Date(img.uploadedAt), 'yyyy-MM-dd HH:mm') : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span className="font-semibold">Progress Timeline:</span>
        <LabWorkTimeline progressImages={labWork.progressImages} />
      </div>
    </div>
  );
};

export default LabWorkDetails; 